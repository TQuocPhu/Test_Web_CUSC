import { Request, Response } from "express";
import { TemplateService } from "../services/templates.service";
import { CreateTemplateStaticSchema, UpdateTemplateVersionSchema } from "../validations/templates.schema";
import { SubmitFormSchema } from "../validations/submissions.schema";
import { ZodError } from 'zod';

export class TemplateAction {
    private templateService = new TemplateService();

    createTemplate = async (req: Request, res: Response): Promise<void> => {
        try {
            // const adminId = req.user.id
            const adminId = 1;

            const staticData = CreateTemplateStaticSchema.parse(req.body.static);
            const dynamicData = UpdateTemplateVersionSchema.parse(req.body.dynamic);

            const staticPayload = {
                title: staticData.title,
                slug: staticData.slug,
                shortDescription: staticData.shortDescription, // Chỉ định rõ ràng trường cho Drizzle
                pricingType: staticData.pricingType,           // Chỉ định rõ ràng trường cho Drizzle
                price: staticData.price,
                visibility: staticData.visibility,
                tags: staticData.tags,
                creatorId: adminId,                            // Đút adminId vào đúng trường 'creatorId' của bảng formTemplates
            };

            const dynamicPayload = {
                version: dynamicData.version,
                schemaJson: dynamicData.schemaJson,            // Cục SchemaJson khổng lồ đã qua Zod duyệt
                description: dynamicData.description,
                instructions: dynamicData.instructions,
                requiredDocuments: dynamicData.requiredDocuments,
                changeLogs: dynamicData.changeLogs,
                isPublished: dynamicData.isPublished,
                updatedBy: adminId,                            // Đút adminId vào đúng trường 'updatedBy' của bảng templateVersions
            };

            // 4. Gọi xuống tầng Service chạy luồng tạo (Truyền 2 cục payload sạch sẽ vừa map xong vào)
            const result = await this.templateService.createTemplateFlow(adminId, staticPayload, dynamicPayload);

            res.status(201).json({
                success: true,
                message: "Tạo cấu trúc thiết kế biểu mẫu doanh nghiệp thành công!",
                data: result
            })
        } catch (error: unknown) {
            let errorMessage = "Đã xảy ra lỗi hệ thống";

            // 1. Nếu lỗi do Zod Validate thất bại
            if (error instanceof ZodError) {
                // Lấy thông báo lỗi của thằng đầu tiên bị sai, hoặc map nối chuỗi lại
                errorMessage = error.issues[0]?.message || "Dữ liệu đầu vào không hợp lệ";

                // Hoặc nếu muốn nối tất cả các lỗi lại với nhau (nếu sai nhiều trường cùng lúc):
                // errorMessage = error.issues.map(e => e.message).join(", ");
            }
            // 2. Nếu lỗi do Database hoặc các lỗi Object khác
            else if (error && typeof error === 'object' && 'message' in error) {
                const dbError = error as { sqlMessage?: string; message: string };
                errorMessage = dbError.sqlMessage || dbError.message;
            }
            // 3. Các trường hợp còn lại
            else if (error instanceof Error) {
                errorMessage = error.message;
            }

            res.status(400).json({ success: false, error: errorMessage });
        }
    }

    getAllTemplates = async (req: Request, res: Response): Promise<void> => {
        try {
            const templates = await this.templateService.getAllTemplates();
            res.status(200).json({ success: true, count: templates.length, data: templates });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
            res.status(400).json({ success: false, error: errorMessage });
        }
    }

    getTemplateDetail = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.params.id) {
                res.status(400).json({ success: false, error: "Thiếu tham số ID trên URL" });
                return;
            }
            const templateId = parseInt(String(req.params.id));

            const templateDetail = await this.templateService.getDetailAndTrackView(templateId);

            if (!templateDetail || !templateDetail.template) {
                res.status(404).json({ success: false, error: 'Template not found' });
                return;
            }

            const tmpl = templateDetail.template;

            res.status(200).json({
                success: true,
                message: "Tải cấu trúc Schema JSON thành công!",
                data: {
                    id: tmpl.id,
                    title: tmpl.title,
                    slug: tmpl.slug,
                    viewCount: tmpl.viewCount, // Trả ra thông số lượt xem đã tăng
                    pricingType: tmpl.pricingType,
                    price: tmpl.price,
                    structure: templateDetail.version // Trả nguyên cục JSON kéo thả bao gồm mảng 'pages' ở đây
                }
            });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
            res.status(400).json({ success: false, error: errorMessage });
        }
    }

    updateTemplate = async (req: Request, res: Response): Promise<void> => {
        try {
            const templateId = parseInt(String(req.params.id));
            const partialStaticData = CreateTemplateStaticSchema.partial().parse(req.body);

            await this.templateService.updateTemplateDetails(templateId, partialStaticData);
            res.status(200).json({ success: true, message: "Cập nhật thông tin biểu mẫu thành công!" });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
            res.status(400).json({ success: false, error: errorMessage });
        }
    };

    submitForm = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = 2; // Giả định ID của người dùng đăng nhập hệ sinh thái điền đơn
            const templateId = parseInt(String(req.params.id));
            const submitInput = SubmitFormSchema.parse(req.body);

            const result = await this.templateService.handleUserSubmission(userId, templateId, submitInput);

            res.status(200).json({
                success: true,
                message: submitInput.status === 'DRAFT' ? "Hệ thống đã tự động lưu bản nháp!" : "Nộp đơn thành công, đang chuyển luồng duyệt!",
                data: result
            });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
            res.status(400).json({ success: false, error: errorMessage });
        }
    };
}
import { Request, Response } from "express";
import { TemplateService } from "../services/templates.service";
import { CreateTemplateStaticSchema, UpdateTemplateVersionSchema } from "../validations/templates.schema";
import { SubmitFormSchema } from "../validations/submissions.schema";
import { ZodError } from 'zod';
import { sendSuccess, sendError } from "@/src/utils/api-response";

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

            res.status(201).json(
                sendSuccess(result, "Tạo cấu trúc thiết kế biểu mẫu doanh nghiệp thành công!", 201)
            );
        } catch (error: unknown) {
            this.handleException(res, error, "Đã xảy ra lỗi khi tạo cấu trúc thiết kế biểu mẫu");
        }
    }

    getAllTemplates = async (req: Request, res: Response): Promise<void> => {
        try {
            const templates = await this.templateService.getAllTemplates();
            res.status(200).json(
                sendSuccess(templates, "Tải danh sách cấu trúc biểu mẫu thành công!", 200, templates.length)
            );
        } catch (error: unknown) {
            this.handleException(res, error, "Không thể tải danh sách biểu mẫu");
        }
    }

    getTemplateDetail = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.params.id) {
                res.status(400).json(sendError("Thiếu tham số ID biểu mẫu trên URL", 400, "VALIDATION_ERROR"));
                return;
            }
            const templateId = parseInt(String(req.params.id));

            const templateDetail = await this.templateService.getDetailAndTrackView(templateId);

            if (!templateDetail || !templateDetail.template) {
                res.status(404).json(sendError("Không tìm thấy cấu trúc thiết kế biểu mẫu yêu cầu", 404, "NOT_FOUND"));
                return;
            }

            const tmpl = templateDetail.template;
            const responseData = {
                id: tmpl.id,
                title: tmpl.title,
                slug: tmpl.slug,
                viewCount: tmpl.viewCount,
                pricingType: tmpl.pricingType,
                price: tmpl.price,
                structure: templateDetail.version
            };

            res.status(200).json(
                sendSuccess(responseData, "Tải thông tin cấu trúc thiết kế chi tiết thành công!")
            );
        } catch (error: unknown) {
            this.handleException(res, error, "Không thể lấy thông tin chi tiết biểu mẫu");
        }
    }

    updateTemplate = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.params.id) {
                res.status(400).json(sendError("Thiếu tham số ID trên URL", 400, "VALIDATION_ERROR"));
                return;
            }
            const templateId = parseInt(String(req.params.id));
            const partialStaticData = CreateTemplateStaticSchema.partial().parse(req.body);

            const result = await this.templateService.updateTemplateDetails(templateId, partialStaticData);
            
            res.status(200).json(
                sendSuccess(result, "Cập nhật thông tin cấu trúc biểu mẫu thành công!")
            );
        } catch (error: unknown) {
            this.handleException(res, error, "Cập nhật thông tin biểu mẫu thất bại");
        }
    };

    submitForm = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.params.id) {
                res.status(400).json(sendError("Thiếu tham số ID trên URL", 400, "VALIDATION_ERROR"));
                return;
            }
            const userId = 2; // Giả định ID của người dùng đăng nhập hệ sinh thái điền đơn
            const templateId = parseInt(String(req.params.id));
            const submitInput = SubmitFormSchema.parse(req.body);

            const result = await this.templateService.handleUserSubmission(userId, templateId, submitInput);

            const customMessage = submitInput.status === 'DRAFT' 
                ? "Hệ thống đã tự động lưu lại bản nháp phiếu thành công!" 
                : "Nộp đơn thành công, đang chuyển lên luồng hội đồng duyệt!";

            res.status(200).json(
                sendSuccess(result, customMessage)
            );
        } catch (error: unknown) {
            this.handleException(res, error, "Quá trình gửi thông tin nộp đơn thất bại");
        }
    };


    private handleException(res: Response, error: unknown, defaultMessage: string): void {
        // 1. Lỗi Validation do ép kiểu hoặc thiếu dữ liệu từ Zod
        if (error instanceof ZodError) {
            const formattedErrors = error.issues.reduce((acc: Record<string, string>, curr) => {
                const path = curr.path.join(".");
                acc[path] = curr.message;
                return acc;
            }, {});

            res.status(400).json(
                sendError("Dữ liệu đầu vào không hợp lệ", 400, "VALIDATION_ERROR", formattedErrors)
            );
            return;
        }

        // 2. Lỗi Database (Trùng lặp Unique slug, lỗi ràng buộc khóa ngoại Drizzle ORM...)
        if (error && typeof error === 'object' && ('sqlMessage' in error || 'code' in error)) {
            const dbError = error as { sqlMessage?: string; message: string };
            const msg = dbError.sqlMessage || dbError.message || "Lỗi xung đột dữ liệu hệ thống";
            res.status(500).json(
                sendError(msg, 500, "DATABASE_ERROR")
            );
            return;
        }

        // 3. Các lỗi Runtime, logic Error phát sinh khác
        const finalMessage = error instanceof Error ? error.message : defaultMessage;
        res.status(500).json(
            sendError(finalMessage, 500, "SYSTEM_ERROR")
        );
    }
}
import { AppError } from "@/src/utils/app-error";
import { TemplateRepository } from "../repositories/templates.repository";
import { SubmitFormInput } from "../types/submissions.type";
import { CreateTemplateStaticInput, UpdateTemplateVersionInput } from "../types/templates.types";

export class TemplateService {
    private templateRepository = new TemplateRepository();

    async createTemplateFlow(creatorId: number, staticData: CreateTemplateStaticInput, dynamicData: UpdateTemplateVersionInput) {

        const templateId = await this.templateRepository
            .createStaticTemplate({ ...staticData, creatorId });

        const versionId = await this.templateRepository
            .createTemplateVersion(templateId, { ...dynamicData, updatedBy: creatorId });

        return { templateId, versionId };
    }

    async getAllTemplates() {
        return await this.templateRepository.getAllTemplates();
    }

    async getDetailAndTrackView(id: number) {

        const data = await this.templateRepository.getTemplateWithLastVersion(id);

        if (!data.template) throw new AppError("Không tìm thấy biểu mẫu yêu cầu", 404, "NOT_FOUND");

        return data;
    }

    async updateTemplateDetails(id: number, data: Partial<CreateTemplateStaticInput>) {

        const existData = await this.templateRepository.getTemplateWithLastVersion(id);

        // Ném lỗi 404 chủ động khi cập nhật mẫu
        if (!existData.template) {
            throw new AppError("Không tìm thấy thông tin biểu mẫu cần cập nhật", 404, "NOT_FOUND");
        }

        return await this.templateRepository.updateTemplate(id, data);
    }

    async updateTemplateDetail(id: number,
        staticData: Partial<CreateTemplateStaticInput>,
        schemaJson?: any,
        adminId?: number,
        versionDescription?: string) {
        const existData = await this.templateRepository.getTemplateWithLastVersion(id);

        if (!existData.template) {
            throw new AppError("Không tìm thấy thông tin biểu mẫu cần cập nhật", 404, "NOT_FOUND");
        }

        if (Object.keys(staticData).length > 0) {
            await this.templateRepository.updateTemplate(id, staticData);
        }

        if (schemaJson) {
            const creatorId = adminId ?? 1;
            const oldVersion = existData.version?.version || "1.0.0";

            const versionParts = oldVersion.split('.');

            if (versionParts.length === 3) {
                versionParts[2] = String(parseInt(versionParts[2]) + 1);
            } else {
                versionParts[0] = "1"; versionParts[1] = "0"; versionParts[2] = "0";
            }

            const newVersionStr = versionParts.join('.');

            const dynamicPayload = {
                version: newVersionStr,
                schemaJson: schemaJson, // Cục JSON cấu trúc kéo thả đầy đủ diện mạo mới
                description: versionDescription || `Cập nhật thiết kế giao diện vào ngày ${new Date().toLocaleDateString('vi-VN')}`,
                instructions: existData.version?.instructions ?? undefined,
                requiredDocuments: existData.version?.requiredDocuments ?? undefined,
                changeLogs: `Tự động nâng cấp lên phiên bản ${newVersionStr}`,
                isPublished: 1
            }

            await this.templateRepository.createTemplateVersion(id, {
                ...dynamicPayload,
                updatedBy: creatorId
            });
        }

        return true;
    }

    async handleUserSubmission(userId: number, templateId: number, input: SubmitFormInput) {
        const checkTemplate = await this.templateRepository.getTemplateWithLastVersion(templateId);

        // Điền đơn vào cái ID không tồn tại -> Ném 404
        if (!checkTemplate || !checkTemplate.template) {
            throw new AppError(`Không tìm thấy cấu trúc thiết kế biểu mẫu với mã ID: ${templateId}`, 404, "NOT_FOUND");
        }

        // Check xem version người dùng đang điền có khớp hoặc có tồn tại không
        // Giả sử hàm getTemplateWithLastVersion trả về version hiện tại là checkTemplate.version
        // Nếu ID version gửi lên từ body không trùng với version hiện tại thì chặn lại ngay
        if (!checkTemplate.version || checkTemplate.version.id !== input.templateVersionId) {
            throw new AppError(
                `Phiên bản thiết kế biểu mẫu (ID: ${input.templateVersionId}) không hợp lệ hoặc đã bị xóa!`,
                404,
                "NOT_FOUND"
            );
        }

        return await this.templateRepository.createSubmission(userId, templateId, input);
    }
}
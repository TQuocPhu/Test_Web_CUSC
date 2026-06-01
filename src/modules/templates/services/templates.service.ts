import { TemplateRepository } from "../repositories/templates.repository";
import { SubmitFormInput } from "../types/submissions.type";
import { CreateTemplateStaticInput, UpdateTemplateVersionInput } from "../types/templates.types";

export class TemplateService {
    private templateRepository = new TemplateRepository();

    async createTemplateFlow(creatorId: number, staticData: CreateTemplateStaticInput, dynamicData: UpdateTemplateVersionInput) {

        const templateId = await this.templateRepository
                    .createStaticTemplate({ ...staticData, creatorId });

        const versionId = await this.templateRepository
                    .createTemplateVersion(templateId, {...dynamicData, updatedBy: creatorId});
        
        return { templateId, versionId };
    }

    async getAllTemplates() {
        return await this.templateRepository.getAllTemplates();
    }

    async getDetailAndTrackView(id: number) {

        const data = await this.templateRepository.getTemplateWithLastVersion(id);

        if(!data.template) throw new Error("Không tìm thấy biểu mẫu yêu cầu");

        return data;
    }

    async updateTemplateDetails(id: number, data: Partial<CreateTemplateStaticInput>) {
        return await this.templateRepository.updateTemplate(id, data);
    }

    async handleUserSubmission(userId: number, templateId: number, input: SubmitFormInput) {
        return await this.templateRepository.createSubmission(userId, templateId, input);
    }
}
import { db } from "@/src/db";
import { CreateTemplateStaticInput, UpdateTemplateVersionInput } from "../types/templates.types";
import { formSubmissions, formTemplates, templateVersions } from "@/src/db/schema";
import { eq, sql } from "drizzle-orm";
import { SubmitFormInput } from "../types/submissions.type";

export class TemplateRepository {

    async createStaticTemplate(data: CreateTemplateStaticInput & { creatorId: number }) {
        const [result] = await db.insert(formTemplates).values({
            title: data.title,
            slug: data.slug,
            shortDescription: data.shortDescription ?? null, // Nếu undefined thì biến thành null
            fullDescription: data.fullDescription ?? null,
            coverImage: data.coverImage ?? null,
            pricingType: data.pricingType ?? "FREE",
            price: data.price ?? 0,
            visibility: data.visibility ?? "PUBLIC",
            tags: data.tags ?? null,
            creatorId: data.creatorId,
            status: 'ACTIVE',

            featured: 0,
            allowDownload: 1,
            allowEform: 1,
            allowPreview: 1,
            viewCount: 0,
            totalDownloads: 0,
            totalUsages: 0,
            totalShares: 0,
            favouriteCount: 0,
        })

        return result.insertId;
    }


    async createTemplateVersion(templateId: number, data: UpdateTemplateVersionInput & { updatedBy: number }) {
        const [result] = await db.insert(templateVersions).values({
            templateId,
            version: data.version ?? "1.0.0",
            schemaJson: data.schemaJson, // Giữ nguyên cục JSON
            description: data.description ?? null,
            instructions: data.instructions ?? null,
            requiredDocuments: data.requiredDocuments ?? null,
            changeLogs: data.changeLogs ?? null,
            isPublished: data.isPublished ?? 1,
            updatedBy: data.updatedBy,
        });

        const versionId = result.insertId;

        await db.update(formTemplates)
            .set({ latestVersionId: versionId })
            .where(eq(formTemplates.id, templateId));

        return versionId;
    }

    async getAllTemplates() {
        return await db.select().from(formTemplates).where(eq(formTemplates.status, 'ACTIVE'));
    }

    async getTemplateWithLastVersion(id: number) {
        await db.update(formTemplates)
            .set({ viewCount: sql`${formTemplates.viewCount} + 1` })
            .where(eq(formTemplates.id, id));

        const template = await db.query.formTemplates.findFirst(
            { where: eq(formTemplates.id, id) }
        )

        if (!template || !template.latestVersionId) {
            return { template, version: null };
        }

        const version = await db.query.templateVersions.findFirst({
            where: eq(templateVersions.id, template.latestVersionId)
        });

        return { template, version };
    }

    async updateTemplate(id: number, data: Partial<CreateTemplateStaticInput>) {
        await db.update(formTemplates)
            .set(data)
            .where(eq(formTemplates.id, id));

        return true;
    }

    async createSubmission(submitterId: number, templateId: number, data: SubmitFormInput) {
        const submissionCode = `G2B-${templateId}-${Date.now().toString().slice(-6)}`;
        const [result] = await db.insert(formSubmissions).values({
            submissionCode,
            templateId,
            templateVersionId: data.templateVersionId,
            submitterId,
            status: data.status,
            dataJson: data.dataJson,
            qrVerifyToken: data.status === 'PENDING' ? `VERIFY-${submissionCode}` : null,
        });

        return { submissionId: result.insertId, submissionCode }
    }
}
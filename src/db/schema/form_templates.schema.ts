import {
  mysqlTable,
  int,
  varchar,
  text,
  timestamp,
  bigint,
} from "drizzle-orm/mysql-core";
import { users } from "./users.schema";

export const formTemplates = mysqlTable('form_templates', {
  id: int('id').primaryKey().autoincrement(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  shortDescription: varchar('short_description', { length: 500 }),
  fullDescription: text('full_description'),
  coverImage: varchar('cover_image', { length: 555 }),
  creatorId: bigint('creator_id', { mode: 'number' }).references(() => users.id),
  visibility: varchar('visibility', { length: 50 }).default('PUBLIC'), // PUBLIC, PRIVATE
  pricingType: varchar('pricing_type', { length: 50 }).default('FREE'), // FREE, PAID
  price: int('price').default(0),
  status: varchar('status', { length: 50 }).default('ACTIVE'), // ACTIVE, INACTIVE
  tags: varchar('tags', { length: 255 }), // Lưu dạng chuỗi "hành chính, nhân sự" hoặc mảng JSON string
  featured: int('featured').default(0), // 0: Thường, 1: Nổi bật
  allowDownload: int('allow_download').default(1),
  allowEform: int('allow_eform').default(1),
  allowPreview: int('allow_preview').default(1),
  latestVersionId: int('latest_version_id'), // Sẽ cập nhật sau khi có bảng version bên dưới
  viewCount: int('view_count').default(0),
  totalDownloads: int('total_downloads').default(0),
  totalUsages: int('total_usages').default(0),
  totalShares: int('total_shares').default(0),
  favouriteCount: int('favourite_count').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});
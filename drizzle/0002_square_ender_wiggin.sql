CREATE TABLE `template_versions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`template_id` int NOT NULL,
	`version` varchar(50) NOT NULL,
	`schema_json` json NOT NULL,
	`html_content` text,
	`css_content` text,
	`description` text,
	`instructions` text,
	`required_documents` text,
	`change_logs` text,
	`effective_date` timestamp,
	`is_published` int DEFAULT 0,
	`updated_by` int,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `template_versions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `form_submissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`submission_code` varchar(100) NOT NULL,
	`template_id` int NOT NULL,
	`template_version_id` int NOT NULL,
	`submitter_id` int NOT NULL,
	`status` varchar(50) DEFAULT 'DRAFT',
	`work_flow_status` varchar(100),
	`current_step` int DEFAULT 1,
	`data_json` json,
	`meta_json` json,
	`qr_verify_token` varchar(255),
	`last_auto_saved_at` timestamp,
	`approved_at` timestamp,
	`rejected_at` timestamp,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `form_submissions_id` PRIMARY KEY(`id`),
	CONSTRAINT `form_submissions_submission_code_unique` UNIQUE(`submission_code`)
);
--> statement-breakpoint
ALTER TABLE `form_templates` RENAME COLUMN `favorite_count` TO `favourite_count`;--> statement-breakpoint
ALTER TABLE `form_templates` DROP INDEX `form_templates_slug_unique`;--> statement-breakpoint
ALTER TABLE `form_templates` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `form_templates` MODIFY COLUMN `short_description` varchar(500);--> statement-breakpoint
ALTER TABLE `form_templates` MODIFY COLUMN `cover_image` varchar(555);--> statement-breakpoint
ALTER TABLE `form_templates` MODIFY COLUMN `creator_id` int;--> statement-breakpoint
ALTER TABLE `form_templates` MODIFY COLUMN `visibility` varchar(50) DEFAULT 'PUBLIC';--> statement-breakpoint
ALTER TABLE `form_templates` MODIFY COLUMN `pricing_type` varchar(50) DEFAULT 'FREE';--> statement-breakpoint
ALTER TABLE `form_templates` MODIFY COLUMN `price` int;--> statement-breakpoint
ALTER TABLE `form_templates` MODIFY COLUMN `price` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `form_templates` MODIFY COLUMN `status` varchar(50) DEFAULT 'ACTIVE';--> statement-breakpoint
ALTER TABLE `form_templates` MODIFY COLUMN `tags` varchar(255);--> statement-breakpoint
ALTER TABLE `form_templates` MODIFY COLUMN `featured` int;--> statement-breakpoint
ALTER TABLE `form_templates` MODIFY COLUMN `featured` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `form_templates` MODIFY COLUMN `allow_download` int DEFAULT 1;--> statement-breakpoint
ALTER TABLE `form_templates` MODIFY COLUMN `allow_eform` int DEFAULT 1;--> statement-breakpoint
ALTER TABLE `form_templates` MODIFY COLUMN `allow_preview` int DEFAULT 1;--> statement-breakpoint
ALTER TABLE `form_templates` MODIFY COLUMN `latest_version_id` int;--> statement-breakpoint
ALTER TABLE `permissions` ADD `created_at` timestamp DEFAULT (now()) NOT NULL;--> statement-breakpoint
ALTER TABLE `template_versions` ADD CONSTRAINT `template_versions_template_id_form_templates_id_fk` FOREIGN KEY (`template_id`) REFERENCES `form_templates`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `template_versions` ADD CONSTRAINT `template_versions_updated_by_users_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `form_submissions` ADD CONSTRAINT `form_submissions_template_id_form_templates_id_fk` FOREIGN KEY (`template_id`) REFERENCES `form_templates`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `form_submissions` ADD CONSTRAINT `form_submissions_template_version_id_template_versions_id_fk` FOREIGN KEY (`template_version_id`) REFERENCES `template_versions`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `form_submissions` ADD CONSTRAINT `form_submissions_submitter_id_users_id_fk` FOREIGN KEY (`submitter_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_department_id_departments_id_fk` FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `departments` ADD CONSTRAINT `departments_parent_id_departments_id_fk` FOREIGN KEY (`parent_id`) REFERENCES `departments`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_roles` ADD CONSTRAINT `user_roles_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_roles` ADD CONSTRAINT `user_roles_role_id_roles_id_fk` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `role_permissions` ADD CONSTRAINT `role_permissions_role_id_roles_id_fk` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `role_permissions` ADD CONSTRAINT `role_permissions_permission_id_permissions_id_fk` FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `form_templates` ADD CONSTRAINT `form_templates_creator_id_users_id_fk` FOREIGN KEY (`creator_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `departments_parent_idx` ON `departments` (`parent_id`);
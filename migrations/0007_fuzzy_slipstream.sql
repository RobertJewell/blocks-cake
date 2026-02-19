CREATE TABLE `screenshots` (
	`page_id` text PRIMARY KEY NOT NULL,
	`storage_path` text,
	`width` integer DEFAULT 640,
	`height` integer DEFAULT 480,
	`status` text DEFAULT 'pending' NOT NULL,
	`error_message` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`page_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `screenshots_status_idx` ON `screenshots` (`status`);
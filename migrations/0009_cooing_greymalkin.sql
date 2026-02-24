CREATE TABLE `scopes` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `scopes_name_unique` ON `scopes` (`name`);--> statement-breakpoint
CREATE TABLE `globals` (
	`id` text PRIMARY KEY NOT NULL,
	`key` text NOT NULL,
	`scope_id` text NOT NULL,
	`type` text NOT NULL,
	`value` text NOT NULL,
	FOREIGN KEY (`scope_id`) REFERENCES `scopes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `globals_key_scope_idx` ON `globals` (`key`,`scope_id`);--> statement-breakpoint
CREATE INDEX `globals_scope_idx` ON `globals` (`scope_id`);
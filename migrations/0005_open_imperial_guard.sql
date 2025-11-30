CREATE TABLE `assets` (
	`id` text PRIMARY KEY NOT NULL,
	`filename` text NOT NULL,
	`mime_type` text NOT NULL,
	`is_optimized` integer DEFAULT false NOT NULL,
	`variants` text,
	`blurhash` text,
	`alt_text` text,
	`tags` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer NOT NULL
);

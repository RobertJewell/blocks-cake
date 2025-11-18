CREATE TABLE `blocks` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`data` text NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);

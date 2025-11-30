CREATE TABLE `asset_usages` (
	`asset_id` text NOT NULL,
	`block_id` text NOT NULL,
	`field` text NOT NULL,
	PRIMARY KEY(`asset_id`, `block_id`, `field`),
	FOREIGN KEY (`asset_id`) REFERENCES `assets`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`block_id`) REFERENCES `blocks`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_asset_usages_block` ON `asset_usages` (`block_id`);
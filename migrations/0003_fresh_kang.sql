CREATE TABLE `page_blocks` (
	`page_id` text NOT NULL,
	`block_id` text NOT NULL,
	`order` integer NOT NULL,
	FOREIGN KEY (`page_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`block_id`) REFERENCES `blocks`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `page_blocks_pk` ON `page_blocks` (`page_id`,`block_id`);--> statement-breakpoint
CREATE INDEX `page_blocks_page_idx` ON `page_blocks` (`page_id`);--> statement-breakpoint
CREATE INDEX `page_blocks_order_idx` ON `page_blocks` (`order`);--> statement-breakpoint
ALTER TABLE `pages` DROP COLUMN `data`;
ALTER TABLE `todos` ADD `description` text;--> statement-breakpoint
ALTER TABLE `todos` ADD `due_date` text;--> statement-breakpoint
ALTER TABLE `todos` ADD `priority` text DEFAULT 'medium' NOT NULL;
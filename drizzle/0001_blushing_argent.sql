CREATE TABLE `categories` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sub_categories` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`category_id` text NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `tasks` (
	`id` text PRIMARY KEY NOT NULL,
	`start` integer NOT NULL,
	`end` integer NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`status` text NOT NULL,
	`color` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer,
	`user_id` text NOT NULL,
	`category_id` text,
	`sub_category_id` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`sub_category_id`) REFERENCES `sub_categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users_has_categories` (
	`user_id` text NOT NULL,
	`category_id` text NOT NULL,
	`total_amount` integer NOT NULL,
	PRIMARY KEY(`category_id`, `user_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users_has_sub_categories` (
	`user_id` text NOT NULL,
	`category_id` text NOT NULL,
	`total_amount` integer NOT NULL,
	PRIMARY KEY(`category_id`, `user_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`category_id`) REFERENCES `sub_categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `categories_title_unique` ON `categories` (`title`);--> statement-breakpoint
CREATE UNIQUE INDEX `sub_categories_title_unique` ON `sub_categories` (`title`);
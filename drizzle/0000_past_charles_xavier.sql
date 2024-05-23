CREATE TABLE `categories` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sub_categories` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`category_id` text NOT NULL
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
	`sub_category_id` text
);
--> statement-breakpoint
CREATE TABLE `users_has_categories` (
	`user_id` text NOT NULL,
	`category_id` text NOT NULL,
	`total_amount` integer NOT NULL,
	PRIMARY KEY(`category_id`, `user_id`)
);
--> statement-breakpoint
CREATE TABLE `users_has_sub_categories` (
	`user_id` text NOT NULL,
	`category_id` text NOT NULL,
	`total_amount` integer NOT NULL,
	PRIMARY KEY(`category_id`, `user_id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`profile_picture` text,
	`role` text NOT NULL,
	`password` text NOT NULL,
	`language` text NOT NULL,
	`created_at` integer DEFAULT (current_timestamp) NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `categories_title_unique` ON `categories` (`title`);--> statement-breakpoint
CREATE UNIQUE INDEX `sub_categories_title_unique` ON `sub_categories` (`title`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);
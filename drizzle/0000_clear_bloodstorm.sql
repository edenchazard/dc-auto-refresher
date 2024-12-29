CREATE TABLE `users` (
	`id` mediumint unsigned NOT NULL,
	`username` varchar(32) NOT NULL,
	`role` varchar(10) NOT NULL DEFAULT 'user',
	`registered_on` datetime NOT NULL DEFAULT NOW(),
	`last_activity` datetime,
	`access_token` char(129),
	`api_blocked` boolean NOT NULL DEFAULT false,
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);

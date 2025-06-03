CREATE TABLE `grupos` (
	`id_grupo` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL,
	`color` text DEFAULT '#0078D7',
	`fecha_creacion` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `subtareas` (
	`id_subtarea` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`id_tarea` integer NOT NULL,
	`titulo` text NOT NULL,
	`completada` integer DEFAULT false,
	FOREIGN KEY (`id_tarea`) REFERENCES `tareas`(`id_tarea`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `tareas` (
	`id_tarea` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`id_grupo` integer NOT NULL,
	`titulo` text NOT NULL,
	`descripcion` text,
	`completada` integer DEFAULT false,
	`fecha_creacion` text DEFAULT CURRENT_TIMESTAMP,
	`fecha_vencimiento` text,
	`prioridad` text DEFAULT 'baja',
	FOREIGN KEY (`id_grupo`) REFERENCES `grupos`(`id_grupo`) ON UPDATE no action ON DELETE no action
);

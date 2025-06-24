import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("user", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  isActive: integer("is_active").notNull().default(0),
});

export const grupos = sqliteTable("grupos", {
  id_grupo: integer("id_grupo").primaryKey({ autoIncrement: true }),
  usuario_id: integer("usuario_id")
    .notNull()
    .references(() => users.id),
  nombre: text("nombre").notNull(),
  color: text("color").default("#0078D7"),
  fecha_creacion: text("fecha_creacion").default(sql`CURRENT_TIMESTAMP`),
});

export const tareas = sqliteTable("tareas", {
  id_tarea: integer("id_tarea").primaryKey({ autoIncrement: true }),
  id_grupo: integer("id_grupo")
    .notNull()
    .references(() => grupos.id_grupo),
  titulo: text("titulo").notNull(),
  descripcion: text("descripcion"),
  completada: integer("completada", { mode: "boolean" }).default(false),
  isDaily: integer("isDaily", { mode: "boolean" }), // Nuevo campo opcional
  fecha_creacion: text("fecha_creacion").default(sql`CURRENT_TIMESTAMP`),
  fecha_vencimiento: text("fecha_vencimiento"),
  prioridad: text("prioridad", { enum: ["baja", "media", "alta"] }).default(
    "baja"
  ),
});

export const subtareas = sqliteTable("subtareas", {
  id_subtarea: integer("id_subtarea").primaryKey({ autoIncrement: true }),
  id_tarea: integer("id_tarea")
    .notNull()
    .references(() => tareas.id_tarea),
  titulo: text("titulo").notNull(),
  completada: integer("completada", { mode: "boolean" }).default(false),
});

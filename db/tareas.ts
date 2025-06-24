import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { grupos } from "./grupos";

export const tareas = sqliteTable("tareas", {
  id_tarea: integer("id_tarea").primaryKey({ autoIncrement: true }),
  id_grupo: integer("id_grupo")
    .notNull()
    .references(() => grupos.id_grupo),
  titulo: text("titulo").notNull(),
  descripcion: text("descripcion"),
  completada: integer("completada", { mode: "boolean" }).default(false),
  isDaily: integer("isDaily", { mode: "boolean" }),
  fecha_creacion: text("fecha_creacion").default(sql`CURRENT_TIMESTAMP`),
  fecha_vencimiento: text("fecha_vencimiento"),
  prioridad: text("prioridad", { enum: ["baja", "media", "alta"] }).default(
    "baja"
  ),
});

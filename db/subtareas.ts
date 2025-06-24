import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { tareas } from "./tareas";

export const subtareas = sqliteTable("subtareas", {
  id_subtarea: integer("id_subtarea").primaryKey({ autoIncrement: true }),
  id_tarea: integer("id_tarea")
    .notNull()
    .references(() => tareas.id_tarea),
  titulo: text("titulo").notNull(),
  completada: integer("completada", { mode: "boolean" }).default(false),
});

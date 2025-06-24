import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { usuarios } from "./usuarios";

export const grupos = sqliteTable("grupos", {
  id_grupo: integer("id_grupo").primaryKey({ autoIncrement: true }),
  id_usuario: integer("id_usuario")
    .notNull()
    .references(() => usuarios.id),
  nombre: text("nombre").notNull(),
  color: text("color").default("#0078D7"),
  fecha_creacion: text("fecha_creacion").default(sql`CURRENT_TIMESTAMP`),
});

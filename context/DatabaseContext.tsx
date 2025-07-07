import * as schema from "@/db/schema"; // Importa todos tus esquemas
import migrations from "@/drizzle/migrations";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import * as SQLite from "expo-sqlite";
import { createContext, useContext, useEffect, useState } from "react";
import { Text, View } from "react-native";

const DATABASE_NAME = "paw.db";
const expoDb = SQLite.openDatabaseSync(DATABASE_NAME);
export const db = drizzle(expoDb, { schema });

const DatabaseContext = createContext(db);

export const DatabaseProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isReady, setIsReady] = useState(false);
  const [migrationError, setMigrationError] = useState<Error | null>(null);

  const { success, error } = useMigrations(db, migrations);

  useEffect(() => {
    if (success) setIsReady(true);
    if (error) setMigrationError(error);
  }, [success, error]);

  if (migrationError) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Error de migración: {migrationError.message}</Text>
      </View>
    );
  }

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Inicializando base de datos...</Text>
      </View>
    );
  }

  return (
    <DatabaseContext.Provider value={db}>{children}</DatabaseContext.Provider>
  );
};

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error("useDatabase must be used within a DatabaseProvider");
  }
  return context;
};

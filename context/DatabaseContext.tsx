import { drizzle } from "drizzle-orm/expo-sqlite";
import * as SQLite from "expo-sqlite";
import { createContext, useContext } from "react";

const DATABASE_NAME = "ps.db";
const expo = SQLite.openDatabaseSync(DATABASE_NAME);
const db = drizzle(expo);

const DatabaseContext = createContext(db);

export const DatabaseProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
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

import CustomAlert from "@/Components/CustomAlert";
import { useDatabase } from "@/context/DatabaseContext";
import * as schema from "@/db/schema";
import { grupos, subtareas, tareas, users } from "@/db/schema";
import { useAlert } from "@/hooks/useAlert";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { eq } from "drizzle-orm";
import { reset } from "drizzle-seed";
import React, { ReactNode, createContext, useEffect, useState } from "react";
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
interface AuthContextProps {
  children: ReactNode;
}
interface User {
  id: number;
  email: string;
  password: string;
  isActive: number;
}
interface AuthContextType {
  user: any; // puedes mejorar esto después
  setUser: React.Dispatch<React.SetStateAction<any>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  register: ({ email, password }: User) => Promise<any>; // o Promise<ResponseData>
  login: ({ email, password }: User) => Promise<any>; // o Promise<ResponseData>
  logout: () => Promise<void>;
  validateEmail: (email: string) => Promise<any>;
  resetPassword: ({ email, password }: User) => Promise<any>;
}

export const AuhtProvider = ({ children }: AuthContextProps) => {
  const db = useDatabase();
  const { alertConfig, showAlert, hideAlert } = useAlert();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userdata = await AsyncStorage.getItem("user");
        if (userdata) {
          setUser(JSON.parse(userdata));
        }
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    loadUser();
  }, []);
  const userPersister = async (userData: any) => {
    try {
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };
  const clearUser = async () => {
    try {
      await AsyncStorage.removeItem("user");
      setUser(null);
    } catch (error) {
      console.error("Error clearing user data:", error);
    }
  };
  const mostrarBDD = async () => {
    try {
      const data = await db
        .select({
          // Selección explícita de campos (evita SELECT *)
          usuario: {
            id: users.id,
            email: users.email,
            isActive: users.isActive,
          },
          grupo: {
            id: grupos.id_grupo,
            nombre: grupos.nombre,
            color: grupos.color,
          },
          tarea: {
            id: tareas.id_tarea,
            titulo: tareas.titulo,
            prioridad: tareas.prioridad,
            completada: tareas.completada,
          },
          subtarea: {
            id: subtareas.id_subtarea,
            titulo: subtareas.titulo,
            completada: subtareas.completada,
          },
        })
        .from(users)
        .leftJoin(grupos, eq(grupos.usuario_id, users.id)) // Unión usuario → grupos
        .leftJoin(tareas, eq(tareas.id_grupo, grupos.id_grupo)) // Unión grupo → tareas
        .leftJoin(subtareas, eq(subtareas.id_tarea, tareas.id_tarea)) // Unión tarea → subtareas
        .all();

      console.log(JSON.stringify(data, null, 2)); // Formato legible
      return data;
    } catch (error) {
      console.error("Error en mostrarBDD:", error);
      throw error; // Propaga el error para manejo externo
    }
  };
  const resetbdd = async () => {
    try {
      await AsyncStorage.removeItem("user");
      await reset(db, schema);
      setUser(null);
    } catch (error) {
      console.error("Error clearing user data:", error);
    }
  };
  const logout = async () => {
    await clearUser();
    // resetbdd();
    // mostrarBDD();
  };
  const localRegister = async (id: number, email: string) => {
    try {
      const result = await db.insert(users).values({ id, email, isActive: 1 });
      if (result) {
        await userPersister({ id, email, isActive: 1 });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const register = async ({ email, password }: User) => {
    try {
      const response = await fetch("http://192.168.1.108:3000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        showAlert("Error", data.error, "error");
        return;
      }

      showAlert("Éxito", data.success, "success");
      if (data.user) {
        localRegister(data.user.id, data.user.email);
      }
      return data;
    } catch (error) {
      showAlert("Error", "Ocurrió un error inesperado", "error");
      console.log(error);
    }
  };
  const validateEmail = async (email: string) => {
    try {
      const response = await fetch(
        "http://192.168.1.108:3000/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        showAlert("Error", data.error, "error");
        return;
      }
      return data;
    } catch (error) {
      showAlert("Error", "Ocurrió un error inesperado", "error");
      console.log(error);
    }
  };
  const resetPassword = async ({ email, password }: User) => {
    try {
      const response = await fetch("http://192.168.1.108:3000/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, newPassword: password }),
      });
      const data = await response.json();
      if (!response.ok) {
        showAlert("Error", data.error, "error");
        return;
      }
      showAlert("Éxito", data.success, "success");
      return data;
    } catch (error) {
      showAlert("Error", "Ocurrio un error inesperado", "error");
      console.log("Error del try", error);
    }
  };
  const login = async ({ email, password }: User) => {
    try {
      const response = await fetch("http://192.168.1.108:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        showAlert("Error", "Credenciales incorrectas", "error");
        return { success: false };
      }
      showAlert("Éxito", "La acción se completó correctamente", "success");
      setUser(data.user);
      await userPersister(data.user);
      return { success: true };
    } catch (error) {
      showAlert("Error", "Error de conexión", "error");
      console.log(error);
    }
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        setLoading,
        register,
        login,
        logout,
        validateEmail,
        resetPassword,
      }}
    >
      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onDismiss={hideAlert}
      />
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

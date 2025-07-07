import { useRouter } from 'expo-router';
import { useDatabase } from "./DatabaseContext";
import { useAlert } from "@/hooks/useAlert";
import { users } from "@/db/schema";
import React, { ReactNode, createContext, useEffect, useState } from "react";
import CustomAlert from "@/Components/CustomAlert";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { and, eq } from "drizzle-orm";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthContextProps {
  children: ReactNode;
}

interface User {
  id: number;
  email: string;
  password?: string;
  isActive: number;
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  register: ({ email, password }: User) => Promise<User>;
  login: ({ email, password }: User) => Promise<User>;
  logout: () => Promise<void>;
  validateEmail: (email: string) => Promise<void>;
  resetPassword: ({ email, password }: User) => Promise<void>;
}

export const AuthProvider = ({ children }: AuthContextProps) => {
  const db = useDatabase();
  const { alertConfig, showAlert, hideAlert } = useAlert();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userdata = await AsyncStorage.getItem("user");
        
        if (userdata) {
          const parsedUser = JSON.parse(userdata);
          
          // Verifica en la base de datos si el usuario sigue activo
          const [dbUser] = await db.select()
            .from(users)
            .where(
              eq(users.id, parsedUser.id)
            ).limit(1);
  
          if (dbUser && dbUser.isActive === 1) {
            // Actualizar el usuario en AsyncStorage con los datos más recientes
            await AsyncStorage.setItem("user", JSON.stringify(dbUser));
            setUser(dbUser);
          } else {
            await AsyncStorage.removeItem("user");
            setUser(null);
          }
        }
      } catch (error) {
        console.error("Error loading user:", error);
        await AsyncStorage.removeItem("user"); // Limpia en caso de error
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    loadUser();
  }, [db]);
  const userPersister = async (userData: User) => {
    try {
      // Primero activamos el usuario en la base de datos
      await db.update(users)
        .set({ isActive: 1 })
        .where(eq(users.id, userData.id));

      // Luego guardamos en AsyncStorage
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };
  const clearUser = async () => {
    try {
      await AsyncStorage.removeItem("user");
      if (user && user.id) {
        await db.update(users).set({ isActive: 0 }).where(eq(users.id, user.id));
      }
      setUser(null);
      
    } catch (error) {
      console.error("Error clearing user data:", error);
    }
  };
  const router = useRouter();
  const logout = async () => {
    await clearUser();
    router.replace("/(auth)/login");
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
      const response = await fetch("http://192.168.1.107:3000/register", {
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
        "http://192.168.1.107:3000/forgot-password",
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
      const response = await fetch("http://192.168.1.107:3000/reset-password", {
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
      const response = await fetch("http://192.168.1.107:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      
      if (!response.ok) {
        showAlert("Error", "Credenciales incorrectas", "error");
        return null;
      }

      // Verificar si el usuario existe en la base de datos local
      const [user] = await db.select().from(users).where(eq(users.email, email));
      
      if (user) {
        // Actualizar el estado del usuario a activo
        await db.update(users)
          .set({ isActive: 1 })
          .where(eq(users.id, user.id));
        
        // Persistir los datos del usuario en AsyncStorage
        await userPersister({
          id: user.id,
          email: user.email,
          isActive: 1
        });
        
        // Actualizar el estado del usuario en el contexto
        setUser({
          id: user.id,
          email: user.email,
          isActive: 1
        });
        
        return {
          id: user.id,
          email: user.email,
          isActive: 1
        };
      }
      
      return null;
    } catch (error) {
      showAlert("Error", "Ocurrió un error inesperado", "error");
      console.log(error);
      return null;
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

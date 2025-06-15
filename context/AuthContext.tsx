import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { ReactNode, createContext, useEffect, useState } from "react";
import { Alert } from "react-native";
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
interface AuthContextProps {
  children: ReactNode;
}
interface User {
  email: string;
  password: string;
}
interface AuthContextType {
  user: any; // puedes mejorar esto después
  setUser: React.Dispatch<React.SetStateAction<any>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  register: ({ email, password }: User) => Promise<any>; // o Promise<ResponseData>
  login: ({ email, password }: User) => Promise<any>; // o Promise<ResponseData>
  logout: () => Promise<void>;
}

export const AuhtProvider = ({ children }: AuthContextProps) => {
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
  const logout = async () => {
    await clearUser();
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
        Alert.alert("Error", data.error);
        return;
      }
      Alert.alert("Success", data.success);
      return data;
    } catch (error) {
      console.log(error);
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
        return { success: false };
      }
      setUser(data.user);
      await userPersister(data.user);
      return { success: true };
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, setLoading, register, login, logout }}
    >
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

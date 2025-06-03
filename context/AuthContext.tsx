import React, { ReactNode, createContext, useState } from "react";
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
}

export const AuhtProvider = ({ children }: AuthContextProps) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
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
      return { success: true };
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, setLoading, register, login }}
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

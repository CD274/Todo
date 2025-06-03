// navigation/RootNavigator.tsx
import { useAuth } from "@/context/AuthContext";
import React from "react";
import AuthStack from "./AuthStack";
import MainStack from "./MainStack";
const RootNavigator = () => {
  const { user } = useAuth();

  return user ? <MainStack /> : <AuthStack />;
};

export default RootNavigator;

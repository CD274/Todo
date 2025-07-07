import { useAuth } from "@/context/AuthContext";
import { Redirect } from "expo-router";

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // O muestra un loader
  }

  return user ? (
    <Redirect href="/(tabs)/home" />
  ) : (
    <Redirect href="/(auth)/login" />
    // <Redirect href="/(auth)/login" />
  );
}

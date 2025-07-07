import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { TouchableOpacity } from "react-native";

export default function AuthenticatedLayout() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="home/index"
        options={{
          title: "Inicio",
          headerLeft: () => (
            <TouchableOpacity style={{ marginLeft: 15 }}>
              <Ionicons name="home" size={24} color="#007AFF" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="tasks/index"
        options={{
          title: "Mis Tareas",
          headerLeft: () => (
            <TouchableOpacity style={{ marginLeft: 15 }}>
              <Ionicons name="list" size={24} color="#007AFF" />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}

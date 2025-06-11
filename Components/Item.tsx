import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../theme/colors";

export interface Grupo {
  id_grupo: number;
  nombre: string;
  color: string | null;
  fecha_creacion: string | null;
}

export interface Tarea {
  id_tarea: number;
  id_grupo: number;
  titulo: string;
  descripcion: string | null;
  completada: boolean | null;
  fecha_creacion: string | null;
  fecha_vencimiento: string | null;
  prioridad: "baja" | "media" | "alta" | null;
}

export interface Subtarea {
  id_subtarea: number;
  id_tarea: number;
  titulo: string;
  completada: boolean | null;
  fecha_creacion: string | null;
  fecha_vencimiento: string | null;
  prioridad: "baja" | "media" | "alta" | null;
}
type Elemento = (Grupo & { tipo: "grupo" }) | (Tarea & { tipo: "tarea" });

interface Actions {
  onDelete: (id: string) => Promise<void>;
  onUpdate: (userData: Elemento) => void;
}

export const Item = ({
  elemento,
  onDelete,
  onUpdate,
}: { elemento: Elemento } & Actions) => {
  const cardBackground =
    elemento.tipo === "grupo" && elemento.color
      ? elemento.color
      : colors.primaryLight;
  const navigation = useNavigation();
  const goToTasks = (groupId: number) => {
    navigation.navigate("Task", { id_group: groupId });
  };

  return (
    <View style={styles.cardContainer}>
      <View style={[styles.card, { backgroundColor: cardBackground }]}>
        {/* Main content */}
        <View style={styles.content}>
          <Text style={[styles.name]} numberOfLines={1}>
            {"nombre" in elemento
              ? elemento.nombre + ": ID_GROUP:" + elemento.id_grupo
              : elemento.titulo + ": ID_TASK:" + elemento.id_tarea}
          </Text>

          {elemento.fecha_creacion && (
            <Text style={[styles.date]}>
              {formatDate(elemento.fecha_creacion)}
            </Text>
          )}
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            activeOpacity={0.7}
            onPress={() => goToTasks(elemento.id_grupo)}
          >
            <Text style={styles.buttonText}>View Tasks</Text>
            <Ionicons name="chevron-forward" size={16} color="white" />
          </TouchableOpacity>

          <View style={styles.iconButtons}>
            <TouchableOpacity
              style={[styles.iconButton, styles.editButton]}
              onPress={() => onUpdate(elemento)}
              activeOpacity={0.7}
            >
              <Ionicons name="create-outline" size={20} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.iconButton, styles.deleteButton]}
              onPress={() => onDelete(elemento.id_grupo.toString())}
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

// Helper function to format date
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const styles = StyleSheet.create({
  cardContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: "hidden",
  },
  content: {
    marginBottom: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    opacity: 0.9,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    minWidth: 120,
    justifyContent: "center",
    gap: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "500",
  },
  iconButtons: {
    flexDirection: "row",
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  editButton: {
    backgroundColor: colors.primary,
  },
  deleteButton: {
    backgroundColor: colors.error,
  },
});

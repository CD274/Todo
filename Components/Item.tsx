import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../theme/colors";

type ItemProps = {
  elemento: {
    id_grupo: number;
    nombre: string;
    color: string | null;
    fecha_creacion: string | null;
  };
};

interface Actions {
  onDelete: (id: string) => Promise<void>;
  onUpdate: (userData: ItemProps["elemento"]) => void;
}

export const Item = ({
  elemento,
  onDelete,
  onUpdate,
}: { elemento: ItemProps["elemento"] } & Actions) => {
  return (
    <View style={styles.cardContainer}>
      <View style={[styles.card, { backgroundColor: elemento.color }]}>
        {/* Información principal */}
        <View style={styles.taskButton}>
          <Text style={styles.taskButtonText}>{elemento.nombre}</Text>
          {elemento.fecha_creacion && (
            <Text style={styles.taskButtonText}>{elemento.fecha_creacion}</Text>
          )}
        </View>

        {/* Acciones */}
        <View style={styles.actionsRow}>
          <Link href={`../task/${elemento.id_grupo}`} asChild>
            <TouchableOpacity style={styles.taskButton}>
              <Text style={styles.taskButtonText}>Tareas</Text>
            </TouchableOpacity>
          </Link>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.iconButton, styles.editButton]}
              onPress={() => onUpdate(elemento)}
            >
              <Ionicons name="create-outline" size={18} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.iconButton, styles.deleteButton]}
              onPress={() => onDelete(elemento.id_grupo.toString())}
            >
              <Ionicons name="trash-outline" size={18} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  mainInfo: {
    marginBottom: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  date: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  taskButton: {
    backgroundColor: colors.primaryLight,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  taskButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  editButton: {
    backgroundColor: colors.primary,
  },
  deleteButton: {
    backgroundColor: colors.error,
  },
});

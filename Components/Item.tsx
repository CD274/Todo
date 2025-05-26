import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../theme/colors";
type Item = {
  elemento: {
    id: string;
    name: string;
    age: string;
    email: string;
  };
};
interface Actions {
  onDelete: (id: string) => Promise<void>;
  onUpdate: (userData: Item["elemento"]) => void;
}
export const Item = ({
  elemento,
  onDelete,
  onUpdate,
}: { elemento: Item["elemento"] } & Actions) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.card}>
        {/* Información del usuario en grid */}
        <View style={styles.infoGrid}>
          <View style={styles.infoColumn}>
            <Text style={styles.label}>Nombre:</Text>
            <Text style={styles.value}>{elemento.name}</Text>
          </View>

          <View style={styles.infoColumn}>
            <Text style={styles.label}>Edad:</Text>
            <Text style={styles.value}>{elemento.age}</Text>
          </View>

          <View style={[styles.infoColumn, styles.fullWidth]}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value} numberOfLines={1} ellipsizeMode="tail">
              {elemento.email}
            </Text>
          </View>
        </View>
        <View>
          <Link href="/task" style={styles.link}>
            Ver tareas
          </Link>
        </View>

        {/* Botones de acciones */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={() => onDelete(elemento.id)}
          >
            <Ionicons name="trash-outline" size={18} color="white" />
            <Text style={styles.buttonText}>Eliminar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.editButton]}
            onPress={() => onUpdate(elemento)}
          >
            <Ionicons name="create-outline" size={18} color="white" />
            <Text style={styles.buttonText}>Editar</Text>
          </TouchableOpacity>
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
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  infoColumn: {
    width: "50%",
    marginBottom: 12,
  },
  fullWidth: {
    width: "100%",
  },
  label: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  value: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  link: {
    paddingTop: 20,
    fontSize: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    minWidth: 100,
  },
  deleteButton: {
    backgroundColor: colors.error,
  },
  editButton: {
    backgroundColor: colors.primary,
  },
  buttonText: {
    color: "white",
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "500",
  },
});

import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
  fecha_vencimiento: string;
  isDaily: boolean | null;
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
  onComplete?: (id: number) => Promise<void>;
}

export const Item = ({
  elemento,
  onDelete,
  onUpdate,
  onComplete,
}: { elemento: Elemento } & Actions) => {
  const priorityColors = {
    alta: "#f67782",
    media: "#f1e575",
    baja: "#76b8ef",
    default: "#d8e1e7",
  };

  const cardBackground =
    elemento.tipo === "grupo" && elemento.color
      ? elemento.color
      : elemento.tipo === "tarea" && elemento.prioridad
      ? priorityColors[elemento.prioridad] || priorityColors.default
      : priorityColors.default;

  const fechaActual = new Date();
  const fechaVencimiento = elemento.fecha_vencimiento
    ? new Date(elemento.fecha_vencimiento)
    : null;

  let colorCard = "#ffffff";
  let textStyle = {};

  if (elemento.completada) {
    textStyle = {
      textDecorationLine: "line-through",
      color: "#888",
    };
  } else if (
    elemento.tipo === "tarea" &&
    !elemento.isDaily &&
    fechaVencimiento
  ) {
    if (fechaVencimiento < fechaActual) {
      colorCard = "#5f6d73"; // Gris azulado oscuro (atrasado)
    } else if (fechaVencimiento.toDateString() === fechaActual.toDateString()) {
      colorCard = "#9db7bc"; // Azul grisáceo medio (hoy)
    } else {
      colorCard = "#d6ecf1"; // Azul muy claro (futuro)
    }
  }

  const navigation = useNavigation();

  const goToTasks = (groupId: number, name: string) => {
    navigation.navigate("Task", { id_group: groupId, nombre: name });
  };

  return (
    <View style={styles.cardContainer}>
      <View style={[styles.card, { borderLeftColor: cardBackground }]}>
        {/* Contenedor interno con fondo constante */}
        <View style={[styles.innerCard, { backgroundColor: colorCard }]}>
          {/* Main content */}
          <View style={styles.content}>
            <Text
              style={[styles.name, elemento.completada && textStyle]}
              numberOfLines={1}
            >
              {"nombre" in elemento ? elemento.nombre : elemento.titulo}
            </Text>

            <View style={styles.datesContainer}>
              {elemento.fecha_creacion && (
                <Text style={styles.date}>
                  {formatDate(elemento.fecha_creacion)}
                </Text>
              )}
              {elemento.tipo === "tarea" && (
                <Text style={[styles.date, styles.dueDate]}>
                  {
                    elemento.isDaily
                      ? "Frecuencia diaria" // Si es diaria, muestra este texto
                      : elemento.fecha_vencimiento
                      ? formatDate(elemento.fecha_vencimiento) // Si no es diaria pero tiene fecha, muéstrala
                      : "Sin fecha" // Opcional: texto por defecto si no hay fecha
                  }
                </Text>
              )}
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actionsContainer}>
            {elemento.tipo === "grupo" && (
              <TouchableOpacity
                style={styles.viewButton}
                activeOpacity={0.7}
                onPress={() => goToTasks(elemento.id_grupo, elemento.nombre)}
              >
                <Text style={styles.viewButtonText}>Ver tareas</Text>
                <Ionicons name="chevron-forward" size={16} color="#2D4A53" />
              </TouchableOpacity>
            )}

            {elemento.tipo === "tarea" && (
              <View style={styles.completionContainer}>
                <TouchableOpacity
                  onPress={() => onComplete && onComplete(elemento.id_tarea)}
                  style={styles.checkboxContainer}
                >
                  <Ionicons
                    name={elemento.completada ? "checkbox" : "square-outline"}
                    size={24}
                    color={elemento.completada ? "#2D4A53" : "black"}
                  />
                </TouchableOpacity>
                {elemento.completada && (
                  <Text style={styles.completedText}>Completada</Text>
                )}
              </View>
            )}

            <View style={styles.iconButtons}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => onUpdate(elemento)}
                activeOpacity={0.7}
              >
                <Ionicons name="create-outline" size={18} color="white" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.iconButton, styles.deleteButton]}
                onPress={() => onDelete(elemento.id_grupo.toString())}
                activeOpacity={0.7}
              >
                <Ionicons name="trash-outline" size={18} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

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
    marginBottom: 12,
  },

  card: {
    borderRadius: 12,
    padding: 5, // Borde visible
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: "#69818D",
  },
  innerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10, // Un poco menos que el card para que se vea el borde
    padding: 14,
    flex: 1,
  },
  content: {
    marginBottom: 12,
  },
  datesContainer: {
    flexDirection: "row",
    gap: 8,
  },
  dueDate: {
    fontWeight: "bold",
    color: "red",
  },
  name: {
    fontSize: 16,
    fontWeight: "500",
    color: "#132E35",
    marginBottom: 4,
  },
  date: {
    fontSize: 13,
    color: "black",
    opacity: 0.8,
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  viewButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#E8ECEF",
  },
  viewButtonText: {
    color: "#2D4A53",
    fontSize: 14,
    marginRight: 4,
    fontWeight: "500",
  },
  completionContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxContainer: {
    marginRight: 8,
  },
  completedText: {
    fontSize: 13,
    color: "#2D4A53",
    fontStyle: "italic",
  },
  iconButtons: {
    flexDirection: "row",
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    backgroundColor: "#2D4A53",
  },
  deleteButton: {
    backgroundColor: "#5A636A",
  },
});

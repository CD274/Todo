import { Item } from "@/Components/Item";
import { ModalGuardar } from "@/Components/modal";
import { tareas } from "@/db/schema";
import { colors } from "@/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { eq } from "drizzle-orm";
import { useFocusEffect } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDatabase } from "../../../context/DatabaseContext";

interface TaskProps {
  id_tarea: number;
  id_grupo: number;
  titulo: string;
  descripcion: string | null;
  completada: boolean | null;
  fecha_creacion: string | null;
  fecha_vencimiento: string | null;
  prioridad: "baja" | "media" | "alta" | null;
}

const Task = () => {
  const db = useDatabase();
  const route = useRoute();
  const { id_group } = route.params;
  const [isModalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState<TaskProps[]>([]);
  const [editingTask, setEditingTask] = useState<TaskProps>();
  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;
      const loadData = async () => {
        try {
          const tasks = await db
            .select()
            .from(tareas)
            .where(eq(tareas.id_grupo, Number(id_group)));
          const stringTasks = tasks.map((tareas) => ({
            id_tarea: tareas.id_tarea,
            id_grupo: tareas.id_grupo,
            titulo: tareas.titulo,
            descripcion: tareas.descripcion,
            completada: tareas.completada,
            fecha_creacion: tareas.fecha_creacion,
            fecha_vencimiento: tareas.fecha_vencimiento,
            prioridad: tareas.prioridad,
          }));
          if (isActive) {
            setData(stringTasks);
          }
        } catch (error) {
          console.error("Error al cargar los datos de las tareas:", error);
          if (isActive) {
            // Opcional: Mostrar estado de error
            setData([]);
          }
        }
      };
      loadData();
    }, [])
  );
  const deleteData = async (id: number) => {
    const result = await db
      .delete(tareas)
      .where(eq(tareas.id_tarea, Number(id)))
      .returning();
    setData((prev) => prev.filter((item) => item.id_tarea !== id));
  };
  const handleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const renderItem = ({ item }: { item: TaskProps }) => (
    <Item
      elemento={{ ...item, tipo: "tarea" }}
      onDelete={() => deleteData(item.id_tarea)}
      onUpdate={() => {}}
    />
  );
  return (
    <View>
      <TouchableOpacity style={styles.addButton} onPress={handleModal}>
        <Ionicons name="add-circle" size={24} color="white" />
        <Text style={styles.addButtonText}>Crear un grupo de tareas</Text>
      </TouchableOpacity>
      <Text>Task in de case del goupid {id_group}</Text>
      <FlatList
        data={data}
        renderItem={({ item }: { item: TaskProps }) => renderItem({ item })}
        keyExtractor={(item) => item.id_grupo.toString()}
      />
      <ModalGuardar
        modalVisible={isModalVisible}
        tipo="tarea"
        onClose={() => {
          setModalVisible(false);
          setEditingTask(undefined);
        }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: colors.primary,
    padding: 16,
    alignItems: "center",
    elevation: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
  content: {
    padding: 20,
  },
  welcomeText: {
    fontSize: 18,
    marginBottom: 20,
    color: colors.text,
    textAlign: "center",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: colors.primary,
  },
  cardText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  addButton: {
    flexDirection: "row",
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  addButtonText: {
    color: "white",
    marginLeft: 10,
    fontWeight: "bold",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#ffecec",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: colors.text,
  },
});

export default Task;

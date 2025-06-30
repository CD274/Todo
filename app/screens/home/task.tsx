import { Header } from "@/Components/header";
import { Item } from "@/Components/Item";
import { ModalGuardar } from "@/Components/modal";
import { subtareas, tareas } from "@/db/schema";
import { colors } from "@/theme/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "@react-navigation/native";
import { isToday } from "date-fns";
import { eq } from "drizzle-orm";
import { useFocusEffect } from "expo-router";
import React, { useState } from "react";
import { Alert, FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDatabase } from "../../../context/DatabaseContext";

interface Subtarea {
  titulo: string;
  completada: boolean;
}

interface TaskProps {
  id_tarea: number;
  id_grupo: number;
  titulo: string;
  descripcion: string | null;
  completada: boolean | null;
  isDaily: boolean | null;
  fecha_creacion: string | null;
  fecha_vencimiento: string | null;
  prioridad: "baja" | "media" | "alta" | null;
  subtareas: Subtarea[];
}

const Task = () => {
  const db = useDatabase();
  const route = useRoute();
  const { id_group, name } = route.params;
  const [isModalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState<TaskProps[]>([]);
  const [editingTask, setEditingTask] = useState<TaskProps>();
  const [completada, setCompletada] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;
      const loadData = async () => {
        //Verificar si la fecha de la última ejecución es hoy
        await executeDailyTasks();
        //Cargar las tareas
        try {
          const tasks = await db
            .select()
            .from(tareas)
            .where(eq(tareas.id_grupo, Number(id_group)));

          const tasksWithSubtareas = await Promise.all(
            tasks.map(async (task) => {
              const subtasks = await db
                .select({
                  titulo: subtareas.titulo,
                  completada: subtareas.completada,
                })
                .from(subtareas)
                .where(eq(subtareas.id_tarea, task.id_tarea));

              return {
                id_tarea: task.id_tarea,
                id_grupo: task.id_grupo,
                titulo: task.titulo,
                descripcion: task.descripcion,
                completada: task.completada,
                isDaily: task.isDaily,
                fecha_creacion: task.fecha_creacion,
                fecha_vencimiento: task.fecha_vencimiento,
                prioridad: task.prioridad,
                subtareas: subtasks,
              };
            })
          );

          if (isActive) {
            setData(tasksWithSubtareas);
          }
        } catch (error) {
          console.error("Error al cargar los datos de las tareas:", error);
          if (isActive) {
            setData([]);
          }
        }
      };
      loadData();

      return () => {
        isActive = false;
      };
    }, [id_group])
  );

  const saveData = async (nuevaTarea: TaskProps) => {
    nuevaTarea.fecha_creacion = new Date().toISOString();
    try {
      const result = await db.transaction(async (tx) => {
        // Guardar la tarea principal
        const [taskResult] = await tx
          .insert(tareas)
          .values({
            id_grupo: id_group,
            titulo: nuevaTarea.titulo,
            descripcion: nuevaTarea.descripcion,
            completada: nuevaTarea.completada,
            isDaily: nuevaTarea.isDaily,
            fecha_creacion: nuevaTarea.fecha_creacion,
            fecha_vencimiento: nuevaTarea.fecha_vencimiento,
            prioridad: nuevaTarea.prioridad,
          })
          .returning();

        // Guardar las subtareas si existen
        if (nuevaTarea.subtareas?.length > 0) {
          await tx.insert(subtareas).values(
            nuevaTarea.subtareas.map((subtarea) => ({
              id_tarea: taskResult.id_tarea,
              titulo: subtarea.titulo,
              completada: subtarea.completada,
            }))
          );
        }

        return taskResult;
      });

      // Actualizar el estado local
      setData((prev) => [
        ...prev,
        {
          ...nuevaTarea,
          id_tarea: result.id_tarea,
          id_grupo: result.id_grupo,
          subtareas: nuevaTarea.subtareas || [],
        },
      ]);
    } catch (error) {
      console.error("Error al guardar la tarea:", error);
    }
  };

  const updateData = async (tareaActualizada: TaskProps) => {
    try {
      const result = await db.transaction(async (tx) => {
        // Actualizar la tarea principal
        const [taskResult] = await tx
          .update(tareas)
          .set({
            titulo: tareaActualizada.titulo,
            descripcion: tareaActualizada.descripcion,
            completada: tareaActualizada.completada,
            isDaily: tareaActualizada.isDaily,
            fecha_vencimiento: tareaActualizada.fecha_vencimiento,
            prioridad: tareaActualizada.prioridad,
          })
          .where(eq(tareas.id_tarea, tareaActualizada.id_tarea))
          .returning();

        // Eliminar todas las subtareas existentes
        await tx
          .delete(subtareas)
          .where(eq(subtareas.id_tarea, tareaActualizada.id_tarea));

        // Insertar las nuevas subtareas
        if (tareaActualizada.subtareas?.length > 0) {
          await tx.insert(subtareas).values(
            tareaActualizada.subtareas.map((subtarea) => ({
              id_tarea: tareaActualizada.id_tarea,
              titulo: subtarea.titulo,
              completada: subtarea.completada,
            }))
          );
        }

        return taskResult;
      });

      // Actualizar el estado local
      setData((prev) =>
        prev.map((item) =>
          item.id_tarea === tareaActualizada.id_tarea
            ? {
                ...tareaActualizada,
                subtareas: tareaActualizada.subtareas || [],
              }
            : item
        )
      );
    } catch (error) {
      console.error("Error al actualizar la tarea:", error);
    }
  };

  const HandlecompleteTask = async (id: number) => {
    try {
      const newCompletedStatus = !completada;
      setCompletada(newCompletedStatus);

      const [result] = await db
        .update(tareas)
        .set({ completada: newCompletedStatus })
        .where(eq(tareas.id_tarea, id))
        .returning();

      setData((prev) =>
        prev.map((item) =>
          item.id_tarea === id
            ? { ...item, completada: newCompletedStatus }
            : item
        )
      );
    } catch (error) {
      console.error("Error al actualizar estado de tarea:", error);
    }
  };

  const deleteData = async (id: number) => {
    Alert.alert(
      "Confirmación",
      "¿Estás seguro de que deseas eliminar esta tarea?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              await db.transaction(async (tx) => {
                await tx.delete(subtareas).where(eq(subtareas.id_tarea, id));
                await tx.delete(tareas).where(eq(tareas.id_tarea, id));
              });

              setData((prev) => prev.filter((item) => item.id_tarea !== id));
            } catch (error) {
              console.error("Error al eliminar tarea:", error);
              Alert.alert("Error", "No se pudo eliminar la tarea");
            }
          },
        },
      ],
      { cancelable: false }
    );
  };
  const handleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleUpdate = (tarea: TaskProps) => {
    setEditingTask(tarea);
    setModalVisible(true);
  };
  const verTareas = async () => {
    const result = await db.select().from(tareas).execute();
    console.log(JSON.stringify(result, null, 2));
  };
  const renderItem = ({ item }: { item: TaskProps }) => (
    <Item
      elemento={{ ...item, tipo: "tarea" }}
      onDelete={() => deleteData(item.id_tarea)}
      onUpdate={() => handleUpdate(item)}
      onComplete={() => HandlecompleteTask(item.id_tarea)}
    />
  );
  const needsDailyExecution = async () => {
    const lastExecutionDate = await AsyncStorage.getItem(
      "@last_execution_date"
    );

    if (!lastExecutionDate) return true;

    return !isToday(new Date(lastExecutionDate));
  };
  const executeDailyTasks = async () => {
    if (await needsDailyExecution()) {
      await resetDailyTasks();
    }
  };
  const resetDailyTasks = async () => {
    try {
      await db
        .update(tareas)
        .set({ completada: false })
        .where(eq(tareas.isDaily, true))
        .execute();
      setData((prev) => prev.map((item) => ({ ...item, completada: false })));
    } catch (error) {
      console.error("Error al resetear las tareas diarias:", error);
    }
    await AsyncStorage.setItem(
      "@last_execution_date",
      new Date().toISOString()
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header handleModal={handleModal} tipo="task" />
      <View style={styles.container}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id_tarea.toString()}
          contentContainerStyle={styles.listContainer}
        />

        <ModalGuardar
          modalVisible={isModalVisible}
          tipo="tarea"
          onClose={() => {
            setModalVisible(false);
            setEditingTask(undefined);
          }}
          onSave={saveData}
          onUpdate={updateData}
          initialTarea={editingTask}
        />
      </View>
    </SafeAreaView>
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
  listContainer: {
    paddingBottom: 16,
  },
});

export default Task;

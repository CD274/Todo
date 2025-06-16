import { Header } from "@/Components/header";
import { ModalGuardar } from "@/Components/modal";
import { grupos, subtareas, tareas } from "@/db/schema";
import { eq } from "drizzle-orm";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Item } from "../../../Components/Item";
import { useDatabase } from "../../../context/DatabaseContext";
import migrations from "../../../drizzle/migrations";
interface GroupData {
  id_grupo: number;
  nombre: string;
  color: string | null;
  fecha_creacion: string | null;
}
const Home = () => {
  const db = useDatabase();
  const { success, error } = useMigrations(db, migrations);
  const [isModalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState<GroupData[]>([]);
  const [editingGroup, setEditingGroup] = useState<GroupData>();

  useEffect(() => {
    let isActive = true;
    const loadData = async () => {
      try {
        const groups = await db.select().from(grupos).all();
        const stringGroups = groups.map((grupo) => ({
          id_grupo: grupo.id_grupo,
          nombre: grupo.nombre,
          color: grupo.color,
          fecha_creacion: grupo.fecha_creacion,
        }));

        if (isActive) {
          setData(stringGroups);
        }

        if (groups.length === 0) {
          const result = await db
            .insert(grupos)
            .values({
              id_grupo: 1,
              nombre: "Grupo 1",
              color: "#FF0000",
              fecha_creacion: new Date().toISOString(),
            })
            .returning();

          setData((prev) => [
            ...prev,
            {
              id_grupo: result[0].id_grupo,
              nombre: result[0].nombre,
              color: result[0].color,
              fecha_creacion: result[0].fecha_creacion,
            },
          ]);
        }
      } catch (error) {
        console.error("Error al cargar los datos:", error);
        if (isActive) {
          setData([]);
        }
      }
    };

    loadData();

    return () => {
      isActive = false;
    };
  }, [db]);

  if (error) {
    return <Text>{error.message}</Text>;
  }
  const handleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const saveData = async (data: GroupData) => {
    const result = await db
      .insert(grupos)
      .values({
        nombre: data.nombre,
        color: data.color,
        fecha_creacion: new Date().toISOString(),
      })
      .returning();

    setData((prev) => [
      ...prev,
      {
        id_grupo: result[0].id_grupo,
        nombre: result[0].nombre,
        color: result[0].color,
        fecha_creacion: result[0].fecha_creacion,
      },
    ]);
  };
  const deleteData = async (id: number) => {
    Alert.alert(
      "Confirmación",
      "¿Estás seguro de que deseas eliminar este grupo y todo su contenido?",
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
                const tareasDelGrupo = await tx
                  .select({ id_tarea: tareas.id_tarea })
                  .from(tareas)
                  .where(eq(tareas.id_grupo, id));
                for (const tarea of tareasDelGrupo) {
                  await tx
                    .delete(subtareas)
                    .where(eq(subtareas.id_tarea, tarea.id_tarea));
                }
                await tx.delete(tareas).where(eq(tareas.id_grupo, id));
                await tx.delete(grupos).where(eq(grupos.id_grupo, id));
              });
              setData((prev) => prev.filter((item) => item.id_grupo !== id));
            } catch (error) {
              console.error("Error al eliminar grupo:", error);
              Alert.alert(
                "Error",
                "No se pudo eliminar el grupo y su contenido"
              );
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const updateData = async (updatedGroup: GroupData) => {
    try {
      const result = await db
        .update(grupos)
        .set({
          nombre: updatedGroup.nombre,
          color: updatedGroup.color,
          fecha_creacion: updatedGroup.fecha_creacion,
        })
        .where(eq(grupos.id_grupo, Number(updatedGroup.id_grupo)))
        .returning();

      // Actualiza el estado local
      setData((prev) =>
        prev.map((item) =>
          item.id_grupo === updatedGroup.id_grupo
            ? {
                ...item,
                nombre: updatedGroup.nombre,
                color: updatedGroup.color,
                fecha_creacion: updatedGroup.fecha_creacion,
              }
            : item
        )
      );

      return result.map((item) => ({
        id_grupo: item.id_grupo,
        nombre: item.nombre,
        color: item.color,
        fecha_creacion: item.fecha_creacion,
      }));
      // Retorna el resultado si es necesario
    } catch (error) {
      console.error("Error al actualizar:", error);
      throw error; // Re-lanza el error para manejarlo en el componente
    }
  };
  const handleUpdate = (group: GroupData) => {
    setEditingGroup(group);
    setModalVisible(true);
  };

  const renderItem = ({ item }: { item: GroupData }) =>
    item && (
      <Item
        elemento={{ ...item, tipo: "grupo" }}
        onDelete={() => deleteData(item.id_grupo)}
        onUpdate={() => handleUpdate(item)}
      />
    );
  return (
    <SafeAreaView style={styles.container}>
      <Header handleModal={handleModal} tipo="grupo" />
      <FlatList
        data={data}
        renderItem={({ item }: { item: GroupData }) => renderItem({ item })}
        keyExtractor={(item) => item.id_grupo.toString()}
      />
      <ModalGuardar
        modalVisible={isModalVisible}
        tipo={"grupo"}
        onClose={() => {
          setModalVisible(false);
          setEditingGroup(undefined);
        }}
        onSave={saveData}
        onUpdate={updateData}
        initialgrupo={editingGroup}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    backgroundColor: "#0D1F23",
    paddingVertical: 24,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#AFB3B7",
    letterSpacing: 0.5,
  },
  addButton: {
    flexDirection: "row",
    backgroundColor: "#2D4A53",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
    marginTop: 24,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    color: "#AFB3B7",
    marginLeft: 10,
    fontWeight: "500",
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  logoutText: {
    color: "#AFB3B7",
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "500",
  },
  cardContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: "#69818D",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#132E35",
    marginBottom: 4,
  },
  dateText: {
    fontSize: 13,
    color: "#5A636A",
    opacity: 0.8,
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
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    backgroundColor: "#2D4A53",
  },
  completedText: {
    fontSize: 13,
    color: "#2D4A53",
    fontStyle: "italic",
  },
});

export default Home;

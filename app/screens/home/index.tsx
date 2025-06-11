import { grupos } from "@/db/schema";
import { useFocusEffect } from "@react-navigation/native";
import { eq } from "drizzle-orm";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import React, { useState } from "react";

import { ModalGuardar } from "@/Components/modal";
import { Ionicons } from "@expo/vector-icons";
import {
  FlatList,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Item } from "../../../Components/Item";
import { useDatabase } from "../../../context/DatabaseContext";
import migrations from "../../../drizzle/migrations";
import { colors } from "../../../theme/colors";
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
  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;
      const loadData = async () => {
        try {
          const groups = await db.select().from(grupos).all();
          const stringGorups = groups.map((grupos) => ({
            id_grupo: grupos.id_grupo,
            nombre: grupos.nombre,
            color: grupos.color,
            fecha_creacion: grupos.fecha_creacion,
          }));
          if (isActive) {
            setData(stringGorups);
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
            // Opcional: Mostrar estado de error
            setData([]);
          }
        }
      };
      loadData();
    }, [])
  );

  if (error) {
    return <Text>{error.message}</Text>;
  }
  const handleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const saveData = async (nuevoGrupo: GroupData) => {
    const result = await db
      .insert(grupos)
      .values({
        nombre: nuevoGrupo.nombre,
        color: nuevoGrupo.color,
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
    const result = await db
      .delete(grupos)
      .where(eq(grupos.id_grupo, Number(id)))
      .returning();
    setData((prev) => prev.filter((item) => item.id_grupo !== id));
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
    console.log(
      "Este es el usuario seleccionado:" + JSON.stringify(editingGroup)
    );
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
      <StatusBar barStyle="dark-content" backgroundColor={colors.primary} />

      <View style={styles.header}>
        <Text style={styles.title}>To Do</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.welcomeText}>Bienvenido a To Do</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Base de datos lista</Text>
          <Text style={styles.cardText}>
            Puedes comenzar a gestionar tus datos.
          </Text>
        </View>

        <TouchableOpacity style={styles.addButton} onPress={handleModal}>
          <Ionicons name="add-circle" size={24} color="white" />
          <Text style={styles.addButtonText}>Crear un grupo de tareas</Text>
        </TouchableOpacity>
      </ScrollView>
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

export default Home;

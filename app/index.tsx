import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { eq } from "drizzle-orm";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import React, { useState } from "react";
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
import { Item } from "../Components/Item";
import { ModalGuardar } from "../Components/modal";
import { useDatabase } from "../context/DatabaseContext";
import { usersTable } from "../db/schema";
import migrations from "../drizzle/migrations";
import { colors } from "../theme/colors";

interface UserData {
  id: string;
  name: string;
  age: string;
  email: string;
}

const Home = () => {
  const db = useDatabase();
  const { success, error } = useMigrations(db, migrations);
  const [isModalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState<UserData[]>([]);
  const [editingUser, setEditingUser] = useState<UserData>();
  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;
      const loadData = async () => {
        try {
          const users = await db.select().from(usersTable).all();
          const stringUsers = users.map((user) => ({
            id: user.id.toString(),
            name: user.name,
            age: user.age.toString(),
            email: user.email,
          }));
          if (isActive) {
            setData(stringUsers);
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
  const saveData = async (nuevoUsuario: UserData) => {
    const result = await db
      .insert(usersTable)
      .values({
        name: nuevoUsuario.name,
        age: Number(nuevoUsuario.age),
        email: nuevoUsuario.email,
      })
      .returning();

    setData((prev) => [
      ...prev,
      {
        id: result[0].id.toString(),
        name: result[0].name,
        age: result[0].age.toString(),
        email: result[0].email,
      },
    ]);
  };
  const deleteData = async (id: string) => {
    const result = await db
      .delete(usersTable)
      .where(eq(usersTable.id, Number(id)))
      .returning();
    setData((prev) => prev.filter((item) => item.id !== id));
  };
  const updateData = async (updatedUser: UserData) => {
    try {
      const result = await db
        .update(usersTable)
        .set({
          name: updatedUser.name,
          age: Number(updatedUser.age),
          email: updatedUser.email,
        })
        .where(eq(usersTable.id, Number(updatedUser.id)))
        .returning();

      // Actualiza el estado local
      setData((prev) =>
        prev.map((item) =>
          item.id === updatedUser.id
            ? {
                ...item,
                name: result[0].name,
                age: result[0].age.toString(),
                email: result[0].email,
              }
            : item
        )
      );

      return result.map((item) => ({
        id: item.id.toString(),
        name: item.name,
        age: item.age.toString(),
        email: item.email,
      }));
      // Retorna el resultado si es necesario
    } catch (error) {
      console.error("Error al actualizar:", error);
      throw error; // Re-lanza el error para manejarlo en el componente
    }
  };
  const handleUpdate = (user: UserData) => {
    setEditingUser(user);
    console.log(
      "Este es el usuario seleccionado:" +
        user.age +
        " " +
        user.name +
        " " +
        user.email
    );
    setModalVisible(true);
  };
  const renderItem = ({ item }: { item: UserData }) =>
    item && (
      <Item
        elemento={item}
        onDelete={() => deleteData(item.id)}
        onUpdate={() => handleUpdate(item)}
      />
    );
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.primary} />

      <View style={styles.header}>
        <Text style={styles.title}>Mi Aplicación</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.welcomeText}>Bienvenido a la aplicación</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Base de datos lista</Text>
          <Text style={styles.cardText}>
            Puedes comenzar a gestionar tus datos.
          </Text>
        </View>

        <TouchableOpacity style={styles.addButton} onPress={handleModal}>
          <Ionicons name="add-circle" size={24} color="white" />
          <Text style={styles.addButtonText}>Agregar nuevo usuario</Text>
        </TouchableOpacity>
      </ScrollView>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
      <ModalGuardar
        modalVisible={isModalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingUser(undefined);
        }}
        onSave={saveData}
        onUpdate={updateData}
        initialUser={editingUser}
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

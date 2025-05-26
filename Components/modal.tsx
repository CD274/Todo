import { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
interface Props {
  modalVisible: boolean;
  onClose: () => void;
  onSave: (userData: UserData) => Promise<void>;
  onUpdate?: (userData: UserData) => Promise<UserData[]>;
  initialUser?: UserData;
}
interface UserData {
  id: string;
  name: string;
  age: string;
  email: string;
}
export const ModalGuardar = ({
  modalVisible,
  onClose,
  onSave,
  onUpdate,
  initialUser,
}: Props) => {
  const [user, setUser] = useState<UserData>({
    id: "",
    name: "",
    age: "",
    email: "",
  });
  useEffect(() => {
    if (modalVisible && initialUser) {
      setUser(initialUser);
    } else if (!modalVisible) {
      setUser({
        id: "",
        name: "",
        age: "",
        email: "",
      });
    }
  }, [modalVisible, initialUser]); // Dependencias del efecto
  const handleOnChange = (campo: keyof UserData, valor: string) => {
    setUser((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };
  const validation = (user: UserData) => {
    if (user.name === "" || user.age === "" || user.email === "") {
      const missingField =
        user.name === "" ? "nombre" : user.age === "" ? "edad" : "email";
      Alert.alert("Error", `El campo ${missingField} es obligatorio`);
      return false;
    }
    return true;
  };
  const handleActions = (accion: string, user: UserData) => {
    switch (accion) {
      case "save":
        if (!validation(user)) return;
        onSave(user);
        resetForm();
        onClose();
        break;
      case "update":
        if (!validation(user)) return;
        if (onUpdate) onUpdate(user);
        else console.log("No se puede actualizar");
        resetForm();
        onClose();

        break;
      case "close": {
        onClose();
        resetForm();
        break;
      }
      case "cancel":
        onClose();
        resetForm();
        break;
      default:
        break;
    }
  };
  const resetForm = () => {
    setUser({
      id: "",
      name: "",
      age: "",
      email: "",
    });
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        Alert.alert("Modal has been closed.");
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Registrar Usuario</Text>

          <TextInput
            style={styles.input}
            onChangeText={(text) => handleOnChange("name", text)}
            value={user.name}
            placeholder="Nombre completo"
            placeholderTextColor="#999"
          />

          <TextInput
            style={styles.input}
            onChangeText={(text) => handleOnChange("age", text)}
            keyboardType="numeric"
            maxLength={2}
            value={user.age.toString()}
            placeholder="Edad"
            placeholderTextColor="#999"
          />

          <TextInput
            style={styles.input}
            onChangeText={(text) => handleOnChange("email", text)}
            keyboardType="email-address"
            value={user.email}
            placeholder="Correo electrónico"
            placeholderTextColor="#999"
            autoCapitalize="none"
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.buttonSave]}
              onPress={() =>
                initialUser
                  ? handleActions("update", user)
                  : handleActions("save", user)
              }
            >
              <Text style={styles.buttonText}>
                {initialUser ? "Actualizar" : "Guardar"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.buttonCancel]}
              onPress={() => handleActions("cancel", user)}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    borderRadius: 10,
    padding: 15,
    elevation: 2,
    minWidth: "48%",
    alignItems: "center",
  },
  buttonSave: {
    backgroundColor: "#2196F3",
  },
  buttonCancel: {
    backgroundColor: "#f44336",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

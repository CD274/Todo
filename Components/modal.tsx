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
import ColorPickerComponent from "../Components/ColorPicker";
interface Props {
  modalVisible: boolean;
  onClose: () => void;
  onSave: (GroupData: GroupData) => Promise<void>;
  onUpdate?: (GroupData: GroupData) => Promise<GroupData[]>;
  initialgrupo?: GroupData;
}
interface GroupData {
  id_grupo: number;
  nombre: string;
  color: string | null;
  fecha_creacion: string | null;
}

export const ModalGuardar = ({
  modalVisible,
  onClose,
  onSave,
  onUpdate,
  initialgrupo,
}: Props) => {
  const [grupo, setgrupo] = useState<GroupData>({
    id_grupo: 0,
    nombre: "",
    color: "",
    fecha_creacion: "",
  });
  useEffect(() => {
    if (modalVisible && initialgrupo) {
      setgrupo(initialgrupo);
    } else if (!modalVisible) {
      resetForm();
    }
  }, [modalVisible, initialgrupo]); // Dependencias del efecto
  const handleOnChange = (campo: keyof GroupData, valor: string) => {
    setgrupo((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };
  const validation = (group: GroupData) => {
    if (
      group.nombre === "" ||
      group.color === "" ||
      group.fecha_creacion === ""
    ) {
      const missingField =
        group.nombre === ""
          ? "nombre"
          : group.color === ""
          ? "color"
          : "fecha_creacion";
      Alert.alert("Error", `El campo ${missingField} es obligatorio`);
      return false;
    }
    return true;
  };
  const handleChageColor = (color: string) => {
    setgrupo((prev) => ({
      ...prev,
      color: color,
    }));
  };
  const handleActions = (accion: string, grupo: GroupData) => {
    switch (accion) {
      case "save":
        if (!validation(grupo)) return;
        onSave(grupo);
        resetForm();
        onClose();
        break;
      case "update":
        if (!validation(grupo)) return;
        if (onUpdate) onUpdate(grupo);
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
    setgrupo({
      id_grupo: 0,
      nombre: "",
      color: "",
      fecha_creacion: "",
    });
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        handleActions("cancel", grupo);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>
            {initialgrupo ? "Editar Grupo" : "Crear Grupo"}
          </Text>

          <TextInput
            style={styles.input}
            onChangeText={(text) => handleOnChange("nombre", text)}
            value={grupo.nombre}
            placeholder="Nombre del Grupo"
            placeholderTextColor="#999"
          />
          <View style={styles.colorPickerWrapper}>
            <ColorPickerComponent
              onColorSelected={handleChageColor}
              initialColor={grupo.color || "#3498db"}
            />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.buttonSave]}
              onPress={() =>
                initialgrupo
                  ? handleActions("update", grupo)
                  : handleActions("save", grupo)
              }
            >
              <Text style={styles.buttonText}>
                {initialgrupo ? "Actualizar" : "Guardar"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.buttonCancel]}
              onPress={() => handleActions("cancel", grupo)}
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
    width: "85%",
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
  colorPickerWrapper: {
    marginBottom: 15,
    alignItems: "center", // Centra el color picker horizontalmente
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15, // Aumenté el margen superior
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

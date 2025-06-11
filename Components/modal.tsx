import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
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
  tipo: "grupo" | "tarea";
  onClose: () => void;
  onSave: (GroupData: GroupData) => Promise<void>;
  onUpdate?: (GroupData: GroupData) => Promise<GroupData[]>;
  initialgrupo?: GroupData;
  initialtarea?: TaskProps;
}
interface GroupData {
  id_grupo: number;
  nombre: string;
  color: string | null;
  fecha_creacion: string | null;
}
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

export const ModalGuardar = ({
  modalVisible,
  tipo,
  onClose,
  onSave,
  onUpdate,
  initialgrupo,
  initialtarea,
}: Props) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [grupo, setgrupo] = useState<GroupData>({
    id_grupo: 0,
    nombre: "",
    color: "",
    fecha_creacion: "",
  });
  const formatDateToString = (date: Date | null): string => {
    if (!date) return "";
    return date.toISOString().split("T")[0];
  };
  const parseStringToDate = (dateString: string | null): Date => {
    return dateString ? new Date(dateString) : new Date();
  };
  const [tarea, settarea] = useState<TaskProps>({
    id_tarea: 0,
    id_grupo: 0,
    titulo: "",
    descripcion: "",
    completada: false,
    fecha_creacion: formatDateToString(new Date()),
    fecha_vencimiento: formatDateToString(new Date()),
    prioridad: "baja",
  });

  useEffect(() => {
    if (modalVisible && initialtarea) {
      settarea(initialtarea);
    } else if (modalVisible && initialgrupo) {
      setgrupo(initialgrupo);
    } else if (!modalVisible) {
      resetForm();
    }
  }, [modalVisible, initialgrupo, initialtarea]);
  const handleOnChange = (
    campo: keyof (GroupData | TaskProps),
    valor: string | Date | boolean | "baja" | "media" | "alta"
  ) => {
    if (tipo === "tarea") {
      // Manejo especial para fechas
      if (campo === "fecha_vencimiento" && valor instanceof Date) {
        settarea((prev) => ({ ...prev, [campo]: formatDateToString(valor) }));
      } else {
        settarea((prev) => ({ ...prev, [campo]: valor }));
      }
    } else if (tipo === "grupo") {
      setgrupo((prev) => ({ ...prev, [campo]: valor }));
    }
  };
  const validation = (data: GroupData | TaskProps) => {
    if (data.nombre === "" || data.color === "") {
      const missingField =
        data.nombre === "" ? "nombre" : data.color === "" ? "color" : "";
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
  const handleActions = (
    accion: string,
    grupo?: GroupData,
    tarea?: TaskProps
  ) => {
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
            {tipo === "grupo"
              ? initialgrupo
                ? "Editar Grupo"
                : "Crear Grupo"
              : initialtarea
              ? "Editar Tarea"
              : "Crear Tarea"}
          </Text>

          {tipo === "grupo" && (
            <View>
              <View>
                <TextInput
                  style={styles.input}
                  onChangeText={(text) => handleOnChange("nombre", text)}
                  value={grupo.nombre}
                  placeholder="Nombre del Grupo"
                  placeholderTextColor="#999"
                />
              </View>
              <View style={styles.colorPickerWrapper}>
                <ColorPickerComponent
                  onColorSelected={handleChageColor}
                  initialColor={grupo.color || "#3498db"}
                />
              </View>
            </View>
          )}
          {tipo === "tarea" && (
            <View>
              <TextInput
                style={styles.input}
                onChangeText={(text) => handleOnChange("titulo", text)}
                value={tarea.titulo}
                placeholder="Título de la Tarea"
                placeholderTextColor="#999"
              />

              <TextInput
                style={[styles.input, styles.multilineInput]}
                onChangeText={(text) => handleOnChange("descripcion", text)}
                value={tarea.descripcion}
                placeholder="Descripción"
                placeholderTextColor="#999"
                multiline
              />

              <View style={styles.dateContainer}>
                <Text style={styles.label}>Fecha de vencimiento:</Text>

                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  style={styles.dateButton}
                >
                  <Text>
                    {tarea.fecha_vencimiento
                      ? parseStringToDate(
                          tarea.fecha_vencimiento
                        ).toLocaleDateString()
                      : "Seleccionar fecha"}
                  </Text>
                </TouchableOpacity>

                {showDatePicker && (
                  <DateTimePicker
                    value={parseStringToDate(tarea.fecha_vencimiento)}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(false);
                      if (event.type === "set" && selectedDate) {
                        handleOnChange("fecha_vencimiento", selectedDate);
                      }
                    }}
                  />
                )}
              </View>

              <View style={styles.priorityContainer}>
                <Text style={styles.label}>Prioridad:</Text>
                <Picker
                  selectedValue={tarea.prioridad || "baja"}
                  onValueChange={(value) => handleOnChange("prioridad", value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Baja" value="baja" />
                  <Picker.Item label="Media" value="media" />
                  <Picker.Item label="Alta" value="alta" />
                </Picker>
              </View>
            </View>
          )}
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
  dateButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: "top",
  },
  dateContainer: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    color: "#000",
  },
  priorityContainer: {
    marginBottom: 15,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  checkboxLabel: {
    marginLeft: 8,
    color: "#000",
  },
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

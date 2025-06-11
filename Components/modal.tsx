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

interface BaseModalProps {
  modalVisible: boolean;
  onClose: () => void;
}

interface GroupModalProps extends BaseModalProps {
  tipo: "grupo";
  onSave: (data: GroupData) => Promise<void>;
  onUpdate?: (data: GroupData) => Promise<GroupData[]>;
  initialgrupo?: GroupData;
}

interface TaskModalProps extends BaseModalProps {
  tipo: "tarea";
  onSave: (data: TaskProps) => Promise<void>;
  onUpdate?: (data: TaskProps) => Promise<TaskProps[]>;
  initialTarea?: TaskProps;
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
type Props = GroupModalProps | TaskModalProps;
export const ModalGuardar = (props: Props) => {
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
    if (props.modalVisible) {
      if (props.tipo === "tarea" && props.initialTarea) {
        settarea(props.initialTarea);
      } else if (props.tipo === "grupo" && props.initialgrupo) {
        setgrupo(props.initialgrupo);
      }
    } else {
      resetForm();
    }
  }, [props.modalVisible, props.initialgrupo, props.initialTarea, props.tipo]);

  const handleOnChange = (
    campo: keyof (GroupData | TaskProps),
    valor: string | Date | boolean | "baja" | "media" | "alta"
  ) => {
    if (props.tipo === "tarea") {
      const campoTarea = campo as keyof TaskProps;
      if (campoTarea === "fecha_vencimiento" && valor instanceof Date) {
        settarea((prev) => ({
          ...prev,
          [campoTarea]: formatDateToString(valor),
        }));
      } else {
        settarea((prev) => ({ ...prev, [campoTarea]: valor }));
      }
    } else if (props.tipo === "grupo") {
      setgrupo((prev) => ({ ...prev, [campo]: valor }));
    }
  };
  const validation = (data: GroupData | TaskProps) => {
    if (props.tipo === "tarea") {
      const tarea = data as TaskProps;
      if (
        (tarea.titulo === "" || data.fecha_creacion === "",
        tarea.descripcion === "")
      ) {
        const missingField =
          tarea.titulo === ""
            ? "titulo"
            : tarea.descripcion === ""
            ? "descripcion"
            : tarea.fecha_creacion === ""
            ? "fecha_creacion"
            : "";
        Alert.alert("Error", `El campo ${missingField} es obligatorio`);
        return false;
      }
    }
    if (props.tipo === "grupo") {
      const grupo = data as GroupData;
      if (grupo.nombre === "" || grupo.color === "") {
        const missingField =
          grupo.nombre === "" ? "nombre" : grupo.color === "" ? "color" : "";
        Alert.alert("Error", `El campo ${missingField} es obligatorio`);
        return false;
      }
    }
    return true;
  };
  const handleChageColor = (color: string) => {
    setgrupo((prev) => ({
      ...prev,
      color: color,
    }));
  };
  const handleActions = (accion: string, data?: GroupData | TaskProps) => {
    switch (accion) {
      case "save":
        if (!validation(data)) return;
        props.onSave(data);
        resetForm();
        props.onClose();
        break;

      case "update":
        if (!validation(data)) return;
        if (props.onUpdate) {
          props.onUpdate(data);
        } else {
          console.log("No se puede actualizar");
        }
        resetForm();
        props.onClose();
        break;

      case "close":
      case "cancel":
        props.onClose();
        resetForm();
        break;

      default:
        break;
    }
  };
  const getButtonAction = () => {
    if (props.tipo === "grupo") {
      return props.initialgrupo
        ? () => handleActions("update", grupo)
        : () => handleActions("save", grupo);
    } else {
      return props.initialTarea
        ? () => handleActions("update", tarea)
        : () => handleActions("save", tarea);
    }
  };

  const getButtonText = () => {
    if (props.tipo === "grupo") {
      return props.initialgrupo ? "Actualizar" : "Guardar";
    }
    return props.initialTarea ? "Actualizar" : "Guardar";
  };
  const resetForm = () => {
    settarea({
      id_tarea: 0,
      id_grupo: 0,
      titulo: "",
      descripcion: "",
      completada: false,
      fecha_creacion: "",
      fecha_vencimiento: formatDateToString(new Date()),
      prioridad: "baja",
    });
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
      visible={props.modalVisible}
      onRequestClose={() => {
        handleActions("cancel", grupo);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>
            {props.tipo === "grupo"
              ? props.initialgrupo
                ? "Editar Grupo"
                : "Crear Grupo"
              : props.initialTarea
              ? "Editar Tarea"
              : "Crear Tarea"}
          </Text>

          {props.tipo === "grupo" && (
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
          {props.tipo === "tarea" && (
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
              onPress={getButtonAction()}
            >
              <Text style={styles.buttonText}>{getButtonText()}</Text>
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

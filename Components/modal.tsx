import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
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
  fecha_creacion: string | null;
  fecha_vencimiento: string | null;
  prioridad: "baja" | "media" | "alta" | null;
  subtareas: Subtarea[];
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
    subtareas: [],
  });

  useEffect(() => {
    if (props.modalVisible) {
      if (props.tipo === "tarea" && props.initialTarea) {
        settarea({
          ...props.initialTarea,
          subtareas: props.initialTarea.subtareas || [],
        });
      } else if (props.tipo === "grupo" && props.initialgrupo) {
        setgrupo(props.initialgrupo);
      }
    } else {
      resetForm();
    }
  }, [props.modalVisible, props.initialgrupo, props.initialTarea, props.tipo]);

  const handleOnChange = (
    campo: keyof (GroupData | TaskProps),
    valor: string | Date | boolean | "baja" | "media" | "alta" | Subtarea[]
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
      if (tarea.titulo === "" || tarea.descripcion === "") {
        const missingField = tarea.titulo === "" ? "título" : "descripción";
        Alert.alert("Error", `El campo ${missingField} es obligatorio`);
        return false;
      }

      // Validar subtareas
      for (const subtarea of tarea.subtareas) {
        if (subtarea.titulo.trim() === "") {
          Alert.alert("Error", "Todas las subtareas deben tener un título");
          return false;
        }
      }
    }

    if (props.tipo === "grupo") {
      const grupo = data as GroupData;
      if (grupo.nombre === "" || grupo.color === "") {
        const missingField = grupo.nombre === "" ? "nombre" : "color";
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

  const agregarSubtarea = () => {
    settarea((prev) => ({
      ...prev,
      subtareas: [...prev.subtareas, { titulo: "", completada: false }],
    }));
  };

  const eliminarSubtarea = (index: number) => {
    settarea((prev) => ({
      ...prev,
      subtareas: prev.subtareas.filter((_, i) => i !== index),
    }));
  };

  const handleSubtareaChange = (
    index: number,
    field: keyof Subtarea,
    value: string | boolean
  ) => {
    settarea((prev) => {
      const nuevasSubtareas = [...prev.subtareas];
      nuevasSubtareas[index] = {
        ...nuevasSubtareas[index],
        [field]: value,
      };
      return {
        ...prev,
        subtareas: nuevasSubtareas,
      };
    });
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
      subtareas: [],
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
                value={tarea.descripcion || ""}
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

              <View>
                <Text style={styles.sectionTitle}>Subtareas</Text>
                <ScrollView style={styles.subtareasScroll}>
                  {tarea.subtareas.map((subtarea, index) => (
                    <View key={index} style={styles.subtareaContainer}>
                      <TextInput
                        style={[styles.input, styles.subtareaInput]}
                        onChangeText={(value) =>
                          handleSubtareaChange(index, "titulo", value)
                        }
                        value={subtarea.titulo}
                        placeholder={`Subtarea ${index + 1}`}
                        placeholderTextColor="#999"
                      />
                      <View style={styles.subtareaActions}>
                        <Switch
                          value={subtarea.completada}
                          onValueChange={(value) =>
                            handleSubtareaChange(index, "completada", value)
                          }
                        />
                        {tarea.subtareas.length > 1 && (
                          <TouchableOpacity
                            onPress={() => eliminarSubtarea(index)}
                            style={styles.deleteButton}
                          >
                            <Text style={styles.deleteButtonText}>×</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  ))}
                  <TouchableOpacity
                    onPress={agregarSubtarea}
                    style={styles.addButton}
                  >
                    <Text style={styles.addButtonText}>+ Agregar subtarea</Text>
                  </TouchableOpacity>
                </ScrollView>
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  multilineInput: {
    height: 80,
    textAlignVertical: "top",
  },
  dateContainer: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    fontWeight: "500",
  },
  dateButton: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  priorityContainer: {
    marginBottom: 15,
  },
  picker: {
    height: 50,
    width: "100%",
  },
  colorPickerWrapper: {
    marginVertical: 15,
  },
  subtareasScroll: {
    maxHeight: 150,
    marginBottom: 15,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtareaContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  subtareaInput: {
    flex: 1,
    marginRight: 10,
  },
  subtareaActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  deleteButton: {
    marginLeft: 10,
    backgroundColor: "#ff4444",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 5,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    width: "48%",
    alignItems: "center",
  },
  buttonSave: {
    backgroundColor: "#4CAF50",
  },
  buttonCancel: {
    backgroundColor: "#f44336",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

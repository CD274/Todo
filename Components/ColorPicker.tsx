import React, { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ColorPicker from "react-native-wheel-color-picker";
interface ColorPickerProps {
  onColorSelected: (color: string) => void;
  initialColor?: string;
}
const ColorPickerComponent = ({ onColorSelected }: ColorPickerProps) => {
  const [color, setColor] = useState("#0D1F23");
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    onColorSelected(newColor);
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => setShowColorPicker(true)}
        style={[styles.colorButton, { backgroundColor: color }]}
      >
        <Text style={styles.buttonText}>Selecciona un color</Text>
      </TouchableOpacity>

      <Modal visible={showColorPicker} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <ColorPicker
            color={color}
            onColorChange={handleColorChange}
            thumbSize={40}
            sliderSize={30}
            noSnap={true}
            row={false}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowColorPicker(false)}
          >
            <Text style={styles.closeText}>Aplicar Color</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  colorButton: {
    padding: 15,
    borderRadius: 10,
    margin: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    padding: 20,
  },
  closeButton: {
    backgroundColor: "#333",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  closeText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default ColorPickerComponent;

import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { authStyles } from "../../styles/authStyles";

const ForgetPass = () => {
  const [email, setEmail] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [ismodalVisible, setModalVisible] = useState(false);
  const navigation = useRouter();
  const { validateEmail, resetPassword } = useAuth();
  const handleForgetPass = async () => {
    try {
      const data = await validateEmail(email);
      if (data.success) {
        setModalVisible(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleResetPass = async () => {
    try {
      const data = await resetPassword({ email, password: newPassword });
      if (data.success) {
        setModalVisible(false);
      }
    } catch (error) {
      console.log("Error del handleResetPass: ", error);
    }
  };
  return (
    <View style={authStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D1F23" />

      {/* Barra de navegación superior */}
      <View style={authStyles.navBar}>
        <TouchableOpacity
          onPress={() => navigation.back()}
          style={authStyles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#AFB3B7" />
        </TouchableOpacity>
        <Text style={authStyles.navTitle}>Recuperar contraseña</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={authStyles.content}>
        <Text style={authStyles.title}>Recupera tu acceso</Text>

        <TextInput
          style={authStyles.input}
          placeholder="Correo electrónico"
          placeholderTextColor="#999"
          keyboardType="email-address"
          onChange={(e) => setEmail(e.nativeEvent.text)}
        />

        <TouchableOpacity
          style={authStyles.button}
          onPress={() => handleForgetPass()}
          activeOpacity={0.8}
        >
          <Text style={authStyles.buttonText}>Recuperar contraseña</Text>
        </TouchableOpacity>

        <View style={authStyles.linksContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate("/(auth)/login")}
            activeOpacity={0.7}
          >
            <Text style={authStyles.linkText}>Volver al inicio de sesión</Text>
          </TouchableOpacity>
        </View>
        <View>
          <Modal
            animationType="fade"
            transparent={true}
            visible={ismodalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={authStyles.centeredView}>
              <View style={authStyles.modalView}>
                <Text style={authStyles.modalTitle}>Cambiar Contraseña</Text>

                <ScrollView style={authStyles.scrollContainer}>
                  <TextInput
                    style={authStyles.input}
                    placeholder="Nueva Contraseña"
                    placeholderTextColor="#999"
                    secureTextEntry
                    onChangeText={(text) => setNewPassword(text)}
                  />
                </ScrollView>

                <View style={authStyles.fixedFooter}>
                  <View style={authStyles.buttonContainer}>
                    <TouchableOpacity
                      style={[authStyles.button, authStyles.buttonCancel]}
                      onPress={() => setModalVisible(false)}
                      activeOpacity={0.8}
                    >
                      <Text style={authStyles.buttonCancelText}>Cancelar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[authStyles.button, authStyles.buttonSave]}
                      onPress={handleResetPass}
                      activeOpacity={0.8}
                    >
                      <Text style={authStyles.buttonSaveText}>
                        Cambiar Contraseña
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </View>
    </View>
  );
};

export default ForgetPass;

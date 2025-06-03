// ForgetPass.js
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { authStyles } from "../../../styles/authStyles";

const ForgetPass = () => {
  const navigation = useNavigation();

  return (
    <View style={authStyles.container}>
      <TouchableOpacity
        style={authStyles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={authStyles.backButtonText}>← Volver</Text>
      </TouchableOpacity>

      <Text style={authStyles.title}>Recuperar Contraseña</Text>

      <TextInput
        style={authStyles.input}
        placeholder="Correo electrónico"
        keyboardType="email-address"
      />

      <TouchableOpacity
        style={authStyles.button}
        onPress={() => alert("Correo de recuperación enviado")}
      >
        <Text style={authStyles.buttonText}>Enviar enlace</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={authStyles.linkText}>Volver al inicio de sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ForgetPass;

// Register.js
import { useAuth } from "@/context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { authStyles } from "../../../styles/authStyles";
const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const { register } = useAuth();
  const handleRegister = async () => {
    try {
      await register({ email: email, password: password });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View style={authStyles.container}>
      <TouchableOpacity
        style={authStyles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={authStyles.backButtonText}>← Volver</Text>
      </TouchableOpacity>

      <Text style={authStyles.title}>Registro</Text>
      <TextInput
        style={authStyles.input}
        placeholder="Correo electrónico"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={authStyles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={authStyles.button}
        onPress={() => handleRegister()}
      >
        <Text style={authStyles.buttonText}>Registrarse</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={authStyles.linkText}>
          ¿Ya tienes cuenta? Inicia sesión
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Register;

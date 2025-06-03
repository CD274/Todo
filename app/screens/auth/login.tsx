// Login.js
import { useAuth } from "@/context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { authStyles } from "../../../styles/authStyles";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigation = useNavigation();
  const handleLogin = async () => {
    try {
      const result = await login({ email, password });
      if (result.success) {
        Alert.alert("Inicio de sesión exitoso: ", result.message);
      } else {
        Alert.alert("Error al iniciar sesión");
      }
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

      <Text style={authStyles.title}>Iniciar Sesión</Text>

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

      <TouchableOpacity style={authStyles.button} onPress={() => handleLogin()}>
        <Text style={authStyles.buttonText}>Ingresar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("ForgetPass")}>
        <Text style={authStyles.linkText}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={authStyles.linkText}>Crear una cuenta</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;

import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { authStyles } from "../../styles/authStyles";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useRouter();
  const { register } = useAuth();

  const handleRegister = async () => {
    try {
      await register({ email: email, password: password });
      setEmail("");
      setPassword("");
    } catch (error) {
      console.log(error);
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
        <Text style={authStyles.navTitle}>Crear cuenta</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={authStyles.content}>
        <Text style={authStyles.title}>Registro</Text>

        <TextInput
          style={authStyles.input}
          placeholder="Correo electrónico"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={authStyles.input}
          placeholder="Ejemplo de Contraseña: Seguro#2025"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={authStyles.button}
          onPress={handleRegister}
          activeOpacity={0.8}
        >
          <Text style={authStyles.buttonText}>Registrarse</Text>
        </TouchableOpacity>

        <View style={authStyles.linksContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate("/(auth)/login")}
            activeOpacity={0.7}
          >
            <Text style={authStyles.linkText}>
              ¿Ya tienes cuenta? Inicia sesión
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Register;

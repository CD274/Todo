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

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigation = useRouter();

  const handleLogin = async () => {
    try {
      const result = await login({ email, password });
      if (result) {
        navigation.replace("/(tabs)/home");
      }
    } catch (error) {
      console.error("Error en login:", error);
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
        <Text style={authStyles.navTitle}>Iniciar sesión</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={authStyles.content}>
        <Text style={authStyles.title}>Bienvenido</Text>
        <TextInput
          style={authStyles.input}
          placeholder="Correo electrónico"
          placeholderTextColor="#999"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={authStyles.input}
          placeholder="Contraseña"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={authStyles.button}
          onPress={handleLogin}
          activeOpacity={0.8}
        >
          <Text style={authStyles.buttonText}>Ingresar</Text>
        </TouchableOpacity>

        <View style={authStyles.linksContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate("/(auth)/forgetPass")}
            activeOpacity={0.7}
          >
            <Text style={authStyles.linkText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("/(auth)/register")}
            activeOpacity={0.7}
          >
            <Text style={[authStyles.linkText, { marginTop: 16 }]}>
              Crear una cuenta
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Login;

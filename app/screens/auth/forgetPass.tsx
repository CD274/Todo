import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { authStyles } from "../../../styles/authStyles";

const ForgetPass = () => {
  const navigation = useNavigation();

  return (
    <View style={authStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D1F23" />

      {/* Barra de navegación superior */}
      <View style={authStyles.navBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
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
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={authStyles.button}
          onPress={() => alert("Correo de recuperación enviado")}
          activeOpacity={0.8}
        >
          <Text style={authStyles.buttonText}>Enviar enlace</Text>
        </TouchableOpacity>

        <View style={authStyles.linksContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
            activeOpacity={0.7}
          >
            <Text style={authStyles.linkText}>Volver al inicio de sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ForgetPass;

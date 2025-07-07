import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  Alert,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface HeaderProps {
  handleModal: () => void;
  tipo: string;
}

export const Header = ({ handleModal, tipo }: HeaderProps) => {
  const { logout } = useAuth();
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleLogout = () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro que deseas salir de tu cuenta?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Cerrar sesión",
          style: "destructive",
          onPress: () => logout(),
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0D1F23" />
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          {tipo === "task" ? (
            <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
              <Ionicons name="arrow-back" size={20} color="#AFB3B7" />
            </TouchableOpacity>
          ) : (
            <View style={styles.emptyView} />
          )}

          <Text style={styles.title}>To Do</Text>

          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={20} color="#AFB3B7" />
            <Text style={styles.logoutText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleModal}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={20} color="#AFB3B7" />
          <Text style={styles.addButtonText}>
            {tipo === "task" ? "Nueva tarea" : "Nuevo grupo"}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#F5F7FA",
    paddingBottom: 8,
  },
  header: {
    backgroundColor: "#0D1F23",
    paddingVertical: 24,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#AFB3B7",
    letterSpacing: 0.5,
  },
  addButton: {
    flexDirection: "row",
    backgroundColor: "#2D4A53",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
    marginTop: 16,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    color: "#AFB3B7",
    marginLeft: 10,
    fontWeight: "500",
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  logoutText: {
    color: "#AFB3B7",
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "500",
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  emptyView: {
    width: 36, // Mismo ancho que el botón de retroceso para mantener el balance
  },
});

export default Header;

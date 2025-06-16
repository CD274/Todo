import { AuhtProvider } from "@/context/AuthContext";
import * as NavigationBar from "expo-navigation-bar";
import { useEffect } from "react";
import { Platform } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import RootNavigator from "./navigation/RootNavigator";
export default function App() {
  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setButtonStyleAsync("dark");
    }
  }, []);
  return (
    <PaperProvider>
      <AuhtProvider>
        <RootNavigator />
      </AuhtProvider>
    </PaperProvider>
  );
}

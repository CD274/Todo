import { AuhtProvider } from "@/context/AuthContext";
import { Provider as PaperProvider } from "react-native-paper";
import RootNavigator from "./navigation/RootNavigator";
export default function App() {
  return (
    <PaperProvider>
      <AuhtProvider>
        <RootNavigator />
      </AuhtProvider>
    </PaperProvider>
  );
}

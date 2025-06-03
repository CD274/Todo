import { AuhtProvider } from "@/context/AuthContext";
import RootNavigator from "./navigation/RootNavigator";

export default function App() {
  return (
    <AuhtProvider>
      <RootNavigator />
    </AuhtProvider>
  );
}

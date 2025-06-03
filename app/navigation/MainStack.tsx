import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../screens/home/index";
import Task from "../screens/home/task";

const Stack = createNativeStackNavigator();

const MainStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Task" component={Task} />
    </Stack.Navigator>
  );
};
export default MainStack;

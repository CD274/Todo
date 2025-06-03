import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ForgetPass from "../screens/auth/forgetPass";
import Login from "../screens/auth/login";
import Register from "../screens/auth/register";

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="ForgetPass" component={ForgetPass} />
    </Stack.Navigator>
  );
};

export default AuthStack;

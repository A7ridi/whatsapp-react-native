import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MessageScreen from "../screens/MessageScreen";
import { Ionicons, Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import MainTabNavigator from "./MainTabNavigator";

const Stack = createNativeStackNavigator();

const Navigator = () => {
  const navigation = useNavigation();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "whitesmoke" },
      }}
    >
      <Stack.Screen
        name="Home"
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Chat"
        component={MessageScreen}
        options={{
          headerLeft: () => {
            return (
              <Ionicons
                onPress={() => navigation.goBack()}
                name="chevron-back-circle-sharp"
                size={24}
                color="royalblue"
                style={{ marginRight: 10 }}
              />
            );
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default Navigator;

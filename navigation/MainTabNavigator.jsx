import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import NotImplementedScreen from "../screens/NotImplementedScreen";
import ChatScreen from "../screens/ChatScreen";
import { Ionicons, Entypo, FontAwesome } from "@expo/vector-icons";
import Settings from "../screens/Settings";
import ContactsScreen from "../screens/ContactsScreen";

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Chats"
      screenOptions={{
        tabBarIconStyle: { marginBottom: -3 },
        tabBarLabelStyle: { fontSize: 12, marginBottom: 4 },
        tabBarStyle: { backgroundColor: "whitesmoke" },
        headerStyle: { backgroundColor: "whitesmoke" },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Chats"
        component={ChatScreen}
        options={({ navigation }) => ({
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name={
                color === "#8E8E8F"
                  ? "chatbubble-ellipses-outline"
                  : "chatbubble-ellipses"
              }
              size={size}
              color={color}
            />
          ),
          headerRight: () => (
            <Entypo
              onPress={() => navigation.navigate("Contacts")}
              name="new-message"
              size={18}
              color={"royalblue"}
              style={{ marginRight: 15 }}
            />
          ),
        })}
      />

      <Tab.Screen
        name="Status"
        component={NotImplementedScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="ios-sync-circle-outline"
              size={size * 1.1}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Camera"
        component={NotImplementedScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="camera-outline" size={size * 1.1} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Contacts"
        component={ContactsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name={color === "#8E8E8F" ? "people-outline" : "people-sharp"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Settings}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome
              name={color === "#8E8E8F" ? "user-circle-o" : "user-circle-o"}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;

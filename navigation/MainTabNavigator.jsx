import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import NotImplementedScreen from "../screens/NotImplementedScreen";
import ChatScreen from "../screens/ChatScreen";
import { Ionicons, Entypo } from "@expo/vector-icons";

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
      }}
    >
      <Tab.Screen
        name="Chats"
        component={ChatScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="logo-whatsapp" size={size} color={color} />
          ),
          headerRight: () => (
            <Entypo
              name="new-message"
              size={18}
              color={"royalblue"}
              style={{ marginRight: 15 }}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Status"
        component={NotImplementedScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="ios-sync-circle-outline"
              size={size}
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
            <Ionicons name="camera-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Calls"
        component={NotImplementedScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="call-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={NotImplementedScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;

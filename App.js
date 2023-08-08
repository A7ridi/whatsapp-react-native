import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import ChatScreen from "./screens/ChatScreen";
import MessageScreen from "./screens/MessageScreen";

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {/* <ChatScreen /> */}
      <MessageScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "stretch",
    paddingVertical: 50,
  },
});

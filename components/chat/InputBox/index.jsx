import { View, TextInput, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const InputBox = () => {
  const [newMessage, setNewMessage] = useState("");
  const onSend = () => {
    if (!newMessage) return;
    console.log("Send a new message: ", newMessage);

    setNewMessage("");
  };
  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <AntDesign name="plus" size={24} color="royalblue" />
      <TextInput
        value={newMessage}
        onChangeText={setNewMessage}
        multiline
        placeholder="Type your message"
        style={styles.input}
      />
      <MaterialIcons
        style={styles.send(newMessage)}
        name="send"
        size={24}
        onPress={onSend}
        color="white"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "whitesmoke",
    padding: 5,
    alignItems: "center",
  },
  input: {
    fontSize: 18,
    flex: 1,
    backgroundColor: "white",
    padding: 5,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    borderRadius: 50,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "lightgray",
  },
  send: (newMessage) => ({
    backgroundColor: newMessage ? "royalblue" : "gray",
    padding: 7,
    borderRadius: 30,
    overflow: "hidden",
  }),
});

export default InputBox;

import { View, TextInput, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { API, Auth, graphqlOperation } from "aws-amplify";
import { createMessage, updateChatRoom } from "../../../src/graphql/mutations";

const InputBox = ({ chatVersion, chatRoomId }) => {
  const [newMessage, setNewMessage] = useState("");

  const onSend = async () => {
    if (!newMessage) return;

    const authUser = await Auth.currentAuthenticatedUser();

    const newMessagePayload = {
      text: newMessage.trim(),
      chatroomID: chatRoomId,
      userID: authUser.attributes.sub,
    };

    const sentMessage = await API.graphql(
      graphqlOperation(createMessage, { input: newMessagePayload })
    );

    setNewMessage("");

    // set the new message as the last message of the chatroom
    await API.graphql(
      graphqlOperation(updateChatRoom, {
        input: {
          _version: chatVersion._version,
          chatRoomLastMessageId: sentMessage.data.createMessage.id,
          id: chatRoomId,
        },
      })
    );
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
        onSubmitEditing={onSend}
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

import { StyleSheet, Text, View } from "react-native";
import { formatTime } from "../../../utils/helper";
import { Auth } from "aws-amplify";
import { useEffect, useState } from "react";

const Message = ({ message, lastMessage }) => {
  const [isMe, setIsMe] = useState(false);
  const isLastMessage = lastMessage?.id === message?.id;

  const isMyMessage = async () => {
    const authUser = await Auth.currentAuthenticatedUser();

    setIsMe(message.userID === authUser.attributes.sub);
  };

  useEffect(() => {
    isMyMessage();
  }, []);

  return (
    <View
      style={[
        styles.container(isLastMessage),
        {
          backgroundColor: isMe ? "#DCF8C5" : "white",
          alignSelf: isMe ? "flex-end" : "flex-start",
        },
      ]}
    >
      <Text>{message?.text}</Text>
      <Text style={styles.time}>{formatTime(message?.createdAt)}</Text>
    </View>
  );
};

export default Message;

const styles = StyleSheet.create({
  container: (isLastMessage) => ({
    marginHorizontal: 5,
    marginBottom: isLastMessage ? 15 : 5,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
    maxWidth: "80%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  }),
  message: {},
  time: {
    alignSelf: "flex-end",
    color: "grey",
    fontSize: 12,
  },
});

import { StyleSheet, Text, View } from "react-native";
import { formatTime } from "../../../utils/helper";

const Message = ({ message }) => {
  const isMyMessage = message.user.id === "u1";

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isMyMessage ? "#DCF8C5" : "white",
          alignSelf: isMyMessage ? "flex-end" : "flex-start",
        },
      ]}
    >
      <Text>{message.text}</Text>
      <Text style={styles.time}>{formatTime(message.createdAt)}</Text>
    </View>
  );
};

export default Message;

const styles = StyleSheet.create({
  container: {
    margin: 5,
    padding: 10,
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
  },
  message: {},
  time: {
    alignSelf: "flex-end",
    color: "grey",
    fontSize: 12,
  },
});

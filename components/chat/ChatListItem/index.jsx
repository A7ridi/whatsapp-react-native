import { StyleSheet, Image, Text, View } from "react-native";
import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const ChatListItem = ({ chat }) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: chat.user.image }} style={styles.image} />

      <View style={styles.content}>
        <View style={styles.row}>
          <Text numberOfLines={1} style={styles.name}>
            {chat.user.name}
          </Text>
          <Text style={styles.time}>
            {dayjs(chat.lastMessage.createdAt).fromNow()}
          </Text>
        </View>

        <Text numberOfLines={2} style={styles.subtitle}>
          {chat.lastMessage.text}
        </Text>
      </View>
    </View>
  );
};

export default ChatListItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginHorizontal: 10,
    marginVertical: 5,
    height: 70,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 13,
  },
  content: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
  },
  name: {
    flex: 1,
    fontWeight: "bold",
    fontSize: 16,
  },
  time: {
    color: "gray",
    fontSize: 12,
  },
  subtitle: {
    color: "gray",
  },
});

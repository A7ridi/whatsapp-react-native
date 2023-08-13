import { StyleSheet, Image, Text, View, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { formatDate, getNameFromEmail } from "../../../utils/helper";
import { useNavigation } from "@react-navigation/native";
import { onUpdateChatRoom } from "../../../src/graphql/subscriptions";
import { API, graphqlOperation } from "aws-amplify";

const ChatListItem = ({ chat, authUserId }) => {
  const [chatList, setChatList] = useState(chat);
  const navigation = useNavigation();

  useEffect(() => {
    // Subscribe to onUpdateChatRoom
    const subscription = API.graphql(
      graphqlOperation(onUpdateChatRoom, {
        filter: { id: { eq: chat.id } },
      })
    ).subscribe({
      next: ({ value }) => {
        setChatList((cr) => ({
          ...(cr || {}),
          LastMessage: value.data.onUpdateChatRoom.LastMessage,
        }));
      },
      error: (error) => console.warn(error),
    });

    // Stop receiving data updates from the subscription
    return () => subscription.unsubscribe();
  }, [chat.id]);

  const user = chatList.users.items;
  const filterChat = user.find(
    (singleUser) => singleUser?.user?.id !== authUserId
  );
  const filterUsers = filterChat?.user;

  return (
    <Pressable
      onPress={() =>
        navigation.navigate("Chat", {
          id: chatList.id,
          name: filterUsers?.name,
        })
      }
    >
      <View style={styles.container}>
        <Image
          source={
            filterUsers?.image
              ? { uri: filterUsers?.image }
              : require("../../../assets/images/dp.png")
          }
          style={styles.image}
        />

        <View style={styles.content}>
          <View style={styles.row}>
            <Text numberOfLines={1} style={styles.name}>
              {getNameFromEmail(filterUsers?.name)}
            </Text>
            <Text style={styles.time}>
              {formatDate(chatList.LastMessage?.createdAt)}
            </Text>
          </View>

          <Text numberOfLines={2} style={styles.subtitle}>
            {chatList.LastMessage?.text}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default ChatListItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginHorizontal: 14,
    // marginVertical: 5,
    height: 70,
  },
  image: {
    width: 50,
    height: 50,
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

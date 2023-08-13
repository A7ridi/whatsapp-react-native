import { StyleSheet, Text, View, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { formatDate, getNameFromEmail } from "../../../utils/helper";
import { useNavigation } from "@react-navigation/native";
import { onUpdateChatRoom } from "../../../src/graphql/subscriptions";
import { API, graphqlOperation } from "aws-amplify";
import ProfilePicture from "../../common/ProfilePicture";

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
  const chatNamme = chatList?.name || getNameFromEmail(filterUsers?.name);

  return (
    <Pressable
      onPress={() =>
        navigation.navigate("Chat", {
          id: chatList.id,
          name: chatList?.name || filterUsers?.name,
        })
      }
    >
      <View style={styles.container}>
        <ProfilePicture name={chatNamme} />

        <View style={styles.content}>
          <View style={styles.row}>
            <Text numberOfLines={1} style={styles.name}>
              {chatNamme}
              {chatList?.name && (
                <View style={styles.group}>
                  <Text style={styles.groupText}>G</Text>
                </View>
              )}
            </Text>
            <Text style={styles.time}>
              {formatDate(chatList.LastMessage?.createdAt)}
            </Text>
          </View>

          <Text numberOfLines={1} style={styles.subtitle}>
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
    height: 70,
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
  group: {
    backgroundColor: "royalblue",
    width: 20,
    height: 20,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 6,
  },
  groupText: {
    color: "white",
    fontSize: 13,
  },
});

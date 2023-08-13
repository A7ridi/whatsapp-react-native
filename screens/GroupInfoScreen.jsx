import { useEffect, useState } from "react";
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { API, graphqlOperation } from "aws-amplify";
import ContactListItem from "../components/ContactListItem";
import { onUpdateChatRoom } from "../src/graphql/subscriptions";
import { deleteUserChatRoom } from "../src/graphql/mutations";

const ChatRoomInfo = () => {
  const [chatRoom, setChatRoom] = useState(null);
  const [loading, setLoading] = useState(false);
  const route = useRoute();
  const navigation = useNavigation();

  const chatroomID = route.params.id;

  const fetchChatRooms = async () => {
    setLoading(true);
    try {
      const result = await API.graphql(
        graphqlOperation(getChatRoom, { id: chatroomID })
      );
      setChatRoom(result.data?.getChatRoom);
      setLoading(false);
    } catch (error) {
      console.log({ error });
      setLoading(false);
      setChatRoom([]);
    }
  };

  useEffect(() => {
    fetchChatRooms();

    // Subscribe to onUpdateChatRoom
    const subscription = API.graphql(
      graphqlOperation(onUpdateChatRoom, {
        filter: { id: { eq: chatroomID } },
      })
    ).subscribe({
      next: ({ value }) => {
        console.log({ value });
        setChatRoom((cr) => ({
          ...(cr || {}),
          LastMessage: value.data.onUpdateChatRoom.LastMessage,
        }));
      },
      error: (error) => console.warn(error),
    });

    // Stop receiving data updates from the subscription
    return () => subscription.unsubscribe();
  }, [chatroomID]);

  const removeUserFromGroup = async (chatRoom) => {
    await API.graphql(
      graphqlOperation(deleteUserChatRoom, {
        input: { id: chatRoom.id, _version: chatRoom._version },
      })
    );
  };

  const onContactPress = (userChatRoom) => {
    Alert.alert(
      "Removing from group",
      `Are you sure you want to remove ${userChatRoom.user.name} from this group?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => removeUserFromGroup(userChatRoom),
        },
      ]
    );
  };

  if (!chatRoom) {
    return <ActivityIndicator />;
  }

  const deletedUsers = chatRoom.users.items.filter((u) => !u._deleted);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{chatRoom?.name}</Text>

      <View style={styles.addUserContainer}>
        <Text style={styles.sectionTitle}>
          {deletedUsers.length} Participants
        </Text>

        <TouchableOpacity
          onPress={() => navigation.navigate("AddUserInGroup", { chatRoom })}
          style={styles.addUser}
        >
          <Text style={styles.adduserText}>Add User</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.section}>
        <FlatList
          data={deletedUsers}
          renderItem={({ item }) => (
            <ContactListItem
              user={item.user}
              clickable
              onPress={() => onContactPress(item)}
            />
          )}
          refreshing={loading}
          onRefresh={fetchChatRooms}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    padding: 10,
    flex: 1,
  },
  title: {
    fontWeight: "bold",
    fontSize: 30,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 18,
  },
  section: {
    borderRadius: 5,
    marginVertical: 10,
    marginLeft: -10,
  },
  addUserContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  addUser: {
    borderColor: "royalblue",
    borderWidth: 2,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  adduserText: { color: "royalblue", fontSize: 16 },
});

export const getChatRoom = /* GraphQL */ `
  query GetChatRoom($id: ID!) {
    getChatRoom(id: $id) {
      id
      name
      users {
        items {
          id
          user {
            id
            name
            status
            image
          }
          _version
          _deleted
        }
        nextToken
        startedAt
      }
    }
  }
`;

export default ChatRoomInfo;

import React, { useState, useEffect } from "react";
import {
  FlatList,
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import ContactListItem from "../components/ContactListItem";
import { API, Auth, graphqlOperation } from "aws-amplify";
import { useNavigation } from "@react-navigation/native";
import { listUsers } from "../src/graphql/queries";
import { createChatRoom, createUserChatRoom } from "../src/graphql/mutations";
import { filterAuthUser } from "../utils/helper";

const NewGroupScreen = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();

  useEffect(() => {
    API.graphql(graphqlOperation(listUsers))
      .then(async (users) => {
        const arr = await filterAuthUser(users?.data?.listUsers?.items);
        setUsers(arr);
        setLoading(false);
      })
      .catch((error) => {
        console.log({ error });
        setLoading(false);
      });
  }, []);

  const onCreateGroupPress = async () => {
    if (!name || selectedUserIds.length === 0) return;

    // Create a new Chatroom
    const newChatRoomData = await API.graphql(
      graphqlOperation(createChatRoom, { input: { name } })
    );
    if (!newChatRoomData.data?.createChatRoom) {
      console.log("Error creating the chat error");
    }
    const newChatRoom = newChatRoomData.data?.createChatRoom;

    // Add the clicked users to the ChatRoom
    await Promise.all(
      selectedUserIds.map((userId) =>
        API.graphql(
          graphqlOperation(createUserChatRoom, {
            input: { chatRoomId: newChatRoom.id, userId },
          })
        )
      )
    );

    // Add the auth user to the ChatRoom
    const authUser = await Auth.currentAuthenticatedUser();
    await API.graphql(
      graphqlOperation(createUserChatRoom, {
        input: { chatRoomId: newChatRoom.id, userId: authUser.attributes.sub },
      })
    );

    setSelectedUserIds([]);
    setName("");

    // navigate to the newly created ChatRoom
    navigation.navigate("Chat", {
      id: newChatRoom.id,
      name: newChatRoom?.name,
    });
  };

  const onContactPress = (id) => {
    setSelectedUserIds((userIds) =>
      userIds.includes(id)
        ? selectedUserIds.filter((uid) => uid !== id)
        : [...userIds, id]
    );
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={onCreateGroupPress}
          style={{
            backgroundColor:
              !name || selectedUserIds.length === 0 ? "gray" : "royalblue",
            paddingVertical: 5,
            paddingHorizontal: 10,
            borderRadius: 8,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontSize: 16 }}>Create</Text>
        </TouchableOpacity>
      ),
    });
  }, [name, selectedUserIds]);

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Group name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      {loading ? (
        <View style={{ backgroundColor: "whitesmoke" }}>
          <ActivityIndicator color="royalblue" size="large" />
        </View>
      ) : (
        <FlatList
          data={users}
          renderItem={({ item }) => (
            <ContactListItem
              user={item}
              selectable
              isSelected={selectedUserIds.includes(item.id)}
              onPress={() => onContactPress(item.id)}
            />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: "whitesmoke" },
  input: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "lightgray",
    padding: 10,
    margin: 10,
    fontSize: 16,
  },
});

export default NewGroupScreen;

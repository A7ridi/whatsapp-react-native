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
import { useNavigation, useRoute } from "@react-navigation/native";
import { listUsers } from "../src/graphql/queries";
import { createChatRoom, createUserChatRoom } from "../src/graphql/mutations";
import { filterAuthUser } from "../utils/helper";

const AddUserInGroup = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();
  const route = useRoute();
  const chatRoom = route.params.chatRoom;

  useEffect(() => {
    navigation.setOptions({ title: "Add User" });
  }, []);

  useEffect(() => {
    API.graphql(graphqlOperation(listUsers))
      .then(async (users) => {
        const arr = await filterAuthUser(users?.data?.listUsers?.items);
        // filtering users those are participants of this group
        const filteredUser = arr?.filter(
          (u) =>
            !chatRoom?.users?.items?.some(
              (chatUser) => chatUser?.user?.id === u?.id && !chatUser?._deleted
            )
        );

        setUsers(filteredUser);
        setLoading(false);
      })
      .catch((error) => {
        console.log({ error });
        setLoading(false);
      });
  }, []);

  const addInGroupHandler = async () => {
    if (selectedUserIds.length === 0) return;

    // Add the clicked users to the ChatRoom
    await Promise.all(
      selectedUserIds.map((userId) =>
        API.graphql(
          graphqlOperation(createUserChatRoom, {
            input: { chatRoomId: chatRoom.id, userId },
          })
        )
      )
    );

    setSelectedUserIds([]);

    // navigate to the newly created ChatRoom
    navigation.goBack();
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
          onPress={addInGroupHandler}
          style={{
            backgroundColor:
              selectedUserIds.length === 0 ? "gray" : "royalblue",
            paddingVertical: 5,
            paddingHorizontal: 10,
            borderRadius: 8,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontSize: 16 }}>Add</Text>
        </TouchableOpacity>
      ),
    });
  }, [selectedUserIds]);

  return (
    <View style={styles.container}>
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

export default AddUserInGroup;

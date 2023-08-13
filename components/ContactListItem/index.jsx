import { Text, StyleSheet, Pressable, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { API, Auth, graphqlOperation } from "aws-amplify";
import {
  createChatRoom,
  createUserChatRoom,
} from "../../src/graphql/mutations";
import { getExistingChatRoom } from "../../utils/chatRoomService";
import { getNameFromEmail } from "../../utils/helper";
import ProfilePicture from "../common/ProfilePicture";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { useEffect, useState } from "react";

const ContactListItem = ({
  user,
  selectable = false,
  isSelected = false,
  clickable = false,
  onPress = () => {},
}) => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUser = async () => {
      const authUser = await Auth.currentAuthenticatedUser();
      const authUserId = authUser.attributes.sub;
      setLoggedInUser(authUserId);
    };
    fetchUser();
  }, []);

  const onContactListPress = async () => {
    const existingChatRoom = await getExistingChatRoom(user.id, loggedInUser);

    if (existingChatRoom) {
      const id = existingChatRoom?.id || existingChatRoom.chatRoom.id;
      navigation.navigate("Chat", {
        id,
        name: existingChatRoom.chatRoom?.name,
      });
      return;
    } else {
      // create new chat room
      const newChatRoomData = await API.graphql(
        graphqlOperation(createChatRoom, { input: {} })
      );

      if (!newChatRoomData.data?.createChatRoom) {
        console.log("Chatroom not found");
      }

      const newChatRoom = newChatRoomData.data?.createChatRoom;

      // add the clicked user to the chat room
      await API.graphql(
        graphqlOperation(createUserChatRoom, {
          input: { chatRoomId: newChatRoom.id, userId: user.id },
        })
      );

      // add the auth user to the chat room
      await API.graphql(
        graphqlOperation(createUserChatRoom, {
          input: { chatRoomId: newChatRoom.id, userId: loggedInUser },
        })
      );

      // navigate to the chat screen
      navigation.navigate("Chat", {
        id: newChatRoom.id,
        name: newChatRoom?.name,
      });
    }
  };

  const status = user.status;

  return (
    <Pressable
      onPress={() =>
        selectable || clickable ? onPress() : onContactListPress()
      }
      style={styles.container(isSelected)}
    >
      {selectable && (
        <View style={styles.selectIcon}>
          {isSelected ? (
            <AntDesign name="checkcircle" size={24} color="royalblue" />
          ) : (
            <FontAwesome name="circle-thin" size={24} color="lightgray" />
          )}
        </View>
      )}

      <ProfilePicture name={getNameFromEmail(user.name)} />

      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {loggedInUser === user.id ? "Me" : getNameFromEmail(user.name)}
        </Text>

        <Text numberOfLines={1} style={styles.subTitle}>
          {selectable && status.length > 40
            ? status.substring(0, 35).trim() + "..."
            : status}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: (isSelected) => ({
    flexDirection: "row",
    marginHorizontal: 10,
    height: 70,
    alignItems: "center",
    backgroundColor: isSelected ? "#ccd9ff" : "whitesmoke",
    borderRadius: isSelected ? 10 : 0,
    marginVertical: isSelected ? 1 : 0,
  }),
  image: {
    width: 50,
    height: 50,
    borderRadius: 30,
    marginRight: 10,
  },
  name: {
    fontWeight: "bold",
  },
  subTitle: {
    color: "gray",
  },
  selectIcon: {
    marginRight: 5,
    marginLeft: 5,
  },
});

export default ContactListItem;

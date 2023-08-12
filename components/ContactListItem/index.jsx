import { Text, Image, StyleSheet, Pressable, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { API, Auth, graphqlOperation } from "aws-amplify";
import {
  createChatRoom,
  createUserChatRoom,
} from "../../src/graphql/mutations";
import { getExistingChatRoom } from "../../utils/chatRoomService";
import { getNameFromEmail } from "../../utils/helper";

const ContactListItem = ({ user }) => {
  const navigation = useNavigation();

  const onPress = async () => {
    const authUser = await Auth.currentAuthenticatedUser();
    const authUserId = authUser.attributes.sub;

    const existingChatRoom = await getExistingChatRoom(user.id, authUserId);

    if (existingChatRoom) {
      const id = existingChatRoom?.id || existingChatRoom.chatRoom.id;
      navigation.navigate("Chat", { id });
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
          input: { chatRoomId: newChatRoom.id, userId: authUserId },
        })
      );

      // navigate to the chat screen
      navigation.navigate("Chat", { id: newChatRoom.id });
    }
  };

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Image
        source={
          user.image
            ? { uri: user.image }
            : require("../../assets/images/dp.png")
        }
        style={styles.image}
      />

      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {getNameFromEmail(user.name)}
        </Text>

        <Text numberOfLines={1} style={styles.subTitle}>
          {user.status}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginHorizontal: 10,
    height: 70,
    alignItems: "center",
  },
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
});

export default ContactListItem;

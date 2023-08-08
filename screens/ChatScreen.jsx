import { FlatList, Pressable } from "react-native";
import ChatListItem from "../components/chat/ChatListItem";
import chatData from "../assets/data/chats.json";
import { useNavigation } from "@react-navigation/native";

const ChatScreen = () => {
  const navigation = useNavigation();
  return (
    <FlatList
      data={chatData}
      renderItem={({ item }) => (
        <Pressable
          onPress={() =>
            navigation.navigate("Chat", {
              id: item.id,
              name: item.user.name,
              image: item.user.image,
            })
          }
        >
          <ChatListItem chat={item} />
        </Pressable>
      )}
      style={{ paddingVertical: 10, backgroundColor: "whitesmkoe" }}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default ChatScreen;

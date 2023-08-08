import { FlatList } from "react-native";
import ChatListItem from "../components/chat/ChatListItem";
import chatData from "../assets/data/chats.json";

const ChatScreen = () => {
  return (
    <FlatList
      data={chatData}
      renderItem={({ item }) => <ChatListItem chat={item} />}
    />
  );
};

export default ChatScreen;

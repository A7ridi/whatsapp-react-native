import { FlatList } from "react-native";
import ChatListItem from "../components/chat/ChatListItem";
import { useEffect, useState } from "react";
import { API, Auth, graphqlOperation } from "aws-amplify";
import { listChatRooms } from "../src/graphql/queries/getUser";
import { sortMessageByDate } from "../utils/helper";

const ChatScreen = () => {
  const [chatData, setChatData] = useState([]);
  const [authUserId, setAuthUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchChatRooms();
  }, []);

  const fetchChatRooms = async () => {
    setIsLoading(true);
    const authUser = await Auth.currentAuthenticatedUser();
    const userId = authUser.attributes.sub;
    setAuthUserId(userId);

    const res = await API.graphql(
      graphqlOperation(listChatRooms, { id: userId })
    );

    const rooms = res.data.getUser?.ChatRooms?.items || [];
    const sortedRooms = sortMessageByDate(rooms);

    setIsLoading(false);
    setChatData(sortedRooms);
  };

  return (
    <FlatList
      data={chatData}
      renderItem={({ item }) => (
        <ChatListItem chat={item.chatRoom} authUserId={authUserId} />
      )}
      style={{ paddingVertical: 10, backgroundColor: "whitesmoke" }}
      showsVerticalScrollIndicator={false}
      onRefresh={fetchChatRooms}
      refreshing={isLoading}
    />
  );
};

export default ChatScreen;

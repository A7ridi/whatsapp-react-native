import { API, graphqlOperation } from "aws-amplify";
import { getUserFromChatRooms } from "../src/graphql/queries/getUser";

const getExistingChatRoom = async (userId, authUserId) => {
  const res = await API.graphql(
    graphqlOperation(getUserFromChatRooms, { id: authUserId })
  );

  const chatRooms = res.data.getUser?.ChatRooms?.items || [];

  const chatRoom = chatRooms.find((chatRoomItem) =>
    chatRoomItem.chatRoom.users.items.some(
      (singleUser) => singleUser.user.id === userId
    )
  );
  return chatRoom;
};

export { getExistingChatRoom };

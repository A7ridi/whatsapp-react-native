export const listChatRooms = /* GraphQL */ `
  query getChatRooms($id: ID!) {
    getUser(id: $id) {
      id
      ChatRooms {
        items {
          chatRoom {
            id
            updatedAt
            users {
              items {
                user {
                  id
                  image
                  name
                }
              }
            }
            LastMessage {
              id
              text
              createdAt
            }
          }
          id
        }
      }
    }
  }
`;

export const getUserFromChatRooms = /* GraphQL */ `
  query getChatRooms($id: ID!) {
    getUser(id: $id) {
      id
      ChatRooms {
        items {
          chatRoom {
            id
            users {
              items {
                user {
                  id
                }
              }
            }
          }
        }
      }
    }
  }
`;

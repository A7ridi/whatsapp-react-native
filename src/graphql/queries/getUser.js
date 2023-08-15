export const listChatRooms = /* GraphQL */ `
  query getChatRooms($id: ID!) {
    getUser(id: $id) {
      id
      ChatRooms {
        items {
          _deleted
          chatRoom {
            id
            name
            updatedAt
            users {
              items {
                user {
                  id
                  image
                  name
                  _deleted
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

export const optimizedListUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        status
        image
        _version
        _deleted
      }
    }
  }
`;

// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Attachment, ChatRoom, Message, User, UserChatRoom, AttachmentType } = initSchema(schema);

export {
  Attachment,
  ChatRoom,
  Message,
  User,
  UserChatRoom,
  AttachmentType
};
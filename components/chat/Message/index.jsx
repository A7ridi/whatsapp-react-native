import {
  StyleSheet,
  Text,
  View,
  Platform,
  useWindowDimensions,
} from "react-native";
import { formatTime, isImage } from "../../../utils/helper";
import { Auth, JS, Storage } from "aws-amplify";
import { useEffect, useState } from "react";
import ImageAttachments from "./ImageAttachment";
import VideoAttachments from "./VideoAttachment";

const Message = ({ message, lastMessage }) => {
  const [isMe, setIsMe] = useState(false);
  const [downloadAttachments, setDownloadedAttachments] = useState([]);
  const { width } = useWindowDimensions();

  const isLastMessage = lastMessage?.id === message?.id;

  const isMyMessage = async () => {
    const authUser = await Auth.currentAuthenticatedUser();

    setIsMe(message.userID === authUser.attributes.sub);
  };

  useEffect(() => {
    isMyMessage();
  }, []);

  useEffect(() => {
    const fetchAttachments = async () => {
      if (message?.Attachments?.items) {
        const downloadedAttachments = await Promise.all(
          message?.Attachments?.items?.map((attachment) =>
            Storage.get(attachment?.storageKey).then((uri) => ({
              ...attachment,
              uri,
            }))
          )
        );

        setDownloadedAttachments(downloadedAttachments);
      }
    };
    fetchAttachments();
  }, [JSON.stringify(message?.Attachments?.items)]);

  const imageContainerWidth = width * 0.8 - 30;

  const imageAttachments = downloadAttachments.filter((at) =>
    isImage(at.storageKey)
  );
  const videoAttachments = downloadAttachments.filter(
    (at) => !isImage(at.storageKey)
  );

  return (
    <View
      style={[
        styles.container(isLastMessage),
        {
          backgroundColor: isMe ? "#DCF8C5" : "white",
          alignSelf: isMe ? "flex-end" : "flex-start",
        },
      ]}
    >
      {downloadAttachments.length > 0 && (
        <View style={[{ width: imageContainerWidth }, styles.images]}>
          <ImageAttachments attachments={imageAttachments} />

          <VideoAttachments
            attachments={videoAttachments}
            width={imageContainerWidth}
          />
        </View>
      )}

      <Text style={styles.message}>{message?.text}</Text>
      <Text style={styles.time}>{formatTime(message?.createdAt)}</Text>
    </View>
  );
};

export default Message;

const styles = StyleSheet.create({
  container: (isLastMessage) => ({
    marginHorizontal: 5,
    marginBottom: isLastMessage ? 15 : 5,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
    maxWidth: "80%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  }),
  message: {
    fontSize: 16,
  },
  time: {
    alignSelf: "flex-end",
    color: "grey",
    fontSize: 12,
  },
});

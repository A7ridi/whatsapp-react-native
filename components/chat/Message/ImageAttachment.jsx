import { Pressable, Image, StyleSheet } from "react-native";
import { useState } from "react";

const ImageAttachments = ({ attachments }) => {
  const [imageViewerVisible, setImageViewerVisible] = useState(false);

  return (
    <>
      {attachments.map((attachment) => (
        <Pressable
          key={attachment.id}
          style={[
            styles.imageContainer,
            attachments.length === 1 && { flex: 1 },
          ]}
          onPress={() => setImageViewerVisible(true)}
        >
          <Image source={{ uri: attachment.uri }} style={styles.image} />
        </Pressable>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  images: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  imageContainer: {
    width: "50%",
    aspectRatio: 1,
    padding: 3,
  },
  image: {
    flex: 1,
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 5,
  },
  attachmentsContainer: {
    alignItems: "flex-end",
  },
});

export default ImageAttachments;

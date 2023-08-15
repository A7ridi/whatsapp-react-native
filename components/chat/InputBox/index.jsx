import {
  View,
  TextInput,
  StyleSheet,
  Image,
  FlatList,
  Text,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { API, Auth, Storage, graphqlOperation } from "aws-amplify";
import {
  createAttachment,
  createMessage,
  updateChatRoom,
} from "../../../src/graphql/mutations";
import * as ImagePicker from "expo-image-picker";
import { generateUUID } from "../../../utils/helper";

const InputBox = ({ chatVersion, chatRoomId }) => {
  const [newMessage, setNewMessage] = useState("");
  const [files, setFiles] = useState([]);
  const [progresses, setProgresses] = useState(0);

  const verifySendButton = newMessage.length === 0 && files.length === 0;

  const addAttachment = async (file, messageID) => {
    const types = {
      image: "IMAGE",
      video: "VIDEO",
    };

    const newAttachment = {
      storageKey: await uploadFile(file.uri),
      type: types[file.type],
      width: file.width,
      height: file.height,
      duration: file.duration,
      messageID,
      chatroomID: chatRoomId,
    };
    return API.graphql(
      graphqlOperation(createAttachment, { input: newAttachment })
    );
  };

  const onSend = async () => {
    if (verifySendButton) return;

    const authUser = await Auth.currentAuthenticatedUser();

    const newMessagePayload = {
      text: newMessage.trim(),
      chatroomID: chatRoomId,
      userID: authUser.attributes.sub,
    };

    const sentMessage = await API.graphql(
      graphqlOperation(createMessage, { input: newMessagePayload })
    );

    setNewMessage("");

    // create attachments
    if (files?.length > 0) {
      await Promise.all(
        files.map((file) =>
          addAttachment(file, sentMessage.data.createMessage.id)
        )
      );
    }
    setFiles([]);

    // set the new message as the last message of the chatroom
    await API.graphql(
      graphqlOperation(updateChatRoom, {
        input: {
          _version: chatVersion._version,
          chatRoomLastMessageId: sentMessage.data.createMessage.id,
          id: chatRoomId,
        },
      })
    );
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
      allowsMultipleSelection: true,
    });

    if (!result.canceled) {
      if (result.selected) {
        setFiles(result.selected);
      } else {
        setFiles([result]);
      }
    }
  };

  const uploadFile = async (fileUri) => {
    try {
      const response = await fetch(fileUri);
      const blob = await response.blob();
      const generatedUUID = generateUUID();
      const key = `${generatedUUID}.png`;

      await Storage.put(key, blob, {
        contentType: "image/png", // contentType is optional
        progressCallback: (progress) => {
          setProgresses(progress.loaded / progress.total);
        },
      });
      return key;
    } catch (err) {
      console.log("Error uploading file:", err);
    }
  };

  return (
    <>
      {files?.length > 0 && (
        <View style={styles.attachmentsContainer}>
          <FlatList
            data={files}
            horizontal
            renderItem={({ item }) => (
              <>
                <Image
                  source={{ uri: item?.uri }}
                  style={styles.selectedImage}
                  resizeMode="contain"
                />

                <View style={styles.progressBar}>
                  <Text style={{ color: "white", fontWeight: "bold" }}>
                    {progresses * 100} %
                  </Text>
                </View>

                <MaterialIcons
                  name="highlight-remove"
                  onPress={() =>
                    setFiles((existingFiles) =>
                      existingFiles.filter((file) => file !== item)
                    )
                  }
                  size={20}
                  color="gray"
                  style={styles.removeSelectedImage}
                />
              </>
            )}
          />
        </View>
      )}

      <SafeAreaView edges={["bottom"]} style={styles.container}>
        <Ionicons
          name="image"
          size={24}
          color="royalblue"
          onPress={() => {}}
          style={styles.pickIcon}
        />
        <TextInput
          value={newMessage}
          onChangeText={setNewMessage}
          multiline
          placeholder="Type your message"
          style={styles.input}
          onSubmitEditing={onSend}
        />
        <MaterialIcons
          style={styles.send(verifySendButton)}
          name="send"
          size={24}
          onPress={onSend}
          color="white"
        />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "whitesmoke",
    padding: 5,
    alignItems: "center",
  },
  input: {
    fontSize: 18,
    flex: 1,
    backgroundColor: "white",
    padding: 5,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    borderRadius: 50,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "lightgray",
  },
  send: (verifySendButton) => ({
    backgroundColor: !verifySendButton ? "royalblue" : "gray",
    padding: 7,
    borderRadius: 30,
    overflow: "hidden",
  }),
  pickIcon: {
    position: "absolute",
    zIndex: 1111,
    right: 70,
  },
  attachmentsContainer: {
    alignItems: "flex-end",
  },
  selectedImage: {
    height: 100,
    width: 200,
    margin: 5,
  },
  removeSelectedImage: {
    position: "absolute",
    right: 10,
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
  },
  progressBar: {
    position: "absolute",
    top: "50%",
    left: "50%",
    backgroundColor: "#8c8c8cAA",
    padding: 5,
    borderRadius: 50,
  },
});

export default InputBox;

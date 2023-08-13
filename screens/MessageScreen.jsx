import {
  ImageBackground,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  View,
  ActivityIndicator,
} from "react-native";
import bg from "../assets/images/BG.png";
import Message from "../components/chat/Message";
import InputBox from "../components/chat/InputBox";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { getChatRoom, listMessagesByChatRoom } from "../src/graphql/queries";
import {
  onCreateMessage,
  onUpdateChatRoom,
} from "../src/graphql/subscriptions";
import { Entypo } from "@expo/vector-icons";

const MessageScreen = () => {
  const [chatRoom, setChatRoom] = useState(null);
  const [chatVersion, setChatVersion] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const chatRoomId = route.params.id;
  const flatListRef = useRef(null);

  const scrollToBottom = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: false });
    }
  };

  useEffect(() => {
    // Scroll to the end of the list when the component mounts
    scrollToBottom();
  }, []);

  useEffect(() => {
    API.graphql(graphqlOperation(getChatRoom, { id: chatRoomId })).then(
      (res) => {
        setChatVersion(res.data?.getChatRoom);
      }
    );

    // Subscribe to onUpdateChatRoom
    const subscription = API.graphql(
      graphqlOperation(onUpdateChatRoom, {
        filter: { id: { eq: chatRoomId } },
      })
    ).subscribe({
      next: ({ value }) => {
        setChatVersion((cr) => ({
          ...(cr || {}),
          ...value.data.onUpdateChatRoom,
        }));
      },
      error: (error) => console.warn(error),
    });

    // Stop receiving data updates from the subscription
    return () => subscription.unsubscribe();
  }, [chatRoomId]);

  useEffect(() => {
    API.graphql(
      graphqlOperation(listMessagesByChatRoom, {
        chatroomID: chatRoomId,
        sortDirection: "ASC",
      })
    )
      .then((res) => {
        setChatRoom(res.data?.listMessagesByChatRoom?.items);
      })
      .catch((err) => {
        console.log({ err });
        setChatRoom([]);
      });

    // Subscribe to creation of Messages
    const subscription = API.graphql(
      graphqlOperation(onCreateMessage, {
        filter: { chatroomID: { eq: chatRoomId } },
      })
    ).subscribe({
      next: ({ value }) => {
        setChatRoom((m) => [...m, value.data.onCreateMessage]);
      },
      error: (error) => console.warn(error),
    });

    // Stop receiving data updates from the subscription
    return () => subscription.unsubscribe();
  }, [chatRoomId]);

  useEffect(() => {
    navigation.setOptions({
      title: route.params.name,
      headerRight: () => (
        <Entypo
          name="info-with-circle"
          size={24}
          color="royalblue"
          onPress={() => navigation.navigate("Group Info", { id: chatRoomId })}
        />
      ),
    });
  }, [route.params]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : ""}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 90}
      style={styles.bg}
    >
      <ImageBackground source={bg} style={styles.bg}>
        {!chatRoom ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="royalblue" />
          </View>
        ) : (
          <FlatList
            data={chatRoom}
            renderItem={({ item }) => (
              <Message
                message={item}
                lastMessage={chatRoom[chatRoom?.length - 1]}
              />
            )}
            style={{ padding: 10 }}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            ref={flatListRef}
            onContentSizeChange={scrollToBottom}
            onLayout={scrollToBottom}
          />
        )}

        <View style={styles.inputContainer}>
          <InputBox chatVersion={chatVersion} chatRoomId={chatRoomId} />
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

export default MessageScreen;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
  },
  bg: {
    flex: 1,
  },
  inputContainer: {
    marginTop: 5,
  },
});

import {
  ImageBackground,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  View,
} from "react-native";
import bg from "../assets/images/BG.png";
import messages from "../assets/data/messages.json";
import Message from "../components/chat/Message";
import { sortMessageByDate } from "../utils/helper";
import InputBox from "../components/chat/InputBox";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useEffect } from "react";

const MessageScreen = () => {
  const sortedMessage = sortMessageByDate(messages);
  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    navigation.setOptions({ title: route.params.name });
  }, [route.params]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : ""}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 90}
      style={styles.bg}
    >
      <ImageBackground source={bg} style={styles.bg}>
        <FlatList
          data={sortedMessage}
          renderItem={({ item }) => (
            <Message
              message={item}
              lastMessage={sortedMessage[sortedMessage.length - 1]}
            />
          )}
          style={{ padding: 10 }}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.inputContainer}>
          <InputBox />
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

export default MessageScreen;

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  inputContainer: {
    marginTop: 5,
  },
});

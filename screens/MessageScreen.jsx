import { ImageBackground, StyleSheet, FlatList } from "react-native";
import bg from "../assets/images/BG.png";
import messages from "../assets/data/messages.json";
import Message from "../components/chat/Message";
import { sortMessageByDate } from "../utils/helper";

const MessageScreen = () => {
  const sortedMessage = sortMessageByDate(messages);

  return (
    <ImageBackground source={bg} style={styles.bg}>
      <FlatList
        data={sortedMessage}
        renderItem={({ item }) => <Message message={item} />}
        style={{ padding: 10 }}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      />
    </ImageBackground>
  );
};

export default MessageScreen;

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    paddingBottom: 4,
  },
});

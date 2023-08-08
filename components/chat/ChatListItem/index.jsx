import { StyleSheet, Image, Text, View } from "react-native";
import React from "react";
import { dummyImages } from "../../../utils/constants";

const ChatListItem = () => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: dummyImages[0] }} style={styles.image} />

      <View style={styles.content}>
        <View style={styles.row}>
          <Text numberOfLines={1} style={styles.name}>
            Lukas
          </Text>
          <Text style={styles.subtitle}>8:30 pm</Text>
        </View>

        <Text numberOfLines={2} style={styles.subtitle}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum et
          itaque sit beatae atque laboriosam ut labore. Iusto, sapiente
          voluptatum.
        </Text>
      </View>
    </View>
  );
};

export default ChatListItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginHorizontal: 10,
    marginVertical: 5,
    height: 70,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 13,
  },
  content: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
  },
  name: {
    flex: 1,
    fontWeight: "bold",
  },
  subtitle: {
    color: "gray",
  },
});

import { StyleSheet, Text, View } from "react-native";
import { getInitials, getRandomColor } from "../../utils/helper";
import { memo } from "react";

const ProfilePicture = ({ name, size = 45 }) => {
  const initials = getInitials(name);
  const backgroundColor = getRandomColor();

  return (
    <View style={styles.container(backgroundColor, size)}>
      <Text style={styles.textStyle(size)}>{initials}</Text>
    </View>
  );
};

export default memo(ProfilePicture);

const styles = StyleSheet.create({
  container: (backgroundColor, size) => ({
    width: size,
    height: size,
    borderRadius: 50,
    backgroundColor,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  }),
  textStyle: (size) => ({
    fontSize: size / 3,
    color: "white",
    fontWeight: "600",
  }),
});

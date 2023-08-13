import { StyleSheet, Text, View } from "react-native";
import { getInitials, getRandomColor } from "../../utils/helper";
import { memo } from "react";

const ProfilePicture = ({ name }) => {
  const initials = getInitials(name);
  const backgroundColor = getRandomColor();

  return (
    <View style={styles.container(backgroundColor)}>
      <Text style={styles.textStyle}>{initials}</Text>
    </View>
  );
};

export default memo(ProfilePicture);

const styles = StyleSheet.create({
  container: (backgroundColor) => ({
    width: 45,
    height: 45,
    borderRadius: 50,
    backgroundColor,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  }),
  textStyle: {
    fontSize: 16,
    color: "white",
    fontWeight: "600",
  },
});

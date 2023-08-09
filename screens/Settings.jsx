import { StyleSheet, Text, View, Button } from "react-native";
import { useEffect, useState } from "react";
import { Auth } from "aws-amplify";

const Settings = () => {
  const [user, setUser] = useState(null);

  const getUser = async () => {
    const authUser = await Auth.currentAuthenticatedUser({ bypassCache: true });
    setUser(authUser);
  };

  useEffect(() => {
    getUser();
  }, []);

  const logout = async () => {
    await Auth.signOut();
  };
  return (
    <View style={styles.container}>
      <Text>{user?.Session}</Text>
      <Button
        styles={styles.button}
        color="#007AFF"
        onPress={logout}
        title="Logout"
      />
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    // alignItems: "center",
    // justifyContent: "center",
  },
});

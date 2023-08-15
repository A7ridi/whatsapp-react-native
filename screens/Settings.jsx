import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import { Auth } from "aws-amplify";
import ProfilePicture from "../components/common/ProfilePicture";
import { AntDesign } from "@expo/vector-icons";

const Settings = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const getUser = async () => {
    const authUser = await Auth.currentAuthenticatedUser();
    setUser(authUser.attributes);
  };

  useEffect(() => {
    getUser();
  }, []);

  const logout = async () => {
    setLoading(true);
    await Auth.signOut();
    setLoading(false);
  };

  const logoutHandler = () => {
    Alert.alert("Logout", `Are you sure you want to logout?`, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => logout(),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator />
        </View>
      ) : (
        <View>
          <View style={styles.profileView}>
            <ProfilePicture name={user?.email} size={100} text={30} />

            <Text style={styles.email} numberOfLines={2}>
              {user?.email}
            </Text>
          </View>

          <TouchableOpacity
            onPress={logoutHandler}
            style={styles.buttonContainer}
          >
            <AntDesign name="logout" size={20} color="#C41E3A" />
            <Text style={styles.logoutButton}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginVertical: 30,
  },
  profileView: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  email: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#C41E3A",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  logoutButton: {
    color: "#C41E3A",
    fontSize: 16,
    marginLeft: 10,
  },
  loader: {
    marginTop: 40,
  },
});

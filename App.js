import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Navigator from "./navigation";
import { NavigationContainer } from "@react-navigation/native";
import { API, Amplify, Auth, graphqlOperation } from "aws-amplify";
import awsconfig from "./src/aws-exports";
import { withAuthenticator } from "aws-amplify-react-native";
import { useEffect } from "react";
import { createUser } from "./src/graphql/mutations";
import { checkUser } from "./src/graphql/queries/checkUser";

Amplify.configure({ ...awsconfig, Analytics: { disabled: true } });

const App = () => {
  useEffect(() => {
    const syncUser = async () => {
      // get auth user
      const authUser = await Auth.currentAuthenticatedUser({
        bypassCache: true,
      });

      // get userdata using user id
      const userData = await API.graphql(
        graphqlOperation(checkUser, { id: authUser.attributes.sub })
      );

      if (userData?.data?.getUser) {
        return;
      } else {
        // create new user if user don't exist
        const newUser = {
          id: authUser.attributes.sub,
          name: authUser.attributes.email,
          image: "",
          status: "Hey there, I'm using Whatsapp!",
        };

        await API.graphql(graphqlOperation(createUser, { input: newUser }));
      }
    };

    syncUser();
  }, []);
  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Navigator />
      </NavigationContainer>
      <StatusBar style="auto" />
    </View>
  );
};

export default withAuthenticator(App);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "whitesmoke",
    justifyContent: "center",
    alignItems: "stretch",
  },
});

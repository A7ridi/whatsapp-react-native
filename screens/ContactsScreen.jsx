import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import ContactListItem from "../components/ContactListItem";
import { API, graphqlOperation } from "aws-amplify";
import { listUsers } from "../src/graphql/queries";
import { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { filterAuthUser } from "../utils/helper";

const ContactsScreen = () => {
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    API.graphql(graphqlOperation(listUsers))
      .then(async (users) => {
        const arr = await filterAuthUser(users?.data?.listUsers?.items);
        setUsers(arr);
        setLoading(false);
      })
      .catch((error) => {
        console.log({ error });
        setLoading(false);
      });
  }, []);

  return (
    <View>
      {loading ? (
        <View style={{ marginTop: 60 }}>
          <ActivityIndicator color="royalblue" size="large" />
        </View>
      ) : (
        <FlatList
          data={users}
          renderItem={({ item }) => <ContactListItem user={item} />}
          style={{ backgroundColor: "whitesmoke", paddingHorizontal: 12 }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={() => (
            <Pressable
              onPress={() => navigation.navigate("New Group")}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 15,
                paddingHorizontal: 10,
              }}
            >
              <MaterialIcons
                name="group"
                size={30}
                color="royalblue"
                style={{
                  marginRight: 20,
                  backgroundColor: "#ccd9ff",
                  padding: 7,
                  borderRadius: 30,
                  overflow: "hidden",
                }}
              />
              <Text
                style={{ color: "royalblue", fontSize: 16, fontWeight: "600" }}
              >
                New Group
              </Text>
            </Pressable>
          )}
        />
      )}
    </View>
  );
};

export default ContactsScreen;

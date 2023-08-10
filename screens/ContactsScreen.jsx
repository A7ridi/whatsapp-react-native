import { ActivityIndicator, FlatList, View } from "react-native";
import ContactListItem from "../components/ContactListItem";
import { API, graphqlOperation } from "aws-amplify";
import { listUsers } from "../src/graphql/queries";
import { useEffect, useState } from "react";

const ContactsScreen = () => {
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.graphql(graphqlOperation(listUsers))
      .then((users) => {
        setUsers(users?.data?.listUsers?.items);
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
          style={{ backgroundColor: "white", paddingHorizontal: 12 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default ContactsScreen;

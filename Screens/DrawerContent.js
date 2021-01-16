import React from "react";
import { StyleSheet, View, Button, Image } from "react-native";
import { Drawer, Text, Divider, Subheading, TouchableRipple, Switch, useTheme, List, } from "react-native-paper";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { AuthContext } from "../Components/Context";
import AsyncStorage from "@react-native-community/async-storage";

function DrawerContent(props) {
  const { signOut, userName } = React.useContext(AuthContext);
  const { toggleTheme } = React.useContext(AuthContext);
  const paperTheme = useTheme();
  const [user, setUser] = React.useState("");

  userName().then((data) => {
    setUser(data);
  });

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View
          style={{
            padding: 10,
            flexDirection: "row",
            alignItems: "baseline",
            justifyContent: "space-around",
          }}
        >
          <Image source={require("../assets/default.png")} style={{ width: "100%", height: 150 }} />
        </View>
        <Subheading style={{ marginLeft: "5%" }}>Welcome, {user}</Subheading>
        <Drawer.Section title="Menu">
          <Drawer.Item
            icon="home"
            label="Dashboard"
            onPress={() => {
              props.navigation.navigate("Dashboard");
            }}
          />
          <Divider />
          <Drawer.Item
            icon="map-marker-radius"
            label="Track Order"
            onPress={() => {
              props.navigation.navigate("ordertracking");
            }}
          />

          <Divider />
          <Drawer.Item
            icon="content-paste"
            label="Reports"
            onPress={() => {
              props.navigation.navigate("Reports");
            }}
          />
          <Divider />
          <Drawer.Item
            icon="alpha-m-box"
            label="Masters"
            onPress={() => {
              props.navigation.navigate("Masters");
            }}
          />
          <Divider />
          <Drawer.Item
            icon="cash-multiple"
            label="Payment"
            onPress={() => {
              props.navigation.navigate("paymentlist");
            }}
          />
        </Drawer.Section>
      </DrawerContentScrollView>
      <Drawer.Section title="Version  1.0.0">
        <Divider />
        <Drawer.Item
          icon="exit-to-app"
          label="Log Out"
          onPress={() => {
            signOut();
          }}
        />
      </Drawer.Section>
    </View>
  );
}

export default DrawerContent;

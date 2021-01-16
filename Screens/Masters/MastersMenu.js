import React, { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet, ScrollView } from "react-native";
import { Card } from "react-native-paper";

export default function Masters(props) {
  return (
    <ScrollView style={{ paddingTop: 10 }}>
      <Card
        style={styles.card}
        onPress={() => {
          props.navigation.navigate("userlist");
        }}
      >
        <Card.Title title="User Master" />
      </Card>
      <Card
        style={styles.card}
        onPress={() => {
          props.navigation.navigate("brokerlist");
        }}
      >
        <Card.Title title="Broker Master" />
      </Card>
      <Card
        style={styles.card}
        onPress={() => {
          props.navigation.navigate("companylist");
        }}
      >
        <Card.Title title="Company Master" />
      </Card>
      <Card
        style={styles.card}
        onPress={() => {
          props.navigation.navigate("contactlist");
        }}
      >
        <Card.Title title="Contact Master" />
      </Card>
      <Card
        style={styles.card}
        onPress={() => {
          props.navigation.navigate("discountfarelist");
        }}
      >
        <Card.Title title="Discount Fare Master" />
      </Card>
      <Card
        style={styles.card}
        onPress={() => {
          props.navigation.navigate("partylist");
        }}
      >
        <Card.Title title="Party Master" />
      </Card>
      <Card
        style={styles.card}
        onPress={() => {
          props.navigation.navigate("productlist");
        }}
      >
        <Card.Title title="Product Master" />
      </Card>
      <Card
        style={styles.card}
        onPress={() => {
          props.navigation.navigate("fabriclist");
        }}
      >
        <Card.Title title="Fabric Master" />
      </Card>
      <Card
        style={styles.card}
        onPress={() => {
          props.navigation.navigate("factorystorelist");
        }}
      >
        <Card.Title title="Factory Store Master" />
      </Card>
      <Card
        style={styles.card}
        onPress={() => {
          props.navigation.navigate("gandhingrlist");
        }}
      >
        <Card.Title title="Gandhi Ngr Master" />
      </Card>
      <Card
        style={styles.card}
        onPress={() => {
          props.navigation.navigate("sizemaster");
        }}
      >
        <Card.Title title="Size Master" />
      </Card>
      <Card
        style={styles.card}
        onPress={() => {
          props.navigation.navigate("colormaster");
        }}
      >
        <Card.Title title="Color Master" />
      </Card>
      <Card
        style={styles.card}
        onPress={() => {
          props.navigation.navigate("itemdetailsmaster");
        }}
      >
        <Card.Title title="Item Details Master" />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 60,
    borderRadius: 15,
    borderColor: "black",
    marginBottom: 5,
    paddingLeft: "10%",
    backgroundColor: "#f9f9f9",
  },
});

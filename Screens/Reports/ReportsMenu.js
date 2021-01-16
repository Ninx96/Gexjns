import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  ActivityIndicator,
  Dimensions,
  TouchableHighlight,
  Image,
} from "react-native";
import { Card, Title, Paragraph, List, Divider, Avatar, Button } from "react-native-paper";

export default function Reports(props) {
  return (
    <ScrollView style={{ paddingTop: 10 }}>
      <Card
        style={styles.card}
        onPress={() => {
          props.navigation.navigate("tally");
        }}
      >
        <Card.Title title="Tally Report" />
      </Card>
      <Card
        style={styles.card}
        onPress={() => {
          props.navigation.navigate("dc");
        }}
      >
        <Card.Title title="DC Report" />
      </Card>
      <Card
        style={styles.card}
        onPress={() => {
          props.navigation.navigate("gaddi");
        }}
      >
        <Card.Title title="Gaddi Report" />
      </Card>
      <Card
        style={styles.card}
        onPress={() => {
          props.navigation.navigate("gr");
        }}
      >
        <Card.Title title="GR Report" />
      </Card>
      <Card
        style={styles.card}
        onPress={() => {
          props.navigation.navigate("sales");
        }}
      >
        <Card.Title title="Sales Report" />
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

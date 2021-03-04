import React from "react";
import { Chip } from "react-native-paper";
import { ScrollView, StyleSheet, View } from "react-native";

export default function ProductionHeader({ navigation, route, index }) {
  const [indexSelected, setIndexSelected] = React.useState(index);
  return (
    <ScrollView horizontal={true} style={{ marginVertical: 5, maxHeight: 35 }}>
      <Chip
        mode="outlined"
        style={styles.chips}
        selected={indexSelected == 1}
        onPress={() => navigation.navigate("FabricStock")}
      >
        Fabric Stock
      </Chip>
      <Chip
        mode="outlined"
        style={styles.chips}
        selected={indexSelected == 2}
        onPress={() => navigation.navigate("CuttingMaster")}
      >
        Cutting Master
      </Chip>
      <Chip
        mode="outlined"
        style={styles.chips}
        selected={indexSelected == 3}
        onPress={() => navigation.navigate("Godown")}
      >
        Godown
      </Chip>
      <Chip
        mode="outlined"
        style={styles.chips}
        selected={indexSelected == 4}
        onPress={() => navigation.navigate("Fabrication")}
      >
        Fabrication
      </Chip>
      <Chip
        mode="outlined"
        style={styles.chips}
        selected={indexSelected == 5}
        onPress={() => navigation.navigate("KajButton")}
      >
        Kaj Button
      </Chip>
      <Chip
        mode="outlined"
        style={styles.chips}
        selected={indexSelected == 6}
        onPress={() => navigation.navigate("Washing")}
      >
        Washing
      </Chip>
      <Chip
        mode="outlined"
        style={styles.chips}
        selected={indexSelected == 7}
        onPress={() => navigation.navigate("DhagaCutting")}
      >
        Dhaga Cutting
      </Chip>
      <Chip
        mode="outlined"
        style={styles.chips}
        selected={indexSelected == 8}
        onPress={() => navigation.navigate("Packaging")}
      >
        Packaging
      </Chip>
      <Chip
        mode="outlined"
        style={styles.chips}
        selected={indexSelected == 9}
        onPress={() => navigation.navigate("Assortment")}
      >
        Assortment
      </Chip>
      <Chip
        mode="outlined"
        style={styles.chips}
        selected={indexSelected == 10}
        onPress={() => navigation.navigate("FactoryStore")}
      >
        Factory Store
      </Chip>
      <Chip
        mode="outlined"
        style={styles.chips}
        selected={indexSelected == 11}
        onPress={() => navigation.navigate("GandhiNagar")}
      >
        GandhiNagar
      </Chip>
      <Chip
        mode="outlined"
        style={styles.chips}
        selected={indexSelected == 12}
        onPress={() => navigation.navigate("Shop")}
      >
        Shop
      </Chip>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  chips: {
    height: 35,
    marginHorizontal: 2,
  },
});

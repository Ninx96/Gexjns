import React from "react";
import { Text, TextInput, FAB, Searchbar, Button, TouchableRipple } from "react-native-paper";
import { View, ScrollView, StyleSheet, Alert, FlatList } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Table, Row } from "react-native-table-component";
import { AuthContext } from "../../Components/Context";
import { postData } from "../../_Services/Api_Service";
import DatePicker from "react-native-datepicker";
import { Picker } from "@react-native-picker/picker";
import SearchableDropdown from "react-native-searchable-dropdown";
import Spinner from "react-native-loading-spinner-overlay";
import font from "../../fonts.js";

export default function FabricStock({ navigation }) {
  const { userId } = React.useContext(AuthContext);

  const [gridData, setGrid] = React.useState([]);
  const [isloading, setloading] = React.useState(true);
  const [param, setParam] = React.useState({
    user_id: "",
    search: "",
    skip: 0,
    from_date: "",
    to_date: "",
  });

  const type = "";

  const Grid = [];

  const widthArr = [50, 100, 100, 100, 80, 100, 100, 100, 100, 100, 100];

  const Refresh = () => {
    setloading(true);
    postData("Production/BrowseProductionFabricStock", param).then((data) => {
      if (data.length === 0) {
        setLoadBtn(false);
      }
      //console.log(data);
      setGrid(data);
      setloading(false);
    });
  };

  React.useEffect(() => {
    userId().then((data) => {
      param.user_id = data;
      postData("StockDashboard/PreviewDateFilter", param).then((data) => {
        //console.log(data);
        param.from_date = data.from_date;
        param.to_date = data.to_date;
      });
    });
    navigation.addListener("focus", () => {
      setTimeout(() => {
        Refresh();
      }, 1000);
    });
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        <Searchbar style={{ flex: 10 }} placeholder="Search" onChangeText={(text) => {}} />
        <View>
          <ScrollView horizontal={true}>
            <View>
              <Table borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}>
                <Row
                  data={[
                    "S No.",
                    "Date",
                    "Supplier",
                    "Roll No.",
                    "Qty",
                    "Action",
                    "Fabric Cat.",
                    "Short No.",
                    "Fabric Name",
                    "Color",
                    "Description",
                  ]}
                  style={styles.head}
                  textStyle={styles.text}
                  widthArr={widthArr}
                />
              </Table>
              <ScrollView>
                <Table borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}>
                  {Grid.map((item, index) => {
                    return (
                      <Row
                        key={index}
                        data={[
                          index + 1,
                          item.barcode,
                          item.qty,
                          item.rate,
                          item.description,
                          item.hsn,
                          Taxes(item, index),
                          item.amount,
                          item.total,
                          <FontAwesome name="times" size={30} color="red" onPress={() => {}} />,
                        ]}
                        style={styles.row}
                        textStyle={styles.text}
                        widthArr={widthArr}
                      />
                    );
                  })}
                </Table>
              </ScrollView>
            </View>
          </ScrollView>
        </View>
        <View>
          <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginVertical: 5 }}>
            <TextInput
              style={{ width: "20%", height: 45 }}
              mode="outlined"
              label={"Cutting"}
              editable={false}
              value={"Cutting"}
            ></TextInput>

            <View
              style={{
                borderWidth: 0.6,
                //borderColor: "#A9A9A9",
                borderColor: "black",
                borderRadius: 5,
                marginTop: 8,
                height: 45,
                width: "20%",
                backgroundColor: "white",
              }}
            >
              <Picker
                selectedValue={type}
                style={{ height: 45, width: "100%" }}
                onValueChange={(itemValue, itemIndex) => {}}
              >
                <Picker.Item label="- - -Select Type- - -" value="" />
                <Picker.Item label="Online Sales User" value="Sales" />
                <Picker.Item label="Distributor" value="Distributor" />
                <Picker.Item label="Retailor" value="Retailor" />
                <Picker.Item label="Admin" value="Admin" />
              </Picker>
            </View>

            <DatePicker
              style={{ width: "20%", marginTop: 10, marginBottom: 4 }}
              date={new Date()}
              mode="date"
              showIcon={false}
              placeholder="Issue Date"
              format="DD/MM/YYYY"
              onDateChange={(date) => {}}
              customStyles={{
                dateInput: {
                  borderRadius: 5,
                  alignItems: "flex-start",
                  height: 45,
                  padding: 14,
                },
              }}
            />
            <DatePicker
              style={{ width: "20%", marginTop: 10, marginBottom: 4 }}
              date={new Date()}
              mode="date"
              showIcon={false}
              placeholder="Target Date"
              format="DD/MM/YYYY"
              onDateChange={(date) => {}}
              customStyles={{
                dateInput: {
                  borderRadius: 5,
                  alignItems: "flex-start",
                  height: 45,
                  padding: 14,
                },
              }}
            />
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginVertical: 5 }}>
            <TouchableRipple style={{ width: "20%", height: 45 }} onPress={() => {}}>
              <TextInput
                style={{ width: "100%", height: 45 }}
                mode="outlined"
                label={"Return To"}
                placeholder="Select Return To"
                editable={false}
                //value={param.customer}
              ></TextInput>
            </TouchableRipple>
            <DatePicker
              style={{ width: "20%", marginTop: 8, marginBottom: 4 }}
              date={new Date()}
              mode="date"
              showIcon={false}
              placeholder="Return to Date"
              format="DD/MM/YYYY"
              onDateChange={(date) => {}}
              customStyles={{
                dateInput: {
                  borderRadius: 5,
                  alignItems: "flex-start",
                  height: 45,
                  padding: 14,
                },
              }}
            />
            <TextInput
              style={{ width: "40%", height: 45 }}
              mode="outlined"
              label={"Return To"}
              placeholder="Select Return To"
              editable={false}
              //value={param.customer}
            ></TextInput>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "flex-end", marginVertical: 5 }}>
            <Button mode="contained" style={{ marginHorizontal: 5 }} color="red">
              Return
            </Button>
            <Button mode="contained" style={{ marginHorizontal: 5 }} color="red">
              Save
            </Button>
          </View>
        </View>
        <View>
          <ScrollView horizontal={true}>
            <View>
              <Table borderStyle={{ borderWidth: 1, borderColor: "#c8e1ff" }}>
                <Row
                  data={[
                    "S No.",
                    "Date",
                    "Supplier",
                    "Roll No.",
                    "Qty",
                    "Action",
                    "Fabric Cat.",
                    "Short No.",
                    "Fabric Name",
                    "Color",
                    "Description",
                  ]}
                  style={styles.head}
                  textStyle={styles.text}
                  widthArr={widthArr}
                />
              </Table>
              <FlatList
                data={gridData}
                getItemLayout={(data, index) => ({ length: 40, offset: 40 * index, index })}
                initialNumToRender={5}
                renderItem={({ item, index }) => (
                  <Table borderStyle={{ borderWidth: 1, borderColor: "#c8e1ff" }}>
                    <Row
                      key={index}
                      data={[
                        index + 1,
                        item.date,
                        item.supplier,
                        item.roll_no,
                        item.qty,
                        "",
                        item.fabric_category,
                        item.short_no,
                        item.fabric_name,
                        item.color,
                        item.description,
                      ]}
                      style={styles.row}
                      textStyle={styles.text}
                      widthArr={widthArr}
                    />
                  </Table>
                )}
                keyExtractor={(item) => item.tran_id}
              />
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    height: 45,
    marginTop: 4,
    marginBottom: 4,
  },
  textArea: {
    marginTop: 4,
    marginBottom: 4,
  },
  fabLeft: {
    position: "absolute",
    margin: 16,
    left: 0,
    bottom: 0,
    backgroundColor: "#6200ee",
  },
  fabRight: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#6200ee",
  },
  dropdown: {
    height: 45,
    marginTop: 4,
    marginBottom: 4,
    //borderWidth: 2,
    borderColor: "grey",
  },
  header: { height: 50, backgroundColor: "#537791" },
  text: { textAlign: "center", fontWeight: "100" },
  dataWrapper: { marginTop: -1 },
  row: { height: 40 },
  head: { height: 40, backgroundColor: "#f1f8ff" },
  text: { margin: 6 },
  listContent: {
    fontFamily: font.medium,
    fontSize: 13,
    marginRight: 10,
  },
  spinnerTextStyle: {
    color: "#FFF",
  },
});

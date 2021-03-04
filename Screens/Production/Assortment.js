import React from "react";
import {
  TextInput,
  Searchbar,
  Button,
  TouchableRipple,
  Title,
  Portal,
  Dialog,
  FAB,
  Subheading,
} from "react-native-paper";
import { View, ScrollView, StyleSheet, Alert, FlatList } from "react-native";
import { Table, Row } from "react-native-table-component";
import { postData } from "../../_Services/Api_Service";
import Spinner from "react-native-loading-spinner-overlay";
import font from "../../fonts.js";
import { AuthContext } from "../../Components/Context";
import DatePicker from "react-native-datepicker";
import moment from "moment";

import { Picker } from "@react-native-picker/picker";
import ProductionHeader from "./ProductionHeader";

export default function Assortment({ route, navigation }) {
  const { userId } = React.useContext(AuthContext);
  const [isloading, setloading] = React.useState(true);
  const [gridData, setGrid] = React.useState([]);
  const [modal, setModal] = React.useState({
    issue: false,
    index: false,
  });
  const [param, setParam] = React.useState({
    user_id: "",
    search: "",
    process_id: "13",
    check_all: false,

    qty1: "",
    issue: "",

    tran_id: "0",
    process: "Assortment",
    qty: "",
    date: moment().format("DD/MM/YYYY"),
    assortment_id: "",

    process_id: "19",
    receivefrom_id: "",
    lot_no: "",
    size: "",
    shortage: "",
    excess: "",
    barcode: "",
    remarks: "",
    assortment: "",
    price: "",
    alter: "",
    alter_party_id: "",
    alter_party_type: "",
    alter_party_name: "",
    chain: "",
    chain_party_id: "",
    chain_party_type: "",
    chain_party_name: "",
    debit_fabrication: "",
    debit_fabrication_id: "",
    debit_fabrication_type: "",
    debit_fabrication_name: "",
    debit_washing: "",
    debit_washing_id: "",
    debit_washing_type: "",
    debit_washing_name: "",
    balance_pic_assortment: "",
    comments: "",
  });
  const [item, setItem] = React.useState({});

  const widthArr = [100, 100, 100, 100];
  const RenderItem = ({ item, index }) => (
    <Table borderStyle={{ borderWidth: 1, borderColor: "#c8e1ff" }}>
      <Row
        key={index}
        data={[
          //index + 1,
          item.date,
          item.process,
          item.qty,
          Action(item.qty),
        ]}
        style={styles.row}
        textStyle={styles.text}
        widthArr={widthArr}
      />
    </Table>
  );

  const Action = (qty, process) => {
    return (
      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        <Button
          mode="contained"
          compact={true}
          color="green"
          onPress={() => {
            setModal({ ...modal, issue: true });
            setParam({ ...param, qty1: qty });
          }}
        >
          Issue
        </Button>
      </View>
    );
  };

  const Refresh = () => {
    postData("Production/BrowseProductionAssortment", param).then((data) => {
      // console.log(data);
      setGrid(data);
      setloading(false);
    });
  };

  React.useEffect(() => {
    userId().then((data) => {
      param.user_id = data;
    });
    navigation.addListener("focus", () => {
      setTimeout(() => {
        Refresh();
      }, 1000);
    });
  }, []);

  return (
    <>
      <ProductionHeader index={9} navigation={navigation} />
      <View style={{ flex: 1 }}>
        <Spinner
          visible={isloading}
          textContent={"Loading.."}
          textStyle={styles.spinnerTextStyle}
          size={"large"}
          color={"#6200ee"}
          animation={"fade"}
          textStyle={{ color: "#6200ee" }}
        />
        <Portal>
          <Dialog
            visible={modal.issue}
            onDismiss={() => {
              setModal({ ...modal, issue: false });
            }}
          >
            <Dialog.Title>Issue</Dialog.Title>
            <Dialog.Content>
              <View style={{ marginVertical: 5 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    marginVertical: 5,
                  }}
                >
                  <Subheading style={{ textAlign: "left", marginLeft: "8%" }}>
                    Process: {param.process}
                  </Subheading>
                  <Subheading style={{ textAlign: "left", marginLeft: "8%" }}>
                    Qty: {param.qty1}
                  </Subheading>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    marginVertical: 5,
                  }}
                >
                  <DatePicker
                    style={{ width: "40%", marginTop: 10, marginBottom: 4 }}
                    date={param.date}
                    mode="date"
                    showIcon={false}
                    placeholder="Receive Date"
                    format="DD/MM/YYYY"
                    onDateChange={(date) => {
                      setParam({ ...param, date: date });
                    }}
                    customStyles={{
                      dateInput: {
                        borderRadius: 5,
                        alignpur_tran: "flex-start",
                        height: 45,
                        padding: 14,
                      },
                    }}
                  />
                  <TextInput
                    style={{ width: "40%", height: 45 }}
                    mode="outlined"
                    label={"Size"}
                    placeholder="Size"
                    onChangeText={(text) => {
                      setParam({ ...param, size: text });
                    }}
                    value={param.size}
                  ></TextInput>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    marginVertical: 5,
                  }}
                >
                  <View
                    style={{
                      borderWidth: 0.6,
                      //borderColor: "#A9A9A9",
                      borderColor: "black",
                      borderRadius: 5,
                      marginTop: 8,
                      height: 45,
                      width: "40%",
                      backgroundColor: "white",
                    }}
                  >
                    <Picker
                      selectedValue={param.issue}
                      style={{ height: 45, width: "100%" }}
                      onValueChange={(itemValue, itemIndex) => {
                        setParam({ ...param, issue: itemValue });
                      }}
                    >
                      <Picker.Item label="--Option--" value="" />
                      <Picker.Item label="Factory Store" value="Factory Store" />
                      <Picker.Item label="Shop Return" value="Shop Return" />
                    </Picker>
                  </View>
                  <TextInput
                    style={{ width: "40%", height: 45 }}
                    mode="outlined"
                    label={"Barcode"}
                    placeholder="Barcode"
                    onChangeText={(text) => {
                      setParam({ ...param, barcode: text, assortment_id: text, lot_no: text });
                    }}
                    value={param.barcode}
                  ></TextInput>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    marginVertical: 5,
                  }}
                >
                  <TextInput
                    style={{ width: "40%", height: 45 }}
                    mode="outlined"
                    label={"Pickup Qty"}
                    placeholder="Pickup Qty"
                    onChangeText={(text) => {
                      setParam({ ...param, qty: text });
                    }}
                    value={param.qty}
                  ></TextInput>
                  <TextInput
                    style={{ width: "40%", height: 45 }}
                    mode="outlined"
                    label={"Price"}
                    placeholder="Price"
                    onChangeText={(text) => {
                      setParam({ ...param, price: text });
                    }}
                    value={param.price}
                  ></TextInput>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    marginVertical: 5,
                  }}
                >
                  <TextInput
                    style={{ width: "85%", height: 100 }}
                    mode="outlined"
                    label={"Comments"}
                    placeholder="Comments"
                    onChangeText={(text) => {
                      setParam({ ...param, comments: text });
                    }}
                    value={param.comments}
                  ></TextInput>
                </View>
              </View>
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                onPress={() => {
                  if (param.issue == "Factory Store") {
                    //setloading(true);
                    //console.log(param);
                    postData("Production/InsertKajChallanInvoice", param).then((data) => {
                      setloading(false);
                      if (data.valid) {
                        Alert.alert("Form Save Succeessfully!!");
                        setModal({ ...modal, issue: false });
                      } else {
                        Alert.alert("Error", data.msg);
                      }
                    });
                  } else {
                    postData("Production/InsertProductionAssortmentIssue", param).then((data) => {
                      setloading(false);
                      if (data.valid) {
                        Alert.alert("Form Save Succeessfully!!");
                        setModal({ ...modal, issue: false });
                      } else {
                        Alert.alert("Error", data.msg);
                      }
                    });
                  }
                }}
              >
                Done
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        <ScrollView horizontal={true}>
          <View>
            <Table borderStyle={{ borderWidth: 1, borderColor: "#c8e1ff" }}>
              <Row
                data={[
                  //"S No",
                  "Date",
                  "Process",
                  "Qty",
                  "Action",
                ]}
                style={styles.head}
                textStyle={styles.text}
                widthArr={widthArr}
              />
            </Table>

            <FlatList
              data={gridData}
              getItemLayout={(data, index) => ({ length: 55, offset: 55 * index, index })}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              renderItem={RenderItem}
              keyExtractor={(item) => item.tran_id}
            />
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 16,
    left: 0,
    bottom: 0,
    backgroundColor: "#6200ee",
  },
  input: {
    height: 45,
    marginTop: 4,
    marginBottom: 4,
  },
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: "#fff" },
  header: { height: 50, backgroundColor: "#537791" },
  text: { textAlign: "center", fontWeight: "100" },
  dataWrapper: { marginTop: -1 },
  row: { height: 55 },
  head: { height: 55, backgroundColor: "#f1f8ff" },
  text: { margin: 6 },
});

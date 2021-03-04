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
import ProductionHeader from "./ProductionHeader";

import { Picker } from "@react-native-picker/picker";

export default function Shop({ route, navigation }) {
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

    tran_id: "0",
    s_tran_id: "",
    qty: "",
    date: moment().format("DD/MM/YYYY"),
    barcode: "",
    pickup_qty: "",
    entry_no: "",
  });

  const widthArr = [100, 100, 80, 180, 100, 100, 100, 100, 100, 100, 100, 100];
  const RenderItem = ({ item, index }) => (
    <Table borderStyle={{ borderWidth: 1, borderColor: "#c8e1ff" }}>
      <Row
        key={index}
        data={[
          index + 1,
          item.date,
          item.lot_no,
          item.pickup_qty,
          item.rate,
          item.size,
          item.comments,
          item.hala,
          item.color,
          item.remarks,
          item.created_by,
          Action(item.tran_id, item.pickup_qty, item.barcode),
        ]}
        style={styles.row}
        textStyle={styles.text}
        widthArr={widthArr}
      />
    </Table>
  );

  const Action = (tran_id, qty, barcode) => {
    return (
      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        <Button
          mode="contained"
          compact={true}
          color="green"
          onPress={() => {
            setModal({ ...modal, issue: true });
            setParam({ ...param, s_tran_id: tran_id, qty: qty, barcode: barcode });
          }}
        >
          Issue
        </Button>
      </View>
    );
  };

  const Refresh = () => {
    postData("Production/BrowseProductionGandhiNagar", param).then((data) => {
      // console.log(data);
      setGrid(data);
      setloading(false);
    });
  };

  React.useEffect(() => {
    userId().then((data) => {
      param.user_id = data;
    });
    postData("Production/GenerateEntryNoInShop", {}).then((data) => {
      console.log(data);
      setParam({ ...param, entry_no: data.toString() });
    });
    navigation.addListener("focus", () => {
      setTimeout(() => {
        Refresh();
      }, 1000);
    });
  }, []);

  return (
    <>
      <ProductionHeader index={12} navigation={navigation} />
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
            <Dialog.Title>
              Issue{"    "}Entry No. {param.entry_no}
            </Dialog.Title>
            <Dialog.Content>
              <View style={{ marginVertical: 5 }}>
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
                    label={"Issue To"}
                    placeholder="Issue To"
                    value="Factory Store"
                    editable={false}
                  ></TextInput>
                  <TextInput
                    style={{ width: "40%", height: 45 }}
                    mode="outlined"
                    label={"Process"}
                    placeholder="Process"
                    value="Shop"
                    editable={false}
                  ></TextInput>
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
                    placeholder="Date"
                    format="DD/MM/YYYY"
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
                    label={"Qty"}
                    placeholder="Qty"
                    value={param.qty}
                    editable={false}
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
                    label={"Barcode"}
                    placeholder="Barcode"
                    value={param.barcode}
                    editable={false}
                  ></TextInput>
                  <TextInput
                    style={{ width: "40%", height: 45 }}
                    mode="outlined"
                    label={"Pickup Qty"}
                    placeholder="Pickup Qty"
                    onChangeText={(text) => {
                      setParam({ ...param, pickup_qty: text });
                    }}
                    value={param.pickup_qty}
                  ></TextInput>
                </View>
              </View>
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                onPress={() => {
                  postData("Production/InsertShopToFactoryStore", param).then((data) => {
                    setloading(false);
                    if (data.valid) {
                      Alert.alert("Form Save Succeessfully!!");
                      setModal({ ...modal, issue: false });
                    } else {
                      Alert.alert("Error", data.msg);
                    }
                  });
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
                  "S No",
                  "Date",
                  "Lot No.",
                  "Qty",
                  "Rate",
                  "Size",
                  "Comments",
                  "Hala",
                  "Color",
                  "Remarks",
                  "Created By",
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

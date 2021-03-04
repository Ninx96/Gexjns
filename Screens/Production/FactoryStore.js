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
import { View, ScrollView, StyleSheet, Alert, FlatList, Image } from "react-native";
import { Table, Row } from "react-native-table-component";
import { postData } from "../../_Services/Api_Service";
import Spinner from "react-native-loading-spinner-overlay";
import font from "../../fonts.js";
import { AuthContext } from "../../Components/Context";
import DatePicker from "react-native-datepicker";
import moment from "moment";
import ProductionHeader from "./ProductionHeader";

import { Picker } from "@react-native-picker/picker";

export default function FactoryStore({ route, navigation }) {
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
    process_id: "15",
    check_all: false,
    all: false,
    price: "0",
    rack: "",

    qty: "",
    lot_no: "",

    tran_id: "0",
    fs_tran_id: "",
    date: moment().format("DD/MM/YYYY"),
    issue_date: moment().format("DD/MM/YYYY"),
    hala: "GOL",
    barcode: "",
    color: "",
    size: "",
    comments: "",
    pickup_qty: "",
  });

  const widthArr = [100, 100, 80, 180, 100, 100, 100, 100, 100, 100, 100, 100, 180];
  const RenderItem = ({ item, index }) => (
    <Table borderStyle={{ borderWidth: 1, borderColor: "#c8e1ff" }}>
      <Row
        key={index}
        data={[
          //index + 1,
          item.issue_date,
          item.lot_no,
          item.qty,
          item.size,
          item.comments,
          item.hala,
          item.color,
          Img(item.image_path),
          item.remarks,
          CalculateQty(),
          item.rack,
          item.created_by,
          Action({ tran_id: item.tran_id, hide: item.hide, qty: item.qty, lot_no: item.lot_no }),
        ]}
        style={styles.row}
        textStyle={styles.text}
        widthArr={widthArr}
      />
    </Table>
  );

  const Img = (url) => {
    return (
      <Image
        source={{ uri: "https://musicstore.quickgst.in/Attachment_Img/ProductMasterImage/" + url }}
        style={{ height: 55, width: 100 }}
      />
    );
  };

  const CalculateQty = () => {
    return (
      <Button mode="contained" compact={true} color="green">
        Calculate Qty
      </Button>
    );
  };

  const Delete = (tran_id) => {
    setloading(true);
    postData("Production/DeleteFactoryStore", { tran_id: tran_id }).then((data) => {
      Refresh();
      setloading(false);
    });
  };

  const Hide = (tran_id, hide) => {
    let _param = {
      hide_unhide: hide == "True" ? false : true,
      tran_id: tran_id,
    };
    setloading(true);
    postData("Production/UpdateFactoryStoreHide", _param).then((data) => {
      Refresh();
      setloading(false);
    });
  };

  const Action = (obj) => {
    return (
      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        <Button
          mode="contained"
          compact={true}
          color="green"
          onPress={() => {
            setModal({ ...modal, issue: true });
            setParam({ ...param, qty: obj.qty, fs_tran_id: obj.tran_id, lot_no: obj.lot_no });
          }}
        >
          Issue
        </Button>
        <Button
          mode="contained"
          compact={true}
          color="#E5E7E9"
          onPress={() => {
            Alert.alert(
              "Alert",
              "Are you sure ?",
              [
                {
                  text: "No",
                  style: "cancel",
                },
                {
                  text: "Yes",
                  onPress: () => {
                    Hide(obj.tran_id, obj.hide);
                  },
                },
              ],
              { cancelable: false }
            );
          }}
        >
          {obj.hide == "True" ? "Unhide" : "Hide"}
        </Button>
        <Button
          mode="contained"
          compact={true}
          color="red"
          onPress={() => {
            Alert.alert(
              "Alert",
              "Are you sure ?",
              [
                {
                  text: "No",
                  style: "cancel",
                },
                {
                  text: "Yes",
                  onPress: () => {
                    Delete(obj.tran_id);
                  },
                },
              ],
              { cancelable: false }
            );
          }}
        >
          X
        </Button>
      </View>
    );
  };

  const Refresh = () => {
    postData("Production/BrowseProductionFactoryStore", param).then((data) => {
      //console.log(data);
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
      <ProductionHeader index={10} navigation={navigation} />
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
              Issue Shop{"      "} Lot No.-{param.lot_no}
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
                  <DatePicker
                    style={{ width: "40%", marginTop: 10, marginBottom: 4 }}
                    date={param.issue_date}
                    mode="date"
                    showIcon={false}
                    placeholder="Receive Date"
                    format="DD/MM/YYYY"
                    onDateChange={(date) => {
                      setParam({ ...param, issue_date: date });
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
                    label={"Process"}
                    placeholder="Process"
                    value="Factory Store"
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
                    label={"Qty"}
                    placeholder="Qty"
                    onChangeText={(text) => {
                      setParam({ ...param, qty: text });
                    }}
                    value={param.qty}
                  ></TextInput>
                  <TextInput
                    style={{ width: "40%", height: 45 }}
                    mode="outlined"
                    label={"Issue To"}
                    placeholder="Issue To"
                    value="Shop"
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
                    onChangeText={(text) => {
                      setParam({ ...param, barcode: text });
                    }}
                    value={param.barcode}
                  ></TextInput>
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
                  <TextInput
                    style={{ width: "40%", height: 45 }}
                    mode="outlined"
                    label={"Hala"}
                    placeholder="Hala"
                    onChangeText={(text) => {
                      setParam({ ...param, hala: text });
                    }}
                    value={param.hala}
                  ></TextInput>
                  <TextInput
                    style={{ width: "40%", height: 45 }}
                    mode="outlined"
                    label={"Color"}
                    placeholder="Color"
                    onChangeText={(text) => {
                      setParam({ ...param, color: text });
                    }}
                    value={param.color}
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
                      setParam({ ...param, pickup_qty: text });
                    }}
                    value={param.pickup_qty}
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
                    label={"Remarks"}
                    placeholder="Remarks"
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
                  postData("Production/InsertProductionIssueToGandhiNagar", param).then((data) => {
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
                  //"S No",
                  "Date",
                  "Lot No.",
                  "Qty",
                  "Size",
                  "Comments",
                  "Hala",
                  "Color",
                  "Image",
                  "Remarks",
                  "Update Qty",
                  "Rack",
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

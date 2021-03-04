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
} from "react-native-paper";
import { View, ScrollView, StyleSheet, Alert, FlatList, Image } from "react-native";
import { Table, Row } from "react-native-table-component";
import { AuthContext } from "../../Components/Context";
import { postData } from "../../_Services/Api_Service";
import DatePicker from "react-native-datepicker";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import { Picker } from "@react-native-picker/picker";
import SearchableDropdown from "react-native-searchable-dropdown";
import Spinner from "react-native-loading-spinner-overlay";
import font from "../../fonts.js";
import moment from "moment";

export default function IssueGodown({ route, navigation }) {
  const { userId } = React.useContext(AuthContext);

  const reqParam = route.params;
  const [modal, setModal] = React.useState({
    item: false,
    index: false,
  });
  const [isloading, setloading] = React.useState(true);
  const [item, setItem] = React.useState({
    lot_no: "",
    size: "",
    hala: "",
    back_pocket: "",
    qty: "",
    rate: "",
    amount: "",
  });
  const [param, setParam] = React.useState({
    tran_id: "0",
    process_id: "12",
    process: "Godown",
    receivefrom_id: reqParam.issueto_id,
    receive_from: "Rahul Master",
    issue_date: reqParam.issue_date,
    date: moment().format("DD/MM/YYYY"),
    issue_qty: reqParam.qty,
    qty: "330",
    receive_qty: "",
    wastage: "",
    avg_mtrs: "",
    rate: "",
    remarks: "",
    cutting_datetime: reqParam.cutting_datetime,
    Cuttingitem: [],
    user_id: "",
  });
  const widthArr = [50, 100, 100, 80, 100, 100, 100, 100, 100, 100, 100];

  React.useEffect(() => {
    userId().then((data) => {
      param.user_id = data;
    });
  }, []);

  const Action = (key, item) => {
    return (
      <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
        <Button
          mode="contained"
          color="red"
          compact={true}
          onPress={() => {
            setItem(item);
            setModal({ ...modal, item: true, index: key });
            param.Cuttingitem.splice(key, 1);
          }}
        >
          Edit
        </Button>

        <Button
          mode="contained"
          color="blue"
          compact={true}
          onPress={() => {
            param.Cuttingitem.splice(key, 1);
            setParam({ ...param });
          }}
        >
          X
        </Button>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Portal>
        <Dialog
          visible={modal.item}
          onDismiss={() => {
            setModal({ ...modal, item: false });
          }}
        >
          <Dialog.Title>Item Details</Dialog.Title>
          <Dialog.Content>
            <TextInput
              style={{ height: 45 }}
              mode="outlined"
              label={"Lot No."}
              placeholder="Lot No."
              onChangeText={(text) => {
                setItem({ ...item, lot_no: text });
              }}
              value={item.lot_no}
            ></TextInput>
            <TextInput
              style={{ height: 45 }}
              mode="outlined"
              label={"Size"}
              placeholder="Size"
              onChangeText={(text) => {
                setItem({ ...item, size: text });
              }}
              value={item.size}
            ></TextInput>
            <TextInput
              style={{ height: 45 }}
              mode="outlined"
              label={"Hala"}
              placeholder="Hala"
              onChangeText={(text) => {
                setItem({ ...item, hala: text });
              }}
              value={item.hala}
            ></TextInput>
            <TextInput
              style={{ height: 45 }}
              mode="outlined"
              label={"Back Pocket"}
              placeholder="Back Pocket"
              onChangeText={(text) => {
                setItem({ ...item, hsn: text });
              }}
              value={item.hsn}
            ></TextInput>
            <TextInput
              style={{ height: 45 }}
              mode="outlined"
              label={"Qty"}
              placeholder="Qty"
              onChangeText={(text) => {
                setItem({ ...item, qty: text });
              }}
              value={item.qty}
            ></TextInput>
            <TextInput
              style={{ height: 45 }}
              mode="outlined"
              label={"Rate"}
              placeholder="Rate"
              onChangeText={(text) => {
                setItem({ ...item, rate: text });
              }}
              value={item.rate}
            ></TextInput>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => {
                if (modal.index) {
                  param.Cuttingitem.splice(index, 1, item);
                } else {
                  param.Cuttingitem.push(item);
                }

                setModal({ ...modal, item: false });
                setParam({ ...param });
              }}
            >
              Done
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <ScrollView>
        <View style={{ marginVertical: 5 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginVertical: 5 }}>
            <DatePicker
              style={{ width: "40%", marginTop: 10, marginBottom: 4 }}
              date={param.date}
              mode="date"
              showIcon={false}
              placeholder="Date"
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
              style={{ width: "100%", height: 45 }}
              mode="outlined"
              label={"Receive From"}
              placeholder="Receive From"
              editable={false}
              value={param.receive_from}
            ></TextInput>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginVertical: 5 }}>
            <TextInput
              style={{ width: "100%", height: 45 }}
              mode="outlined"
              label={"Process"}
              placeholder="Process"
              editable={false}
              value={param.process}
            ></TextInput>
            <TextInput
              style={{ width: "40%", height: 45 }}
              mode="outlined"
              label={"Balance Qty(Mtr)"}
              placeholder="Balance Qty(Mtr)"
              onChangeText={(text) => {
                setParam({ ...param, wastage: text });
              }}
              value={param.wastage}
            ></TextInput>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginVertical: 5 }}>
            <TextInput
              style={{ width: "100%", height: 45 }}
              mode="outlined"
              label={"Qty(Mtr)"}
              placeholder="Qty(Mtr)"
              editable={false}
              value={param.qty}
            ></TextInput>
            <TextInput
              style={{ width: "40%", height: 45 }}
              mode="outlined"
              label={"Avg Mtrs."}
              placeholder="Avg Mtrs."
              onChangeText={(text) => {
                setParam({ ...param, avg_mtrs: text });
              }}
              value={param.avg_mtrs}
            ></TextInput>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginVertical: 5 }}>
            <TextInput
              style={{ width: "40%", height: 45 }}
              mode="outlined"
              label={"Receive Qty(Mtr)"}
              placeholder="Receive Qty(Mtr)"
              onChangeText={(text) => {
                setParam({ ...param, receive_qty: text });
              }}
              value={param.receive_qty}
            ></TextInput>
            <TextInput
              style={{ width: "40%", height: 45 }}
              mode="outlined"
              label={"Total Qty(Pcs)"}
              placeholder="Total Qty(Pcs)"
              onChangeText={(text) => {
                // setParam({ ...param, to: text });
              }}
              value={param.receive_qty}
            ></TextInput>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginVertical: 5 }}>
            <TextInput
              style={{ width: "40%", height: 45 }}
              mode="outlined"
              label={"Rate"}
              placeholder="Rate"
              onChangeText={(text) => {
                setParam({ ...param, rate: text });
              }}
              value={param.rate}
            ></TextInput>
          </View>
        </View>
        <View style={{ marginVertical: 5 }}>
          <ScrollView horizontal={true}>
            <View>
              <Table borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}>
                <Row
                  data={[
                    "S No.",
                    "Lot No.",
                    "Size",
                    "Hala",
                    "Back Pocket",
                    "Qty",
                    "Rate",
                    "Amount",
                    "Action",
                  ]}
                  style={styles.head}
                  textStyle={styles.text}
                  widthArr={widthArr}
                />
              </Table>
              <Table borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}>
                {param.Cuttingitem.map((item, index) => {
                  return (
                    <Row
                      key={index}
                      data={[
                        index + 1,
                        item.description,
                        item.lot_no,
                        item.qty,
                        item.rate,
                        item.size,
                        item.hsn,
                        item.hala,
                        item.fabric,
                        item.qty * item.rate,
                        Action(index, item),
                      ]}
                      style={styles.row}
                      textStyle={styles.text}
                      widthArr={widthArr}
                    />
                  );
                })}
              </Table>
            </View>
          </ScrollView>
          <Button
            mode="contained"
            color="green"
            compact={true}
            style={{ alignSelf: "flex-end", margin: 10 }}
            onPress={() => {
              setModal({ item: true });
            }}
          >
            Add Item
          </Button>
          <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginVertical: 5 }}>
            <Button
              mode="contained"
              color="green"
              compact={true}
              style={{ alignSelf: "flex-end", margin: 10 }}
              onPress={() => {
                if (param.process == "") {
                  alert("Please Select BillTo");
                } else if (param.qty == "") {
                  alert("Please Select ShipTo");
                } else {
                  setloading(true);
                  //console.log(param);
                  postData("Production/InsertProductionCutting", param).then((data) => {
                    setloading(false);
                    if (data.valid) {
                      Alert.alert("Form Save Succeessfully!!");
                      navigation.goBack();
                    } else {
                      Alert.alert("Error", data.msg);
                    }
                  });
                }
              }}
            >
              Save
            </Button>
            <Button
              mode="contained"
              color="red"
              compact={true}
              style={{ alignSelf: "flex-end", margin: 10 }}
              onPress={() => {
                navigation.goBack();
              }}
            >
              Cancel
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

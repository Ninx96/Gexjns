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

export default function IssueFactoryStore({ route, navigation }) {
  const { userId } = React.useContext(AuthContext);

  const reqParam = route.params;
  const [modal, setModal] = React.useState({
    chain: false,
    fabricator: false,
    washing: false,
    other: false,
  });
  const [isloading, setloading] = React.useState(true);
  const [partyList, setpartyList] = React.useState([]);
  const [param, setParam] = React.useState({
    tran_id: reqParam.tran_id,
    date: moment().format("DD/MM/YYYY"),
    process: reqParam.process,
    receive_from: "Packing",
    issue_to: reqParam.issue_to,
    issue_date: reqParam.issue_date,
    lot_no: reqParam.lot_no,
    qty: reqParam.qty,
    issueto_id: reqParam.issueto_id,
    size: reqParam.size,
    remarks: reqParam.remarks,
  });

  return (
    <View style={{ flex: 1 }}>
      <Portal>
        <Dialog
          visible={modal.chain || modal.fabricator || modal.washing || modal.other}
          onDismiss={() => {
            setModal({
              ...modal,
              chain: false,
              fabricator: false,
              washing: false,
              other: false,
            });
          }}
        >
          <Dialog.Title>Select Party</Dialog.Title>
          <Dialog.Content>
            <SearchableDropdown
              onItemSelect={(item) => {
                if (modal.chain) {
                  setParam({
                    ...param,
                    customer_id: item.id,
                    type: item.type,
                    customer_name: item.name,
                  });
                } else if (modal.fabricator) {
                  setParam({
                    ...param,
                    customer_id: item.id,
                    type: item.type,
                    customer_name: item.name,
                  });
                } else if (modal.washing) {
                  setParam({
                    ...param,
                    customer_id: item.id,
                    type: item.type,
                    customer_name: item.name,
                  });
                } else {
                  setParam({
                    ...param,
                    scustomer_id: item.id,
                    stype: item.type,
                    scustomer_name: item.name,
                  });
                }
              }}
              containerStyle={{ padding: 1 }}
              itemStyle={{
                padding: 10,
                marginTop: 2,
                backgroundColor: "#fff",
                borderColor: "#000",
                borderWidth: 1,
                borderRadius: 5,
              }}
              itemTextStyle={{ color: "#222" }}
              itemsContainerStyle={{ maxHeight: 140 }}
              items={partyList}
              defaultIndex={2}
              resetValue={false}
              textInputProps={{
                placeholder: "Search Party",
                underlineColorAndroid: "transparent",
                style: {
                  padding: 13,
                  borderWidth: 1,
                  borderColor: "#7b7070",
                  borderRadius: 5,
                },
                onTextChange: (text) => {
                  postData("StockDropdown/GetSupplierPurchaseList", { search: text }).then(
                    (resp) => {
                      setSupplierList(resp);
                    }
                  );
                },
              }}
              listProps={{
                nestedScrollEnabled: true,
              }}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => {
                setModal({
                  ...modal,
                  chain: false,
                  fabricator: false,
                  washing: false,
                  other: false,
                });
              }}
            >
              Done
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <ScrollView>
        <Title style={{ textAlign: "center" }}>Issue Factory Store Details</Title>
        <View style={{ marginVertical: 5 }}>
          <Subheading style={{ textAlign: "left", marginLeft: "8%" }}>
            Lot No: {param.lot_no}
          </Subheading>
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
              style={{ width: "40%", height: 45 }}
              mode="outlined"
              label={"Process"}
              placeholder="Process"
              editable={false}
              value={param.process}
            ></TextInput>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginVertical: 5 }}>
            <TextInput
              style={{ width: "40%", height: 45 }}
              mode="outlined"
              label={"Receive From"}
              placeholder="Receive From"
              editable={false}
              value={param.receive_from}
            ></TextInput>
            <TextInput
              style={{ width: "40%", height: 45 }}
              mode="outlined"
              label={"Issue To"}
              placeholder="Issue To"
              editable={false}
              value={param.issue_to}
            ></TextInput>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginVertical: 5 }}>
            <TextInput
              style={{ width: "40%", height: 45 }}
              mode="outlined"
              label={"Hala"}
              placeholder="Hala"
              editable={false}
              value={param.hala}
            ></TextInput>
            <TextInput
              style={{ width: "40%", height: 45 }}
              mode="outlined"
              label={"Qty"}
              placeholder="Qty"
              editable={false}
              value={param.qty}
            ></TextInput>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginVertical: 5 }}>
            <TextInput
              style={{ width: "40%", height: 45 }}
              mode="outlined"
              label={"Size"}
              placeholder="Size"
              editable={false}
              value={param.size}
            ></TextInput>
            <TextInput
              style={{ width: "40%", height: 45 }}
              mode="outlined"
              label={"Issue Qty"}
              placeholder="Issue Qty"
              onChangeText={(text) => {
                setParam({ ...param, issue_qty: text });
              }}
              value={param.issue_qty}
            ></TextInput>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginVertical: 5 }}>
            <TextInput
              style={{ width: "40%", height: 45 }}
              mode="outlined"
              label={"Price"}
              placeholder="Price"
              onChangeText={(text) => {
                setParam({ ...param, issue_qty: text });
              }}
              value={param.issue_qty}
            ></TextInput>
            <TextInput
              style={{ width: "40%", height: 45 }}
              mode="outlined"
              label={"Comments"}
              placeholder="Comments"
              onChangeText={(text) => {
                setParam({ ...param, issue_qty: text });
              }}
              value={param.issue_qty}
            ></TextInput>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginVertical: 5 }}>
            <TextInput
              style={{ width: "40%", height: 45 }}
              mode="outlined"
              label={"Assortment"}
              placeholder="Assortment"
              onChangeText={(text) => {
                setParam({ ...param, issue_qty: text });
              }}
              value={param.issue_qty}
            ></TextInput>
            <TextInput
              style={{ width: "40%", height: 45 }}
              mode="outlined"
              label={"Color"}
              placeholder="Color"
              onChangeText={(text) => {
                setParam({ ...param, issue_qty: text });
              }}
              value={param.issue_qty}
            ></TextInput>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginVertical: 5 }}>
            <TextInput
              style={{ width: "85%", height: 100 }}
              mode="outlined"
              label={"Remarks"}
              placeholder="Remarks"
              onChangeText={(text) => {
                setParam({ ...param, remarks: text });
              }}
              value={param.remarks}
            ></TextInput>
          </View>
        </View>
        <Title style={{ textAlign: "center" }}>Details</Title>
        <View style={{ marginVertical: 5 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginVertical: 5 }}>
            <TouchableRipple
              style={{ width: "40%", height: 45 }}
              onPress={() => {
                setModal({ ...modal, chain: true });
              }}
            >
              <TextInput
                style={{ width: "100%", height: 45 }}
                mode="outlined"
                label={"Chain Alter Name"}
                placeholder="Chain Alter Name"
                editable={false}
                value={param.customer_name}
              ></TextInput>
            </TouchableRipple>
            <TextInput
              style={{ width: "40%", height: 45 }}
              mode="outlined"
              label={"Qty"}
              placeholder="Qty"
              onChangeText={(text) => {
                setParam({ ...param, issue_qty: text });
              }}
              value={param.issue_qty}
            ></TextInput>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginVertical: 5 }}>
            <TouchableRipple
              style={{ width: "40%", height: 45 }}
              onPress={() => {
                setModal({ ...modal, fabricator: true });
              }}
            >
              <TextInput
                style={{ width: "100%", height: 45 }}
                mode="outlined"
                label={"Fabricator Alter Name"}
                placeholder="Chain Alter Name"
                editable={false}
                value={param.customer_name}
              ></TextInput>
            </TouchableRipple>
            <TextInput
              style={{ width: "40%", height: 45 }}
              mode="outlined"
              label={"Qty"}
              placeholder="Qty"
              onChangeText={(text) => {
                setParam({ ...param, issue_qty: text });
              }}
              value={param.issue_qty}
            ></TextInput>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginVertical: 5 }}>
            <TouchableRipple
              style={{ width: "40%", height: 45 }}
              onPress={() => {
                setModal({ ...modal, washing: true });
              }}
            >
              <TextInput
                style={{ width: "100%", height: 45 }}
                mode="outlined"
                label={"Washing Alter Name"}
                placeholder="Chain Alter Name"
                editable={false}
                value={param.customer_name}
              ></TextInput>
            </TouchableRipple>
            <TextInput
              style={{ width: "40%", height: 45 }}
              mode="outlined"
              label={"Qty"}
              placeholder="Qty"
              onChangeText={(text) => {
                setParam({ ...param, issue_qty: text });
              }}
              value={param.issue_qty}
            ></TextInput>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginVertical: 5 }}>
            <TouchableRipple
              style={{ width: "40%", height: 45 }}
              onPress={() => {
                setModal({ ...modal, other: true });
              }}
            >
              <TextInput
                style={{ width: "100%", height: 45 }}
                mode="outlined"
                label={"Other Alter Name"}
                placeholder="Chain Alter Name"
                editable={false}
                value={param.customer_name}
              ></TextInput>
            </TouchableRipple>
            <TextInput
              style={{ width: "40%", height: 45 }}
              mode="outlined"
              label={"Qty"}
              placeholder="Qty"
              onChangeText={(text) => {
                setParam({ ...param, issue_qty: text });
              }}
              value={param.issue_qty}
            ></TextInput>
          </View>
        </View>
        <View style={{ height: 100 }}></View>
      </ScrollView>
      <FAB
        style={styles.fabRight}
        icon="check"
        onPress={() => {
          if (param.customer_name == "") {
            alert("Please Select BillTo");
          } else if (param.scustomer_name == "") {
            alert("Please Select ShipTo");
          } else {
            setloading(true);
            //console.log(param);
            postData("Production/InsertKajChallanInvoice", param).then((data) => {
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
      />
      <FAB
        style={styles.fabLeft}
        icon="close"
        onPress={() => {
          navigation.goBack();
        }}
      />
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

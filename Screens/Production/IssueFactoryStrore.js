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
    tran_id: "0",
    packaging_id: reqParam.tran_id,
    date: moment().format("DD/MM/YYYY"),
    process_id: "16",
    process: reqParam.process,
    receivefrom_id: reqParam.issueto_id,
    receive_from: "Packing",
    lot_no: reqParam.lot_no,
    qty: reqParam.qty,
    qty1: reqParam.qty,
    size: reqParam.size,
    hala: reqParam.hala,
    color: "",
    price: "",
    shortage: "",
    excess: "",
    barcode: "",
    remarks: reqParam.remarks,
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
    assortment: "",
    comments: "",
    user_id: "",
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
                    chain_party_id: item.id,
                    chain_party_type: item.type,
                    chain_party_name: item.name,
                  });
                } else if (modal.fabricator) {
                  setParam({
                    ...param,
                    debit_fabrication_id: item.id,
                    debit_fabrication_type: item.type,
                    debit_fabrication_name: item.name,
                  });
                } else if (modal.washing) {
                  setParam({
                    ...param,
                    debit_fabrication_id: item.id,
                    debit_fabrication_type: item.type,
                    debit_washing_name: item.name,
                  });
                } else {
                  setParam({
                    ...param,
                    alter_party_id: item.id,
                    alter_party_type: item.type,
                    alter_party_name: item.name,
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
                  postData("StockDropdown/SelectPartyInDailyWashing", { search: text }).then(
                    (resp) => {
                      setpartyList(resp);
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
              value={param.qty1}
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
                setParam({ ...param, qty: text });
              }}
              value={param.qty}
            ></TextInput>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginVertical: 5 }}>
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
            <TextInput
              style={{ width: "40%", height: 45 }}
              mode="outlined"
              label={"Comments"}
              placeholder="Comments"
              onChangeText={(text) => {
                setParam({ ...param, comments: text });
              }}
              value={param.comments}
            ></TextInput>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginVertical: 5 }}>
            <TextInput
              style={{ width: "40%", height: 45 }}
              mode="outlined"
              label={"Assortment"}
              placeholder="Assortment"
              onChangeText={(text) => {
                setParam({ ...param, assortment: text });
              }}
              value={param.assortment}
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
                value={param.chain_party_name}
              ></TextInput>
            </TouchableRipple>
            <TextInput
              style={{ width: "40%", height: 45 }}
              mode="outlined"
              label={"Qty"}
              placeholder="Qty"
              onChangeText={(text) => {
                setParam({ ...param, chain: text });
              }}
              value={param.chain}
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
                placeholder="Fabricator Alter Name"
                editable={false}
                value={param.debit_fabrication_name}
              ></TextInput>
            </TouchableRipple>
            <TextInput
              style={{ width: "40%", height: 45 }}
              mode="outlined"
              label={"Qty"}
              placeholder="Qty"
              onChangeText={(text) => {
                setParam({ ...param, debit_fabrication: text });
              }}
              value={param.debit_fabrication}
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
                placeholder="Washing Alter Name"
                editable={false}
                value={param.debit_washing_name}
              ></TextInput>
            </TouchableRipple>
            <TextInput
              style={{ width: "40%", height: 45 }}
              mode="outlined"
              label={"Qty"}
              placeholder="Qty"
              onChangeText={(text) => {
                setParam({ ...param, debit_washing: text });
              }}
              value={param.debit_washing}
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
                placeholder="Other Alter Name"
                editable={false}
                value={param.alter_party_name}
              ></TextInput>
            </TouchableRipple>
            <TextInput
              style={{ width: "40%", height: 45 }}
              mode="outlined"
              label={"Qty"}
              placeholder="Qty"
              onChangeText={(text) => {
                setParam({ ...param, alter: text });
              }}
              value={param.alter}
            ></TextInput>
          </View>
        </View>
        <View style={{ height: 100 }}></View>
      </ScrollView>
      <FAB
        style={styles.fabRight}
        icon="check"
        onPress={() => {
          setloading(true);
          //console.log(param);
          postData("Production/PushPackStore", param).then((data) => {
            setloading(false);
            if (data.valid) {
              Alert.alert("Form Save Succeessfully!!");
              navigation.goBack();
            } else {
              Alert.alert("Error", data.msg);
            }
          });
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

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

export default function ChallanInvoice({ route, navigation }) {
  const { userId } = React.useContext(AuthContext);

  const reqParam = route.params;

  const [isloading, setloading] = React.useState(true);
  const [companyList, setCompanyList] = React.useState([]);
  const [customerList, setCustomerList] = React.useState([]);
  const [modal, setModal] = React.useState({
    item: false,
    index: false,
    billto: false,
    shipto: false,
  });
  const [item, setItem] = React.useState({
    description: "",
    barcode: "",
    qty: "",
    rate: "",
    amount: "",
    dis_per: "",
    dis_amt: "",
    sub_total: "",
    tax_per: "",
    sgst: "",
    cgst: "",
    igst: "",
    total: "",
    size: "",
    hala: "",
    fabric: "",
    hsn: "",
  });
  const [param, setParam] = React.useState({
    tran_id: reqParam.tran_id === undefined ? 0 : reqParam.tran_id,
    date: moment().format("DD/MM/YYYY"),
    prefix: "CI",
    challan_no: "",
    customer_id: "",
    customer_name: "",
    ledger_id: "",
    challan_no: "",
    type: "",
    state_id: "",
    gstin: "",
    scustomer_id: "",
    scustomer_name: "",
    stype: "",
    sstate_id: "",
    sgstin: "",
    transport: "",
    eway_bill: "",
    company_id: "",
    remarks: "",
    challan_no: "",
    discount_per: "",
    discount_amount: "",
    terms_condition: "",
    chain: "",
    aster: "",
    uri: require("../../assets/upload.png"),
    file_path: "",
    target_date: "",
    invoice_type: "Challan",
    challan_invoice: "",
    challanitem: [],
    user_id: "",
  });
  const widthArr = [50, 100, 100, 80, 100, 100, 100, 100, 100, 100, 100];

  const ImageUpload = async () => {
    try {
      const Camera = await Permissions.getAsync(Permissions.CAMERA);
      const camera_roll = await Permissions.getAsync(Permissions.MEDIA_LIBRARY);

      if (!Camera.granted) {
        Permissions.askAsync(Permissions.CAMERA);
      } else if (!camera_roll.granted) {
        Permissions.askAsync(Permissions.MEDIA_LIBRARY);
      } else {
        const options = {
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.2,
          base64: true,
        };
        Alert.alert("Select Upload Option", "Choose an Option To Continue", [
          {
            text: "Camera",
            onPress: () => {
              ImagePicker.launchCameraAsync(options).then((result) => {
                if (!result.cancelled) {
                  setParam({
                    ...param,
                    uri: { uri: result.uri },
                    file_path: result.base64,
                  });
                }
              });
            },
          },
          {
            text: "Gallery",
            onPress: () => {
              ImagePicker.launchImageLibraryAsync(options).then((result) => {
                if (!result.cancelled) {
                  setParam({
                    ...param,
                    uri: { uri: result.uri },
                    file_path: result.base64,
                  });
                }
              });
            },
          },
        ]);
      }
    } catch (err) {
      console.warn(err);
    }
  };

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
            param.challanitem.splice(key, 1);
          }}
        >
          Edit
        </Button>

        <Button
          mode="contained"
          color="blue"
          compact={true}
          onPress={() => {
            param.challanitem.splice(key, 1);
            setParam({ ...param });
          }}
        >
          X
        </Button>
      </View>
    );
  };

  React.useEffect(() => {
    userId().then((data) => {
      param.user_id = data;
    });
    postData("StockDropdown/GetChallanCompanyList", {}).then((resp) => {
      //console.log(resp);
      setCompanyList(resp);
    });
    postData("StockDropdown/SelectBillToInChallan", { search: "" }).then((resp) => {
      setCustomerList(resp);
    });

    if (reqParam.kajbutton_id) {
      postData("Production/PickKajInChallan", { kajbutton_id: reqParam.kajbutton_id }).then(
        (resp) => {
          param.challanitem = resp;
        }
      );
    }
    if (reqParam.godown_id) {
      postData("Production/PreviewChallanInvoice", { godown_id: reqParam.godown_id }).then(
        (resp) => {
          param.challanitem = resp;
        }
      );
    }
    if (param.tran_id) {
      postData("Production/PreviewChallanInvoice", param).then((resp) => {
        setParam({ ...param, ...resp });
      });
    } else {
      postData("Production/GetChallanNoInKaj", {}).then((resp) => {
        setParam({ ...param, challan_no: resp.toString() });
      });
    }
  }, []);

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
              label={"Description"}
              placeholder="Description"
              onChangeText={(text) => {
                setItem({ ...item, description: text });
              }}
              value={item.description}
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
              label={"HSN"}
              placeholder="HSN"
              onChangeText={(text) => {
                setItem({ ...item, hsn: text });
              }}
              value={item.hsn}
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
              label={"Fabric"}
              placeholder="Fabric"
              onChangeText={(text) => {
                setItem({ ...item, fabric: text });
              }}
              value={item.fabric}
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
                  param.challanitem.splice(index, 1, item);
                } else {
                  param.challanitem.push(item);
                }

                setModal({ ...modal, item: false });
                setParam({ ...param });
              }}
            >
              Done
            </Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog
          visible={modal.billto || modal.shipto}
          onDismiss={() => {
            setModal({ ...modal, billto: false, shipto: false });
          }}
        >
          <Dialog.Title>Select Customer</Dialog.Title>
          <Dialog.Content>
            <SearchableDropdown
              onItemSelect={(item) => {
                if (modal.billto) {
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
              items={customerList}
              defaultIndex={2}
              resetValue={false}
              textInputProps={{
                placeholder: "Search Customer",
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
                setModal({ ...modal, billto: false, shipto: false });
              }}
            >
              Done
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <ScrollView>
        <Title style={{ textAlign: "center" }}>Challan Invoice</Title>
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
              style={{ width: "40%", height: 45 }}
              mode="outlined"
              label={"Challan No."}
              placeholder="Challan No."
              onChangeText={(text) => {
                setParam({ ...param, challan_no: text });
              }}
              value={param.challan_no}
            ></TextInput>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginVertical: 5 }}>
            <View
              style={{
                borderWidth: 0.6,
                //borderColor: "#A9A9A9",
                borderColor: "black",
                borderRadius: 5,
                marginTop: 8,
                height: 45,
                width: "85%",
                backgroundColor: "white",
              }}
            >
              <Picker
                selectedValue={param.company_id}
                style={{ height: 45, width: "100%" }}
                onValueChange={(itemValue, itemIndex) => {
                  setParam({ ...param, company_id: itemValue });
                }}
              >
                <Picker.Item label="--Option--" value="" />
                {companyList.map((item) => (
                  <Picker.Item label={item.name} value={item.id} />
                ))}
              </Picker>
            </View>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginVertical: 5 }}>
            <TouchableRipple
              style={{ width: "40%", height: 45 }}
              onPress={() => {
                setModal({ ...modal, billto: true });
              }}
            >
              <TextInput
                style={{ width: "100%", height: 45 }}
                mode="outlined"
                label={"Bill To"}
                placeholder="Bill To"
                editable={false}
                value={param.customer_name}
              ></TextInput>
            </TouchableRipple>

            <TextInput
              style={{ width: "40%", height: 45 }}
              mode="outlined"
              label={"GSTIN"}
              placeholder="GSTIN"
              onChangeText={(text) => {
                setParam({ ...param, gstin: text });
              }}
              value={param.gstin}
            ></TextInput>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginVertical: 5 }}>
            <TouchableRipple
              style={{ width: "40%", height: 45 }}
              onPress={() => {
                setModal({ ...modal, shipto: true });
              }}
            >
              <TextInput
                style={{ width: "100%", height: 45 }}
                mode="outlined"
                label={"Ship To"}
                placeholder="Ship To"
                editable={false}
                value={param.scustomer_name}
              ></TextInput>
            </TouchableRipple>

            <TextInput
              style={{ width: "40%", height: 45 }}
              mode="outlined"
              label={"GSTIN"}
              placeholder="GSTIN"
              onChangeText={(text) => {
                setParam({ ...param, sgstin: text });
              }}
              value={param.sgstin}
            ></TextInput>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginVertical: 5 }}>
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
                selectedValue={param.invoice_type}
                style={{ height: 45, width: "100%" }}
                onValueChange={(itemValue, itemIndex) => {
                  setParam({ ...param, invoice_type: itemValue });
                }}
              >
                <Picker.Item label="--Option--" value="" />
                <Picker.Item label="Challan" value="Challan" />
                <Picker.Item label="GR" value="GR" />
                <Picker.Item label="Rewash" value="Rewash" />
                <Picker.Item label="Sample" value="Sample" />
              </Picker>
            </View>

            <TextInput
              style={{ width: "40%", height: 45 }}
              mode="outlined"
              label={"E Way"}
              placeholder="E Way"
              onChangeText={(text) => {
                setParam({ ...param, eway_bill: text });
              }}
              value={param.eway_bill}
            ></TextInput>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginVertical: 5 }}>
            <TextInput
              style={{ width: "40%", height: 45 }}
              mode="outlined"
              label={"Transport"}
              placeholder="Transport"
              onChangeText={(text) => {
                setParam({ ...param, transport: text });
              }}
              value={param.transport}
            ></TextInput>

            <TextInput
              style={{ width: "40%", height: 45 }}
              mode="outlined"
              label={"Chain"}
              placeholder="Chain"
              onChangeText={(text) => {
                setParam({ ...param, chain: text });
              }}
              value={param.chain}
            ></TextInput>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginVertical: 5 }}>
            <TextInput
              style={{ width: "40%", height: 45 }}
              mode="outlined"
              label={"Aster"}
              placeholder="Aster"
              onChangeText={(text) => {
                setParam({ ...param, aster: text });
              }}
              value={param.aster}
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
          <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginVertical: 5 }}>
            <View style={{ width: "40%" }}>
              <Image source={param.uri} style={{ width: "100%", height: 150, borderRadius: 10 }} />
              <Button mode="contained" compact={true} onPress={ImageUpload} color="green">
                Browse
              </Button>
              <Button
                mode="contained"
                color="red"
                onPress={() => {
                  setParam({ ...param, uri: require("../../assets/upload.png"), file_path: "" });
                }}
              >
                Clear
              </Button>
            </View>
          </View>
        </View>
        <View style={{ marginVertical: 5, paddingHorizontal: 2 }}>
          <Searchbar style={{ flex: 10 }} placeholder="Search" onChangeText={(text) => {}} />
          <ScrollView horizontal={true}>
            <View>
              <Table borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}>
                <Row
                  data={[
                    "S No.",
                    "Description",
                    "Lot No.",
                    "Qty",
                    "Rate",
                    "Size",
                    "HSN",
                    "Hala",
                    "Fabric",
                    "Total",
                    "Action",
                  ]}
                  style={styles.head}
                  textStyle={styles.text}
                  widthArr={widthArr}
                />
              </Table>
              <Table borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}>
                {param.challanitem.map((item, index) => {
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
            Add Manual
          </Button>
        </View>
        <View style={{ height: 80 }}></View>
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

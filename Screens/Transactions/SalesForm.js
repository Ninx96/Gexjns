import React from "react";
import {
  Text,
  TextInput,
  FAB,
  Searchbar,
  Headline,
  Divider,
  TouchableRipple,
  ActivityIndicator,
  Dialog,
  Portal,
  Button,
  DataTable,
  Card,
  Modal,
  Title,
} from "react-native-paper";
import {
  View,
  ScrollView,
  StyleSheet,
  Image,
  SafeAreaView,
  Alert,
  PermissionsAndroid,
  Dimensions,
  Platform,
} from "react-native";
import { Table, Row } from "react-native-table-component";
import { postData } from "../../_Services/Api_Service";
import { AuthContext } from "../../Components/Context";
import DropDownPicker from "react-native-dropdown-picker";
import DatePicker from "react-native-datepicker";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import font from "../../fonts.js";
import Spinner from "react-native-loading-spinner-overlay";
import { FontAwesome, EvilIcons } from "@expo/vector-icons";
import { BarCodeScanner } from "expo-barcode-scanner";
import SearchableDropdown from "react-native-searchable-dropdown";

export default function SalesForm({ route, navigation }) {
  const { tran_id } = route.params == undefined ? 0 : route.params;
  const { userId } = React.useContext(AuthContext);
  const [isloading, setloading] = React.useState(true);
  const [brokerList, setBrokerList] = React.useState([]);
  const [brokerempList, setBrokerEmpList] = React.useState([]);
  const [companyList, setCompanyList] = React.useState([]);
  //const [mycustomerList, setMyCustomerList] = React.useState([]);
  const [partyList, setPartyList] = React.useState([]);
  const [modal, setModal] = React.useState({
    state: false,
    qr: false,
    item: false,
    scanned: false,
    party: false,
  });
  const [hasPermission, setHasPermission] = React.useState(null);
  const [poGrid, setPoGrid] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [Image1, setImage1] = React.useState(require("../../assets/upload.png"));
  const [Image2, setImage2] = React.useState(require("../../assets/upload.png"));

  const [packingslipItem, setItem] = React.useState({
    ps_tran_id: "",
    barcode: "",
    comments: "",
    type: "",
    size: "",
    color: "",
    qty: "",
    rate: "",
    amount: "",
    total: "",
    dis_Per: "",
    dis_amt: "",
    sub_total: "",
    tax_per: "",
    sgst: "",
    cgst: "",
    igst: "",
  });

  const [param, setParam] = React.useState({
    user_id: "",
    search: "",
    skip: "",

    tran_id: tran_id == undefined ? 0 : tran_id,
    date: "",
    packing_slip_no: "",
    customer_po_no: "",
    po_date: "",
    inv_per: "",
    po_id: "",
    customer: "",
    customer_id: "",
    gstin: "",
    company_id: "",
    broker_id: "",
    broker_emp_id: "",
    builty_no: "",
    state_id: "",
    state_code: "",
    type: "",
    transport: "",
    invoice_no: "",
    invoice_amt: "",
    gaddi_name: "",
    mycustomer_id: "",
    remarks: "",
    attachment: "",
    attachment1: "",
    image_name: "",
    image_name1: "",
    taxes: "",
    discount: "",
    gaddi_comm: "",
    advance: "",
    other_charges: "",
    other_charges_less: "",
    dis_per: "",
    gaddi_name: "",

    packingslipitem: [],

    total_qty: "",
    total_amt: "",
    Gtotal_amt: 0,

    barcode: "",
  });

  let barcode;

  async function BarcodeScanner() {
    try {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    } catch (err) {
      console.warn(err);
    }
  }

  const handleBarCodeScanned = ({ type, data }) => {
    setModal({ ...modal, qr: false, scanned: true });
    // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    param.barcode = data;
    setParam({ ...param });
    SearchBarcode();
  };

  const calcParams = () => {
    var temp =
      (isNaN(parseInt(param.total_amt)) ? 0 : parseInt(param.total_amt)) +
      (isNaN(parseInt(param.taxes)) ? 0 : parseInt(param.taxes)) +
      (isNaN(parseInt(param.advance)) ? 0 : parseInt(param.advance)) -
      ((isNaN(parseInt(param.dis_per)) ? 0 : parseInt(param.dis_per)) *
        (isNaN(parseInt(param.total_amt)) ? 0 : parseInt(param.total_amt))) /
        100 -
      (isNaN(parseInt(param.discount)) ? 0 : parseInt(param.discount)) -
      (isNaN(parseInt(param.gaddi_comm)) ? 0 : parseInt(param.gaddi_comm)) +
      (isNaN(parseInt(param.other_charges)) ? 0 : parseInt(param.other_charges)) -
      (isNaN(parseInt(param.other_charges_less)) ? 0 : parseInt(param.other_charges_less));
    param.Gtotal_amt = temp.toString();
    setParam({ ...param, Gtotal_amt: param.Gtotal_amt });
  };

  const widthArr = [50, 200, 100, 100, 150, 100, 100, 200, 70, 150, 60, 150];

  const Refresh = () => {
    postData("Transaction/PickPoDC", param).then((data) => {
      setPoGrid(data);
    });
  };

  React.useEffect(() => {
    CalTotal();
  }, [param.packingslipitem]);

  React.useEffect(() => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    today = dd + "/" + mm + "/" + yyyy;
    param.date = today;

    userId().then((data) => {
      param.user_id = data;
      Refresh();
    });
    BarcodeScanner();
    let _param = {
      user_id: param.user_id,
    };
    postData("StockDropdown/GetBrokerList", _param).then((resp) => {
      setBrokerList(resp);
    });
    postData("StockDropdown/GetCompanyListDC", "").then((resp) => {
      setCompanyList(resp);
    });
    postData("StockDropdown/GetContactDetails", { search: "" }).then((resp) => {
      //console.log(resp);
      setPartyList(resp);
    });

    if (tran_id != undefined) {
      setTimeout(function () {
        Preview();
      }, 1000);
    } else {
      postData("Transaction/EntryNoInPackingSlip", "").then((resp) => {
        setParam({ ...param, packing_slip_no: resp.packing_slip_no });
        setloading(false);
      });
    }
  }, []);

  const GetBrokerEmployee = (id) => {
    param.state_id = id;
    let _param = {
      user_id: param.user_id,
      broker_id: id,
    };
    postData("StockDropdown/GetBrokerEmployee", _param).then((resp) => {
      setBrokerEmpList(resp);
    });
  };

  const SearchBarcode = () => {
    if (param.barcode != "") {
      setloading(true);
      let _param = {
        barcode: param.barcode,
      };
      postData("Transaction/SelectItemInDC", _param).then((resp) => {
        resp.map((item, key) => {
          var isAppend = true;
          let total_qty = 0;
          let qty = item.lot_qty >= 20 ? 20 : parseFloat(item.lot_qty);

          param.packingslipitem.map((item2, key) => {
            if (item.tran_id == item2.ps_tran_id) {
              total_qty = parseFloat(total_qty) + parseFloat(item2.qty);
              if (parseFloat(item.lot_qty) > total_qty) {
                qty = item.lot_qty - total_qty >= 20 ? 20 : parseFloat(item.lot_qty - total_qty);
              } else {
                isAppend = false;
              }
            }
          });

          // console.log(parseFloat(item.lot_qty));
          // console.log(total_qty);
          // console.log(isAppend);
          if (isAppend) {
            param.packingslipitem.push({
              ps_tran_id: item.tran_id,
              barcode: item.barcode,
              comments: item.comments,
              type: item.type,
              size: item.size,
              color: item.color,
              qty: qty.toString(),
              rate: item.price,
              lot_qty: item.lot_qty,
              amount: Number(qty) * Number(item.price),
              total: Number(qty) * Number(item.price),
              dis_per: "",
              dis_amt: "",
              sub_total: "",
              tax_per: "",
              sgst: "",
              cgst: "",
              igst: "",
            });
          }
        });
        param.barcode = "";
        setParam({ ...param });

        CalTotal();
        setloading(false);
      });
    }
  };
  const CalTotal = () => {
    let totalQty = 0,
      totalAmt = 0;
    param.packingslipitem.map((item, key) => {
      totalQty = Number(totalQty) + Number(item.qty);
      totalAmt = Number(totalAmt) + Number(item.total);
    });

    var temp =
      (isNaN(parseInt(totalAmt)) ? 0 : parseInt(totalAmt)) +
      (isNaN(parseInt(param.taxes)) ? 0 : parseInt(param.taxes)) +
      (isNaN(parseInt(param.advance)) ? 0 : parseInt(param.advance)) -
      ((isNaN(parseInt(param.dis_per)) ? 0 : parseInt(param.dis_per)) *
        (isNaN(parseInt(param.total_amt)) ? 0 : parseInt(param.total_amt))) /
        100 -
      (isNaN(parseInt(param.discount)) ? 0 : parseInt(param.discount)) -
      (isNaN(parseInt(param.gaddi_comm)) ? 0 : parseInt(param.gaddi_comm)) +
      (isNaN(parseInt(param.other_charges)) ? 0 : parseInt(param.other_charges)) -
      (isNaN(parseInt(param.other_charges_less)) ? 0 : parseInt(param.other_charges_less));

    setParam({ ...param, total_qty: totalQty, total_amt: totalAmt, Gtotal_amt: temp });
  };
  const Action = (key, item) => {
    return (
      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        <FontAwesome
          name="trash"
          size={24}
          color="red"
          onPress={() => {
            param.packingslipitem.splice(key, 1);
            setParam({ ...param, packingslipitem: param.packingslipitem });
            calcParams();
          }}
        />
        <FontAwesome
          name="edit"
          size={24}
          color="green"
          onPress={() => {
            //console.log(item);
            setItem(item);
            param.packingslipitem.splice(key, 1);
            CalTotal();
            setModal({ ...modal, item: true, key: key });
          }}
        />
      </View>
    );
  };

  const Preview = () => {
    postData("Transaction/PreviewSalesPackingSlip", param).then((resp) => {
      GetBrokerEmployee(resp.broker_id);
      setTimeout(function () {
        setParam({
          ...param,
          tran_id: tran_id == undefined ? 0 : tran_id,
          date: resp.date,
          packing_slip_no: resp.packing_slip_no,
          customer: resp.customer,
          customer_id: resp.customer_id == "" ? "" : resp.customer_id,
          type: resp.type,
          state_id: resp.state_id == "" ? "" : resp.state_id,
          state_code: resp.state_code,
          gstin: resp.gstin,
          po_id: resp.po_id == "" ? "" : resp.po_id,
          customer_po_no: resp.customer_po_no,
          po_date: resp.po_date,
          remarks: resp.remarks,
          inv_per: resp.inv_per,
          company_id: resp.company_id == "" ? "" : resp.company_id,
          broker_id: resp.broker_id == "" ? "" : resp.broker_id,
          broker_emp_id: resp.emp_id == "" ? "" : resp.emp_id,
          transport: resp.transport,
          taxes: resp.taxes,
          discount: resp.discount,
          gaddi_comm: resp.gaddi_comm,
          advance: resp.advance,
          other_charges: resp.other_charges,
          other_charges_less: resp.other_charges_less,
          gaddi_name: resp.gaddi_name,
          dis_per: resp.dis_per,
          image_name: resp.attachment,
          image_name1: resp.attachment1,
          packingslipitem: resp.packingslipitem,
        });
      }, 1000);

      if (resp.attachment != "") {
        setImage1({
          uri: `https://musicstore.quickgst.in/Attachment_Img/PackingSlipImage1/${resp.attachment}`,
        });
      }
      if (resp.attachment1 != "") {
        setImage2({
          uri: `https://musicstore.quickgst.in/Attachment_Img/PackingSlipImage2/${resp.attachment1}`,
        });
      }

      setloading(false);
    });
  };
  let dimensions = Dimensions.get("window");
  let imageWidth = Math.round((dimensions.width * 12) / 16);
  let imageHeight = Math.round(imageWidth / 2);

  return (
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
          visible={modal.state}
          style={{ height: "95%" }}
          onDismiss={() => {
            setModal({ ...modal, state: false });
          }}
        >
          <Dialog.Title>Choose PO</Dialog.Title>
          <Dialog.Content>
            <Searchbar
              placeholder="Search"
              onIconPress={() => {
                Refresh();
                setPage(0);
              }}
              style={{
                marginBottom: 10,
              }}
              onChangeText={(text) => {
                param.search = text;
                setParam({ ...param });
                Refresh();
                setPage(0);
              }}
            />
            <ScrollView style={{ height: "70%" }}>
              {poGrid.length > 0 ? (
                poGrid.map((po, index) => {
                  return (
                    <Card
                      key={index}
                      onPress={() => {
                        setloading(true);
                        setParam({
                          ...param,
                          po_id: po.po_id,
                          customer_po_no: po.po_no,
                          po_date: po.po_date,
                          inv_per: po.billing,
                          customer: po.party,
                          customer_id: po.party_id,
                          type: po.type,
                          broker_id: po.broker_id,
                          transport: po.transport,
                        });
                        setModal(false);
                        setloading(false);
                      }}
                      style={{ backgroundColor: "#f9f9f9", marginBottom: 10 }}
                    >
                      <Card.Title
                        title={po.party}
                        titleStyle={{ fontSize: 13, fontFamily: font.bold }}
                        subtitle={po.po_no + " -- " + po.po_date}
                      />
                    </Card>
                  );
                })
              ) : (
                <Text> Fetching PO...</Text>
              )}
            </ScrollView>
            <DataTable>
              <DataTable.Pagination
                page={page}
                numberOfPages={poGrid.length < 10 ? page + 1 : page + 2}
                onPageChange={(page) => {
                  setPage(page);
                  param.skip = page * 10;
                  Refresh();
                }}
              />
            </DataTable>
          </Dialog.Content>
        </Dialog>

        <Dialog visible={modal.qr} dismissable={true}>
          <Dialog.Title style={{ textAlign: "center" }}>Scan QR Code</Dialog.Title>
          <FontAwesome
            name="close"
            size={30}
            color="black"
            style={{ color: "black", position: "absolute", top: "2%", right: "5%" }}
            color="#fff"
            onPress={() => {
              setModal({ ...modal, qr: false });
            }}
          />
          <Dialog.Content>
            <View style={{ width: "100%", height: "92%" }}>
              <BarCodeScanner
                //barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
                onBarCodeScanned={modal.scanned ? undefined : handleBarCodeScanned}
                style={[StyleSheet.absoluteFill, styles.barcontainer]}
              >
                <View style={styles.layerTop} />
                <View>
                  <View style={styles.layerLeft} />
                  <View style={styles.focused} />
                  <View style={styles.layerRight} />
                </View>
                <View style={styles.layerBottom} />
              </BarCodeScanner>
            </View>
          </Dialog.Content>
        </Dialog>

        <Dialog
          visible={modal.item}
          onDismiss={() => {
            setModal({ ...modal, item: false });
          }}
        >
          <Dialog.Title>Item Details</Dialog.Title>
          <Dialog.Content>
            <ScrollView>
              <TextInput
                style={styles.input}
                mode="outlined"
                label="Qty"
                value={packingslipItem.qty}
                onChangeText={(text) => {
                  let total_qty = text;
                  var pre_qty = 0;

                  param.packingslipitem.map((item, key) => {
                    if (packingslipItem.ps_tran_id == item.ps_tran_id) {
                      pre_qty = parseFloat(pre_qty) + parseFloat(item.qty);
                      total_qty = parseFloat(total_qty) + parseFloat(item.qty);
                    }
                  });

                  if (parseFloat(packingslipItem.lot_qty) >= total_qty) {
                    //console.log("1");
                    setItem({
                      ...packingslipItem,
                      qty: text,
                    });
                  } else {
                    var qty = (
                      parseFloat(packingslipItem.lot_qty) - parseFloat(pre_qty)
                    ).toString();
                    //console.log("2");
                    setItem({
                      ...packingslipItem,
                      qty: qty,
                    });
                  }
                }}
              ></TextInput>
              <TextInput
                style={styles.input}
                mode="outlined"
                label="Rate"
                value={packingslipItem.rate}
                onChangeText={(text) => {
                  setItem({
                    ...packingslipItem,
                    rate: text,
                    amount: text * packingslipItem.qty,
                    total: text * packingslipItem.qty,
                  });
                }}
              ></TextInput>
              <TextInput
                style={styles.input}
                mode="outlined"
                label="Comments"
                value={packingslipItem.comments}
                onChangeText={(text) => {
                  setItem({
                    ...packingslipItem,
                    comments: text,
                  });
                }}
              ></TextInput>
              <TextInput
                style={styles.input}
                mode="outlined"
                label="Size"
                value={packingslipItem.size}
                onChangeText={(text) => {
                  setItem({
                    ...packingslipItem,
                    size: text,
                  });
                }}
              ></TextInput>
              <TextInput
                style={styles.input}
                mode="outlined"
                label="Color"
                value={packingslipItem.color}
                onChangeText={(text) => {
                  setItem({
                    ...packingslipItem,
                    color: text,
                  });
                }}
              ></TextInput>
            </ScrollView>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => {
                setModal({ ...modal, item: false });
                packingslipItem.amount =
                  parseFloat(packingslipItem.qty) * parseFloat(packingslipItem.rate);
                packingslipItem.total =
                  parseFloat(packingslipItem.qty) * parseFloat(packingslipItem.rate);

                param.packingslipitem.splice(modal.key, 0, packingslipItem);

                setParam({ ...param });
                calcParams();
                CalTotal();
              }}
            >
              Done
            </Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog
          visible={modal.party}
          onDismiss={() => {
            setModal({ ...modal, party: false });
          }}
        >
          <Dialog.Title>Select Party </Dialog.Title>
          <Dialog.Content>
            <SearchableDropdown
              onItemSelect={(item) => {
                //console.log(item);
                setParam({
                  ...param,
                  customer_id: item.id == "" ? null : item.id,
                  customer: item.name,
                  type: item.type,
                });
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
                  postData("StockDropdown/GetContactDetails", { search: text }).then((resp) => {
                    //console.log(resp);
                    setPartyList(resp);
                  });
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
                setModal({ ...modal, party: false });
              }}
            >
              Done
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <SafeAreaView>
        <ScrollView>
          <View style={{ padding: 20 }}>
            <View>
              <Button
                color="green"
                mode="contained"
                style={{ marginBottom: 10 }}
                onPress={() => {
                  setModal({ ...modal, state: true });
                }}
              >
                Pick PO
              </Button>

              <DatePicker
                style={{ width: "100%", marginTop: 4, marginBottom: 4 }}
                date={param.date}
                mode="date"
                showIcon={false}
                placeholder="Select Date"
                format="DD/MM/YYYY"
                onDateChange={(date) => {
                  setParam({
                    ...param,
                    date: date,
                  });
                }}
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
                style={styles.input}
                mode="outlined"
                label={"Packing Slip No."}
                value={param.packing_slip_no}
                disabled={true}
                onChangeText={(text) => {
                  setParam({
                    ...param,
                    packing_slip_no: text,
                  });
                }}
              ></TextInput>

              <TextInput
                style={styles.input}
                mode="outlined"
                label={"Customer PO No."}
                value={param.customer_po_no}
                onChangeText={(text) => {
                  setParam({
                    ...param,
                    customer_po_no: text,
                  });
                }}
              ></TextInput>
              <DatePicker
                style={{ width: "100%", marginTop: 4, marginBottom: 4 }}
                date={param.po_date}
                mode="date"
                showIcon={false}
                placeholder="Select PO Date"
                format="DD/MM/YYYY"
                onDateChange={(date) => {
                  setParam({
                    ...param,
                    po_date: date,
                  });
                }}
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
                style={styles.input}
                mode="outlined"
                label={"Invoice Per"}
                value={param.inv_per}
                onChangeText={(text) => {
                  setParam({
                    ...param,
                    city: text,
                  });
                }}
              ></TextInput>
              <TouchableRipple
                onPress={() => {
                  setModal({ ...modal, party: true });
                }}
              >
                <TextInput
                  style={styles.input}
                  mode="outlined"
                  label={"Party"}
                  value={param.customer}
                  editable={false}
                ></TextInput>
              </TouchableRipple>

              <DropDownPicker
                items={companyList}
                placeholder="Select Company"
                style={styles.dropdown}
                itemStyle={{
                  justifyContent: "flex-start",
                }}
                dropDownStyle={{ backgroundColor: "#ffffff" }}
                defaultValue={param.company_id}
                onChangeItem={(item) => {
                  setParam({
                    ...param,
                    company_id: item.value,
                  });
                }}
              />
              <DropDownPicker
                items={brokerList}
                placeholder="Select Gaddi Name"
                style={styles.dropdown}
                itemStyle={{
                  justifyContent: "flex-start",
                }}
                dropDownStyle={{ backgroundColor: "#ffffff" }}
                defaultValue={param.broker_id}
                onChangeItem={(item) => {
                  setParam({
                    ...param,
                    broker_id: item.value,
                  });
                  GetBrokerEmployee(item.value);
                }}
              />
              <DropDownPicker
                items={brokerempList}
                placeholder="Select Gaddi Employee"
                style={styles.dropdown}
                itemStyle={{
                  justifyContent: "flex-start",
                }}
                dropDownStyle={{ backgroundColor: "#ffffff" }}
                defaultValue={param.broker_emp_id}
                onChangeItem={(item) => {
                  setParam({
                    ...param,
                    broker_emp_id: item.value,
                  });
                }}
              />
              {/* <TextInput
                                style={styles.input}
                                mode="outlined"
                                label={"Builty No"}
                                value={param.builty_no}
                                onChangeText={(text) => {
                                    setParam({
                                        ...param,
                                        builty_no: text,
                                    });
                                }}
                            ></TextInput> */}

              <TextInput
                style={styles.input}
                mode="outlined"
                label={"Transport"}
                value={param.transport}
                onChangeText={(text) => {
                  setParam({
                    ...param,
                    transport: text,
                  });
                }}
              ></TextInput>

              {/* <TextInput
                                style={styles.input}
                                mode="outlined"
                                label={"Invoice No"}
                                value={param.invoice_no}
                                onChangeText={(text) => {
                                    setParam({
                                        ...param,
                                        invoice_no: text,
                                    });
                                }}
                            ></TextInput>

                            <TextInput
                                style={styles.input}
                                mode="outlined"
                                label={"Invoice Amount"}
                                value={param.invoice_amt}
                                onChangeText={(text) => {
                                    setParam({
                                        ...param,
                                        invoice_amt: text,
                                    });
                                }}
                            ></TextInput> */}

              {/* <DropDownPicker
                                items={mycustomerList}
                                placeholder="Select My Customer"
                                style={{ backgroundColor: "#ffffff" }}
                                itemStyle={{
                                    justifyContent: "flex-start",
                                }}
                                dropDownStyle={{ backgroundColor: "#ffffff" }}
                                defaultValue={param.mycustomer_id}
                                onChangeItem={(item) => {
                                    setParam({
                                        ...param,
                                        mycustomer_id: item.value,
                                    });
                                }}
                            /> */}

              <TextInput
                style={styles.textArea}
                multiline={true}
                numberOfLines={5}
                mode="outlined"
                label={"Remarks"}
                value={param.remarks}
                onChangeText={(text) => {
                  setParam({
                    ...param,
                    remarks: text,
                  });
                }}
              ></TextInput>
            </View>
            <View style={styles.container}>
              <Text style={{ marginTop: 8 }}>Image 1</Text>
              <TouchableRipple
                onPress={async () => {
                  try {
                    const Camera = await Permissions.getAsync(Permissions.CAMERA);
                    const camera_roll = await Permissions.getAsync(Permissions.CAMERA_ROLL);

                    let result = { cancelled: true };

                    if (!Camera.granted) {
                      Permissions.askAsync(Permissions.CAMERA);
                    } else if (!camera_roll.granted) {
                      Permissions.askAsync(Permissions.CAMERA_ROLL);
                    } else {
                      const options = {
                        mediaTypes: ImagePicker.MediaTypeOptions.Images,
                        quality: 0.2,
                        base64: true,
                      };
                      Alert.alert("Select Upload Option", "Choose an Option To Continue", [
                        {
                          text: "Camera",
                          onPress: async () => {
                            let result = await ImagePicker.launchCameraAsync(options).then(
                              (result) => {
                                if (!result.cancelled) {
                                  setImage1({ uri: result.uri });
                                  setParam({
                                    ...param,
                                    attachment: result.base64,
                                  });
                                }
                              }
                            );
                          },
                        },
                        {
                          text: "Gallery",
                          onPress: async () => {
                            await ImagePicker.launchImageLibraryAsync(options).then((result) => {
                              if (!result.cancelled) {
                                setImage1({ uri: result.uri });
                                setParam({
                                  ...param,
                                  attachment: result.base64,
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
                }}
              >
                <Image source={Image1} style={{ height: imageHeight, width: imageWidth }} />
              </TouchableRipple>
            </View>
            <View style={styles.container}>
              <Text style={{ marginTop: 8 }}>Image 2</Text>
              <TouchableRipple
                onPress={async () => {
                  try {
                    const Camera = await Permissions.getAsync(Permissions.CAMERA);
                    const camera_roll = await Permissions.getAsync(Permissions.CAMERA_ROLL);

                    let result = { cancelled: true };

                    if (!Camera.granted) {
                      Permissions.askAsync(Permissions.CAMERA);
                    } else if (!camera_roll.granted) {
                      Permissions.askAsync(Permissions.CAMERA_ROLL);
                    } else {
                      const options = {
                        mediaTypes: ImagePicker.MediaTypeOptions.Images,
                        quality: 0.2,
                        base64: true,
                      };
                      Alert.alert("Select Upload Option", "Choose an Option To Continue", [
                        {
                          text: "Camera",
                          onPress: async () => {
                            let result = await ImagePicker.launchCameraAsync(options).then(
                              (result) => {
                                if (!result.cancelled) {
                                  setImage2({ uri: result.uri });
                                  setParam({
                                    ...param,
                                    attachment1: result.base64,
                                  });
                                }
                              }
                            );
                          },
                        },
                        {
                          text: "Gallery",
                          onPress: async () => {
                            await ImagePicker.launchImageLibraryAsync(options).then((result) => {
                              if (!result.cancelled) {
                                setImage2({ uri: result.uri });
                                setParam({
                                  ...param,
                                  attachment1: result.base64,
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
                }}
              >
                <Image source={Image2} style={{ height: imageHeight, width: imageWidth }} />
              </TouchableRipple>
            </View>

            <View>
              <Headline style={{ alignSelf: "center", marginBottom: 6 }}>Item Details</Headline>
              <View
                style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}
              >
                <TextInput
                  style={{ height: 45, marginTop: 4, marginBottom: 4, flex: 8 }}
                  mode="outlined"
                  label={"Barcode"}
                  value={param.barcode}
                  onChangeText={(text) => {
                    setParam({
                      ...param,
                      barcode: text,
                    });
                  }}
                  right={
                    <TextInput.Icon
                      onPressIn={() => {
                        setModal({ ...modal, qr: true, scanned: false });
                      }}
                      forceTextInputFocus={false}
                      name="barcode-scan"
                      style={{ top: 5 }}
                    />
                  }
                ></TextInput>

                <EvilIcons
                  name="arrow-right"
                  size={40}
                  color="#6200ee"
                  onPress={() => {
                    SearchBarcode();
                  }}
                />
              </View>
              <ScrollView horizontal={true}>
                <Table borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}>
                  <Row
                    data={[
                      "#",
                      "Barcode",
                      "Qty",
                      "Rate",
                      "Comments",
                      "Type",
                      "Size",
                      "Color",
                      "Amount",
                      "Total",
                      "Action",
                    ]}
                    style={styles.head}
                    textStyle={styles.text}
                    widthArr={[40, 80, 50, 100, 200, 70, 50, 120, 100, 100, 70]}
                  />
                  {param.packingslipitem.map((item, index) => {
                    return (
                      <Row
                        key={index}
                        data={[
                          index + 1,
                          item.barcode,
                          item.qty,
                          item.rate,
                          item.comments,
                          item.type,
                          item.size,
                          item.color,
                          item.amount,
                          item.total,
                          Action(index, item),
                        ]}
                        style={styles.row}
                        textStyle={styles.text}
                        widthArr={[40, 80, 50, 100, 200, 70, 50, 120, 100, 100, 70]}
                      />
                    );
                  })}
                </Table>
              </ScrollView>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ alignSelf: "center", marginBottom: 6 }}>
                Total Qty : {param.total_qty}
              </Text>
              <Text style={{ alignSelf: "center", marginBottom: 6 }}>
                Total Amt : {param.total_amt}
              </Text>
            </View>

            <View style={{ flex: 1, flexDirection: "row" }}>
              <View style={{ flex: 1 }}>
                <TextInput
                  style={styles.input}
                  mode="outlined"
                  label={"Taxes"}
                  value={param.taxes}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    param.taxes = text;
                    calcParams();

                    setParam({
                      ...param,
                      taxes: text,
                    });
                  }}
                ></TextInput>
              </View>
              <View style={{ flex: 1 }}>
                <TextInput
                  style={styles.input}
                  mode="outlined"
                  label={"Paid"}
                  keyboardType="numeric"
                  value={param.advance}
                  onChangeText={(text) => {
                    param.advance = text;
                    calcParams();
                    setParam({
                      ...param,
                      advance: text,
                    });
                  }}
                ></TextInput>
              </View>
            </View>

            <View style={{ flex: 1, flexDirection: "row" }}>
              <View style={{ flex: 1 }}>
                <TextInput
                  style={styles.input}
                  mode="outlined"
                  label={"Discount(%)"}
                  keyboardType="numeric"
                  value={param.dis_per}
                  onChangeText={(text) => {
                    param.dis_per = text;
                    calcParams();

                    setParam({
                      ...param,
                      dis_Per: text,
                    });
                  }}
                ></TextInput>
              </View>
              <View style={{ flex: 1 }}>
                <TextInput
                  style={styles.input}
                  mode="outlined"
                  label={"Extra Discount"}
                  keyboardType="numeric"
                  value={param.discount}
                  onChangeText={(text) => {
                    param.discount = text;
                    calcParams();
                    setParam({
                      ...param,
                      discount: text,
                    });
                  }}
                ></TextInput>
              </View>
            </View>

            <View style={{ flex: 1, flexDirection: "row" }}>
              <View style={{ flex: 1 }}>
                <TextInput
                  style={styles.input}
                  mode="outlined"
                  label={"Gaddi Comm."}
                  keyboardType="numeric"
                  value={param.gaddi_comm}
                  onChangeText={(text) => {
                    param.gaddi_comm = text;
                    calcParams();

                    setParam({
                      ...param,
                      gaddi_comm: text,
                    });
                  }}
                ></TextInput>
              </View>
              <View style={{ flex: 1 }}>
                <TextInput
                  style={styles.input}
                  mode="outlined"
                  label={"Other"}
                  keyboardType="numeric"
                  value={param.other_charges}
                  onChangeText={(text) => {
                    param.other_charges = text;
                    calcParams();

                    setParam({
                      ...param,
                      other_charges: text,
                    });
                  }}
                ></TextInput>
              </View>
            </View>

            <View style={{ flex: 1, flexDirection: "row" }}>
              <View style={{ flex: 1 }}>
                <TextInput
                  style={styles.input}
                  mode="outlined"
                  label={"Other Less"}
                  keyboardType="numeric"
                  value={param.other_charges_less}
                  onChangeText={(text) => {
                    param.other_charges_less = text;
                    calcParams();

                    setParam({
                      ...param,
                      other_charges_less: text,
                    });
                  }}
                ></TextInput>
              </View>

              <View style={{ flex: 1 }}>
                <TextInput
                  style={styles.input}
                  mode="outlined"
                  label={"Grand Total"}
                  keyboardType="numeric"
                  value={param.Gtotal_amt}
                  disabled
                ></TextInput>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
      <FAB
        style={styles.fabRight}
        icon="check"
        onPress={() => {
          if (param.company_name == "") {
            alert("Please Fill Company Name");
          } else {
            setloading(true);
            console.log(param);
            postData("Transaction/InsertSalePackingSlip", param).then((data) => {
              setloading(false);
              if (data.valid) {
                Alert.alert("Form Save Succeessfully!!");
                navigation.navigate("saleslist");
              } else {
                Alert.alert(data.msg);
                console.log(data.msg);
              }
            });
          }
        }}
      />
      <FAB
        style={styles.fabLeft}
        icon="close"
        onPress={() => {
          navigation.navigate("saleslist");
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

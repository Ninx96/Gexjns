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
  Avatar,
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
import { parse } from "react-native-svg";

export default function KachaBillForm({ route, navigation }) {
  const { tran_id } = route.params == undefined ? 0 : route.params;
  const { userId } = React.useContext(AuthContext);
  const [isloading, setloading] = React.useState(true);
  const [brokerList, setBrokerList] = React.useState([]);
  const [brokerempList, setBrokerEmpList] = React.useState([]);
  const [companyList, setCompanyList] = React.useState([]);
  const [mycustomerList, setMyCustomerList] = React.useState([]);
  const [partyList, setPartyList] = React.useState([]);
  const [modal, setModal] = React.useState({
    po: true,
    item: false,
    state: false,
    qr: false,
    scanned: false,
    party: false,
    index: "",
  });
  const [hasPermission, setHasPermission] = React.useState(null);
  const [poGrid, setPoGrid] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [Image1, setImage1] = React.useState(require("../../assets/upload.png"));
  const [Image2, setImage2] = React.useState(require("../../assets/upload.png"));
  const [dcItem, setItem] = React.useState({
    ps_tran_id: "",
    barcode: "",
    comments: "",
    type: "",
    size: "",
    color: "",
    lot_qty: "",
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
    dc_no: "",
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

    dcitem: [],

    total_qty: "0",
    total_amt: "0",
    Gtotal_amt: "0",

    barcode: "",
  });

  let barcode;
  var Tqty = 0,
    Tamt = 0;

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
    //console.log("1-" + temp);
    param.Gtotal_amt = temp.toString();
  };

  const widthArr = [50, 200, 100, 100, 150, 100, 100, 200, 70, 150, 60, 150];

  const Refresh = () => {
    postData(modal.po ? "Transaction/PickPoDC" : "Transaction/PickPackingSaleInDC", param).then(
      (data) => {
        //console.log(data);
        setPoGrid(data);
      }
    );
  };

  React.useEffect(() => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    today = dd + "/" + mm + "/" + yyyy;
    param.date = today;

    userId().then((data) => {
      param.user_id = data;
    });

    let _param = {
      user_id: param.user_id,
    };
    BarcodeScanner();
    postData("StockDropdown/GetBrokerList", _param).then((resp) => {
      setBrokerList(resp);
    });
    postData("StockDropdown/GetCompanyListDC", "").then((resp) => {
      setCompanyList(resp);
    });
    postData("StockDropdown/SelectMyCustomer", "").then((resp) => {
      setMyCustomerList(resp);
    });
    postData("StockDropdown/SelectPartyName", { search: "" }).then((resp) => {
      setPartyList(resp);
    });

    if (tran_id != undefined) {
      Preview();
    } else {
      postData("Transaction/EntryNoInDC", "").then((resp) => {
        setParam({ ...param, dc_no: resp.dc_no });
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
    setloading(true);
    if (param.barcode != "") {
      let _param = {
        barcode: param.barcode,
      };
      postData("Transaction/SelectItemInDC", _param).then((resp) => {
        //console.log(resp);
        resp.map((item, key) => {
          var isAppend = true;
          let total_qty = 0;
          let qty = item.lot_qty >= 20 ? 20 : parseFloat(item.lot_qty);

          param.dcitem.map((item2, key) => {
            if (item.tran_id == item2.ps_tran_id) {
              total_qty = parseFloat(total_qty) + parseFloat(item2.qty);
              if (parseFloat(item.lot_qty) > total_qty) {
                qty = item.lot_qty - total_qty >= 20 ? 20 : parseFloat(item.lot_qty - total_qty);
              } else {
                isAppend = false;
              }
            }
          });

          if (isAppend) {
            param.dcitem.push({
              ps_tran_id: item.tran_id,
              barcode: item.barcode,
              comments: item.comments,
              type: item.type,
              size: item.size,
              color: item.color,
              lot_qty: item.lot_qty,
              qty: qty.toString(),
              rate: item.price,
              amount: Number(20) * Number(item.price),
              total: Number(20) * Number(item.price),
              dis_Per: "",
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
        setParam({ ...param, dcitem: param.dcitem });
        //CalTotal();
        setloading(false);
      });
    }
  };

  const Action = (key, item) => {
    return (
      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        <FontAwesome
          name="trash"
          size={24}
          color="red"
          onPress={() => {
            param.dcitem.splice(key, 1);
            setParam({ ...param });
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
            setModal({ ...modal, item: true, index: key });
            param.dcitem.splice(key, 1);
          }}
        />
      </View>
    );
  };

  const Preview = () => {
    postData("Transaction/PreviewDC", param).then((resp) => {
      GetBrokerEmployee(resp.broker_id);
      //console.log(resp);
      setParam({
        ...param,
        tran_id: tran_id == undefined ? 0 : tran_id,
        date: resp.date,
        dc_no: resp.dc_no,
        mycustomer_id: resp.mycustomer_id == "" ? null : resp.mycustomer_id,
        customer: resp.customer,
        customer_id: resp.customer_id == "" ? null : resp.customer_id,
        type: resp.type,
        state_id: resp.state_id == "" ? null : resp.state_id,
        state_code: resp.state_code,
        gstin: resp.gstin,
        po_id: resp.po_id,
        customer_po_no: resp.customer_po_no,
        po_date: resp.po_date,
        remarks: resp.remarks,
        inv_per: resp.inv_per,
        company_id: resp.company_id == "" ? null : resp.company_id,
        broker_id: resp.broker_id == "" ? null : resp.broker_id,
        broker_emp_id: resp.broker_emp_id == "" ? null : resp.broker_emp_id,
        builty_no: resp.builty_no,
        transport: resp.transport,
        invoice_no: resp.invoice_no,
        invoice_amt: resp.invoice_amt,
        taxes: resp.taxes,
        discount: resp.discount,
        gaddi_comm: resp.gaddi_comm,
        advance: resp.advance,
        other_charges: resp.other_charges,
        other_charges_less: resp.other_charges_less,
        gaddi_name: resp.gaddi_name,
        dis_per: resp.dis_per,
        image_name: resp.file_path,
        image_name1: resp.file_path1,
        dcitem: resp.dcitem,
      });
      if (resp.attachment != "") {
        setImage1({
          uri: `https://musicstore.quickgst.in/Attachment_Img/DCImage/${resp.file_path}`,
        });
      }
      if (resp.attachment1 != "") {
        setImage2({
          uri: `https://musicstore.quickgst.in/Attachment_Img/DCImageTwo/${resp.file_path}`,
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
          // onDismiss={() => {
          //   setModal({ ...modal, state: false });
          // }}
          dismissable={true}
        >
          <Dialog.Title>{modal.po ? "Choose PO" : "Choose Sales"}</Dialog.Title>
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
                        GetBrokerEmployee(po.broker_id);

                        postData("Transaction/PickPackingSaleItemInDC", {
                          tran_id: modal.po ? 0 : po.tran_id,
                        }).then((resp) => {
                          //param.dcitem = resp;

                          resp.map((item, key) => {
                            var isAppend = true;
                            let total_qty = 0;
                            let qty =
                              parseFloat(item.lot_qty) >= parseFloat(item.qty)
                                ? item.qty
                                : parseFloat(item.lot_qty);

                            param.dcitem.map((item2, key) => {
                              if (item.tran_id == item2.ps_tran_id) {
                                total_qty = parseFloat(total_qty) + parseFloat(item2.qty);
                                if (parseFloat(item.lot_qty) > total_qty) {
                                  qty =
                                    item.lot_qty - total_qty >= item.qty
                                      ? item.qty
                                      : parseFloat(item.lot_qty - total_qty);
                                } else {
                                  isAppend = false;
                                }
                              }
                            });

                            if (isAppend) {
                              param.dcitem.push({
                                ps_tran_id: item.tran_id,
                                barcode: item.barcode,
                                comments: item.comments,
                                type: item.type,
                                size: item.size,
                                color: item.color,
                                lot_qty: item.lot_qty,
                                qty: qty,
                                rate: item.rate,
                                amount: Number(qty) * Number(item.rate),
                                total: Number(qty) * Number(item.rate),
                                dis_Per: "",
                                dis_amt: "",
                                sub_total: "",
                                tax_per: "",
                                sgst: "",
                                cgst: "",
                                igst: "",
                              });
                            }
                          });
                          setModal({ ...modal, state: false });

                          setParam({
                            ...param,
                            po_id: modal.po ? po.po_id : "",
                            customer_po_no: po.po_no,
                            po_date: po.po_date,
                            inv_per: po.billing,
                            customer: po.party,
                            customer_id: po.party_id == "" ? null : po.party_id,
                            type: po.type,
                            broker_id: po.broker_id == "" ? null : po.broker_id,
                            broker_emp_id: po.broker_emp_id == "" ? null : po.broker_emp_id,
                            transport: po.transport,
                            remarks: po.remarks,
                          });
                          setloading(false);
                        });
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
                <Text> Fetching ...</Text>
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

        <Dialog
          visible={modal.item}
          onDismiss={() => {
            setModal({ ...modal, item: false });
          }}
        >
          <Dialog.Title>Item Details</Dialog.Title>
          <Dialog.Content>
            <ScrollView>
              {/* <TextInput
                style={styles.input}
                mode="outlined"
                label="Qty"
                value={dcItem.qty}
                onChangeText={(text) => {
                  let total_qty = text;
                  var pre_qty = 0;

                  param.dcitem.map((item, key) => {
                    if (dcItem.ps_tran_id == item.ps_tran_id) {
                      pre_qty = parseFloat(pre_qty) + parseFloat(item.qty);
                      total_qty = parseFloat(total_qty) + parseFloat(item.qty);
                    }
                  });

                  if (parseFloat(dcItem.lot_qty) >= total_qty) {
                    //console.log("1");
                    setItem({
                      ...dcItem,
                      qty: text,
                    });
                  } else {
                    var qty = (parseFloat(dcItem.lot_qty) - parseFloat(pre_qty)).toString();
                    //console.log("2");
                    setItem({
                      ...dcItem,
                      qty: qty,
                    });
                  }

                  // setItem({
                  //   ...dcItem,
                  // //  qty: dcItem.qty
                  // });
                }}
              ></TextInput> */}
              <TextInput
                style={styles.input}
                mode="outlined"
                label="Rate"
                value={dcItem.rate}
                onChangeText={(text) => {
                  setItem({
                    ...dcItem,
                    rate: text,
                  });
                }}
              ></TextInput>
              <TextInput
                style={styles.input}
                mode="outlined"
                label="Comments"
                value={dcItem.comments}
                onChangeText={(text) => {
                  setItem({
                    ...dcItem,
                    comments: text,
                  });
                }}
              ></TextInput>
              <TextInput
                style={styles.input}
                mode="outlined"
                label="Size"
                value={dcItem.size}
                onChangeText={(text) => {
                  setItem({
                    ...dcItem,
                    size: text,
                  });
                }}
              ></TextInput>
              <TextInput
                style={styles.input}
                mode="outlined"
                label="Color"
                value={dcItem.color}
                onChangeText={(text) => {
                  setItem({
                    ...dcItem,
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
                dcItem.amount = parseFloat(dcItem.qty) * parseFloat(dcItem.rate);
                dcItem.total = parseFloat(dcItem.qty) * parseFloat(dcItem.rate);
                //console.log(dcItem);
                param.dcitem.splice(modal.index, 0, dcItem);
              }}
            >
              Done
            </Button>
          </Dialog.Actions>
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

      {/* <Portal>
                <Dialog
                    visible={false}
                    onDismiss={() => {
                        setModal(false);
                    }}
                >
                    <Dialog.Title>Pick Po</Dialog.Title>
                    <Dialog.Content>
                        
                        <ScrollView horizontal={true}>
                            <Table borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}>
                                <Row
                                    data={[
                                        "Sr No.",
                                        "Party Name",
                                        "PO Date",
                                        "PO No.",
                                        "Gaddi Name",
                                        "Gaddi Employee",
                                        "No. Of Partial",
                                        "Details Item",
                                        "Billing",
                                        "Transport",
                                        "Balance",
                                        "Remarks",
                                    ]}
                                    style={styles.head}
                                    textStyle={styles.text}
                                    widthArr={widthArr}
                                />
                                {poGrid.map((item, index) => {
                                    return (
                                        <Row
                                            key={index}
                                            data={[
                                                param.skip == 0 ? index + 1 : param.skip + index + 1,
                                                item.party,
                                                item.po_date,
                                                item.po_no,
                                                item.broker,
                                                item.emp_name,
                                                item.no_of_partial,
                                                item.details_item,
                                                item.billing,
                                                item.transport,
                                                item.balance_details,
                                                item.Remarks,
                                            ]}
                                            style={styles.row}
                                            textStyle={styles.text}
                                            widthArr={widthArr}
                                           
                                        />
                                    );
                                })}
                            </Table>
                        </ScrollView>
                        <DataTable>
                            <DataTable.Pagination
                                page={page}
                                numberOfPages={poGrid.length < 10 ? page + 1 : page + 2}
                                onPageChange={(page) => {
                                    setPage(page);
                                    param.skip = page * 10;
                                    Refresh(param);
                                }}
                            />
                        </DataTable>
                    </Dialog.Content>
                </Dialog>
            </Portal> */}
      <SafeAreaView>
        <ScrollView>
          <View style={{ padding: 20 }}>
            <View>
              <Button
                color="green"
                mode="contained"
                style={{ marginBottom: 10 }}
                onPress={() => {
                  modal.po = true;
                  setModal({ ...modal, state: true });
                  Refresh();
                }}
              >
                Pick PO
              </Button>
              <Button
                color="green"
                mode="contained"
                style={{ marginBottom: 10 }}
                onPress={() => {
                  modal.po = false;
                  setModal({ ...modal, state: true });
                  Refresh();
                }}
              >
                Pick Sales
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
                label={"Slip No."}
                value={param.dc_no}
                disabled={true}
                onChangeText={(text) => {
                  setParam({
                    ...param,
                    dc_no: text,
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
              <TextInput
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
              ></TextInput>

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

              <TextInput
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
              ></TextInput>

              <DropDownPicker
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
              />

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
                                    file_path: result.base64,
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
                                    file_path1: result.base64,
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
                                  file_path1: result.base64,
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
              {/* <Button
                color="green"
                mode="contained"
                onPress={() => {
                  SearchBarcode();
                }}
              >
                Scan
              </Button> */}
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
                  {param.dcitem.map((item, index) => {
                    Tqty = parseFloat(Tqty) + (isNaN(parseInt(item.qty)) ? 0 : parseInt(item.qty));
                    Tamt =
                      parseFloat(Tamt) + (isNaN(parseInt(item.amount)) ? 0 : parseInt(item.amount));
                    param.total_qty = Tqty;
                    param.total_amt = Tamt;
                    //console.log(item);
                    // setParam({ ...param, total_qty: Tqty, total_amt: Tamt });

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
            //console.log(param);
            postData("Transaction/InsertDC", param).then((data) => {
              setloading(false);
              if (data.valid) {
                Alert.alert("Form Save Succeessfully!!");
                navigation.navigate("kachabilllist");
              } else {
                Alert.alert(data.msg);
                //console.log(data.msg);
              }
            });
          }
        }}
      />
      <FAB
        style={styles.fabLeft}
        icon="close"
        onPress={() => {
          navigation.navigate("kachabilllist");
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

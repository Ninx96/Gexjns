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
import { FontAwesome } from "@expo/vector-icons";
import { Table, Row } from "react-native-table-component";
import { postData } from "../../_Services/Api_Service";
import { AuthContext } from "../../Components/Context";
import DropDownPicker from "react-native-dropdown-picker";
import DatePicker from "react-native-datepicker";
import SearchableDropdown from "react-native-searchable-dropdown";
import font from "../../fonts.js";
import Spinner from "react-native-loading-spinner-overlay";
import { parse } from "react-native-svg";

export default function PakkaBillForm({ route, navigation }) {
  const { tran_id } = route.params == undefined ? 0 : route.params;
  const { userId } = React.useContext(AuthContext);
  const [isloading, setloading] = React.useState(true);
  const [stateList, setStateList] = React.useState([]);
  const [companyList, setCompanyList] = React.useState([]);
  const [talllyList, setTallyList] = React.useState([]);
  const [partyList, setPartyList] = React.useState([]);

  const [modal, setModal] = React.useState({
    dc: false,
    item: false,
    tax: false,
    bill_to: false,
    ship_to: false,
    tally: false,
  });
  const [manual, setManual] = React.useState(false);
  const [taxItem, setTaxItem] = React.useState({
    dci_tran_id: "",
    description: "Jeans",
    hsn: "6203",
    barcode: "",
    qty: "0",
    rate: "0",
    amount: "0",
    dis_Per: "0",
    dis_amt: "0",
    sub_total: "0",
    tax_per: "5.00",
    sgst: "0",
    cgst: "0",
    igst: "0",
    total: "0",
  });
  const [poGrid, setPoGrid] = React.useState([]);
  const [itemGrid, setItemGrid] = React.useState([]);
  const [page, setPage] = React.useState(0);

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  today = dd + "/" + mm + "/" + yyyy;

  const [param, setParam] = React.useState({
    user_id: "",
    search: "",
    skip: "",

    tran_id: tran_id == undefined ? 0 : tran_id,
    date: today,
    invoice_no: "",
    dc_id: "",
    customer_po_no: "",
    po_date: "",
    customer: "",
    customer_id: "",
    state_id: "",
    state_code: "",
    gstin: "",
    scustomer: "",
    scustomer_id: "",
    sstate_id: "",
    sstate_code: "",
    sgstin: "",
    broker_id: "",
    broker: "",
    broker_emp_id: "",
    broker_emp: "",
    builty_no: "",
    gaddi_comm: "",
    eway_bill: "",
    gaddi: "",
    billing: "",
    transport: "",
    customer_display_name: "",
    company_id: "",
    company_state: "",
    discount: "0",
    discount_per: "",
    discount_amt: "",
    grand_total: "",
    type: "",
    stype: "",
    type_shipto: "",
    remarks: "",
    prefix: "PB",
    tally: "",
    tally_id: "",
    invoiceitem: [],
  });

  var ttl_qty = 0;
  var ttl_amt = 0;
  var ttl_tax = 0;
  var grand_total = 0;

  const taxitem = [
    { label: "0%", value: "0.00" },
    { label: "5%", value: "5.00" },
    { label: "12%", value: "12.00" },
    { label: "18%", value: "18.00" },
    { label: "28%", value: "28.00" },
  ];

  var selectAll = [];

  const widthArr = [50, 200, 100, 100, 150, 100, 100, 200, 70, 150, 60, 150];

  const Taxes = (item, serial) => {
    return (
      <Button
        mode="contained"
        color="green"
        onPress={() => {
          setTaxItem(item);
          setModal({ ...modal, tax: true, serial: serial });
          setManual(false);
        }}
      >
        Taxes
      </Button>
    );
  };

  const setTax = () => {
    var temp = [];
    if (param.state_id == param.company_state_id) {
      param.invoiceitem.map((item) => {
        var tax_amt = ((item.tax_per * item.sub_total) / 100).toFixed(2);
        temp.push({
          ...item,
          igst: "0",
          cgst: (tax_amt / 2).toString(),
          sgst: (tax_amt / 2).toString(),
        });
      });
    } else {
      param.invoiceitem.map((item) => {
        var tax_amt = ((item.tax_per * item.sub_total) / 100).toFixed(2);
        temp.push({
          ...item,
          igst: tax_amt.toString(),
          cgst: "0",
          sgst: "0",
        });
      });
    }
    param.invoiceitem = temp;
    setParam({ ...param });
  };

  React.useEffect(setTax, [param.state_id, param.company_state_id]);

  const Refresh = () => {
    postData("Transaction/PickDcInInvoice", param).then((data) => {
      setPoGrid(data);
    });
  };

  const PickDcItemInInvoice = (dc_tran_id) => {
    postData("Transaction/PickDcItemInInvoice", { tran_id: dc_tran_id }).then((data) => {
      setItemGrid(data);
      //console.log(data);
    });
  };

  React.useEffect(() => {
    userId()
      .then((data) => {
        param.user_id = data;
        Refresh();
        postData("Transaction/GetEntryNoInSales", "").then((resp) => {
          param.invoice_no = resp;
        });
        postData("StockDropdown/StateList", "").then((resp) => {
          setStateList(resp);
        });
        postData("StockDropdown/GetCompanyListDC", "").then((resp) => {
          //console.log(resp);
          setCompanyList(resp);
        });
        postData("StockDropdown/SelectBillInSales", { search: "" }).then((resp) => {
          setPartyList(resp);
        });
        postData("StockDropdown/SelectBillInSales", { search: "" }).then((resp) => {
          setTallyList(resp);
        });
      })
      .then(() => {
        if (tran_id != undefined) {
          Preview();
        } else {
          setloading(false);
        }
      });
  }, []);

  const Preview = () => {
    postData("Transaction/PreviewSalesInvoice", param).then((resp) => {
      //console.log(resp);
      setParam({
        ...param,
        tran_id: tran_id == undefined ? 0 : tran_id,
        date: resp.date,
        invoice_no: resp.invoice_no,
        customer_po_no: resp.customer_po_no,
        po_date: resp.po_date,
        dc_id: resp.dc_id,
        customer: resp.customer,
        customer_id: resp.customer_id == "" ? null : resp.company_id,
        state_id: resp.state_id == "" ? null : resp.state_id,
        gstin: resp.gstin,
        scustomer: resp.scustomer,
        scustomer_id: resp.scustomer_id == "" ? null : resp.scustomer_id,
        sstate_id: resp.sstate_id == "" ? null : resp.sstate_id,
        sgstin: resp.sgstin,
        eway_bill: resp.eway_bill,
        gaddi: resp.gaddi,
        billing: resp.billing,
        transport: resp.transport,
        grand_total: resp.grand_total,
        company_id: resp.company_id == "" ? null : resp.company_id,
        company_state: resp.company_state,
        company_state_id: resp.company_state_id,
        remarks: resp.remarks,
        prefix: resp.prefix,
        tally: resp.tally_name,
        tally_id: resp.tally_id == "" ? null : resp.tally_id,
        invoiceitem: resp.invoiceitem,
        type: resp.type,
        stype: resp.stype,
      });
      PickDcItemInInvoice(resp.dc_id);
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
          visible={modal.dc}
          onDismiss={() => {
            setModal({ ...modal, dc: false });
          }}
          style={{ height: "95%" }}
        >
          <Dialog.Title>Choose DC</Dialog.Title>
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
                poGrid.map((obj, index) => {
                  return (
                    <Card
                      key={index}
                      onPress={() => {
                        setloading(true);

                        setParam({
                          ...param,
                          company_id: obj.company_id == "" ? null : obj.company_id,
                          customer: obj.customer,
                          customer_id: obj.customer_id == "" ? null : obj.customer_id,
                          state_id: obj.state_id == "" ? null : obj.state_id,
                          gstin: obj.gstin,
                          scustomer: obj.customer,
                          scustomer_id: obj.customer_id == "" ? null : obj.customer_id,
                          sstate_id: obj.state_id == "" ? null : obj.state_id,
                          sgstin: obj.gstin,
                          customer_po_no: obj.customer_po_no,
                          po_date: obj.po_date,
                          transport: obj.transport,
                          broker: obj.broker,
                          broker_id: obj.broker_id == "" ? null : obj.broker_id,
                          builty_no: obj.builty_no,
                          remarks: obj.remarks,
                          dc_id: obj.tran_id == "" ? null : obj.tran_id,
                          type: obj.type,
                          stype: obj.type,
                          invoiceitem: [],
                        });
                        selectAll = [];
                        PickDcItemInInvoice(obj.tran_id);
                        setModal({
                          ...modal,
                          dc: false,
                        });
                        setloading(false);
                      }}
                      style={{ backgroundColor: "#f9f9f9", marginBottom: 10 }}
                    >
                      <Card.Title
                        title={obj.customer}
                        titleStyle={{ fontSize: 13, fontFamily: font.bold }}
                        subtitle={obj.dc_no + " -- " + obj.date}
                      />
                    </Card>
                  );
                })
              ) : (
                <Text> Fetching DC...</Text>
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
          <Dialog.Actions>
            <Button
              mode="contained"
              color="red"
              onPress={() => {
                setModal({ ...modal, dc: false });
              }}
            >
              Close
            </Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog
          visible={modal.tax}
          onDismiss={() => {
            setModal({ ...modal, tax: false });
          }}
        >
          <Dialog.Title>Taxes</Dialog.Title>
          <Dialog.Content>
            <ScrollView>
              <Row data={["Qty", "Rate", "Amount"]} style={styles.head} textStyle={styles.text} />
              <Row
                data={[
                  taxItem.qty,
                  <TextInput
                    value={taxItem.rate}
                    onChangeText={(text) => {
                      var amt = parseFloat(taxItem.qty) * parseFloat(text);
                      setTaxItem({
                        ...taxItem,
                        rate: text,
                        amount: amt,
                        sub_total: amt - taxItem.dis_amt,
                        total:
                          amt -
                          parseFloat(taxItem.dis_amt) +
                          parseFloat(taxItem.sgst) +
                          parseFloat(taxItem.cgst) +
                          parseFloat(taxItem.igst),
                      });
                    }}
                    style={{ marginHorizontal: 2 }}
                  ></TextInput>,
                  taxItem.amount,
                ]}
                style={styles.row}
                textStyle={styles.text}
              />
              <Row
                data={["Discount & Taxable Charges"]}
                style={styles.head}
                textStyle={styles.text}
              />
              <Row
                data={["Discount %", "Dis Amt", "Sub Total"]}
                style={styles.row}
                textStyle={styles.text}
              />
              <Row
                data={[
                  <TextInput
                    style={{ marginHorizontal: 2 }}
                    value={taxItem.dis_Per}
                    onChangeText={(text) => {
                      let dis_amt = ((taxItem.amount / 100) * text).toFixed(2);
                      var tax_amt = ((taxItem.tax_per * taxItem.sub_total) / 100).toFixed(2);
                      setTaxItem({
                        ...taxItem,
                        dis_Per: text,
                        dis_amt: dis_amt.toString(),
                        sub_total: (taxItem.amount - dis_amt).toFixed(2),
                        total: (parseFloat(taxItem.sub_total) + parseFloat(tax_amt)).toFixed(2),
                      });
                    }}
                  ></TextInput>,
                  <TextInput
                    value={taxItem.dis_amt}
                    onChangeText={(text) => {
                      let per_dis = ((text / taxItem.amount) * 100).toFixed(2);
                      var tax_amt = ((taxItem.tax_per * taxItem.sub_total) / 100).toFixed(2);
                      setTaxItem({
                        ...taxItem,
                        dis_Per: per_dis.toString(),
                        dis_amt: text,
                        sub_total: (taxItem.amount - text).toFixed(2),
                        total: (parseFloat(taxItem.sub_total) + parseFloat(tax_amt)).toFixed(2),
                      });
                    }}
                  ></TextInput>,
                  <Text style={{ alignSelf: "center" }}>{taxItem.sub_total}</Text>,
                ]}
                style={styles.row}
                textStyle={styles.text}
              />
              <Text>Taxes</Text>
              <DropDownPicker
                items={taxitem}
                placeholder="Tax %"
                style={{ backgroundColor: "#ffffff" }}
                defaultValue={taxItem.tax_per}
                itemStyle={{
                  justifyContent: "flex-start",
                }}
                dropDownMaxHeight={120}
                dropDownStyle={{ backgroundColor: "#ffffff" }}
                onChangeItem={(item) => {
                  if (param.state_id == param.company_state_id) {
                    var tax_amt = ((item.value * taxItem.sub_total) / 100).toFixed(2);
                    setTaxItem({
                      ...taxItem,
                      tax_per: item.value,
                      igst: tax_amt.toString(),
                      cgst: "0",
                      sgst: "0",
                      total: (parseFloat(taxItem.sub_total) + parseFloat(tax_amt)).toFixed(2),
                    });
                  } else {
                    var tax_amt = ((item.value * taxItem.sub_total) / 100).toFixed(2);
                    setTaxItem({
                      ...taxItem,
                      tax_per: item.value,
                      igst: "0",
                      cgst: (tax_amt / 2).toString(),
                      sgst: (tax_amt / 2).toString(),
                      total: (parseFloat(taxItem.sub_total) + parseFloat(tax_amt)).toFixed(2),
                    });
                  }
                }}
              />
              <Row data={["SGST", "CGST", "IGST"]} style={styles.row} textStyle={styles.text} />
              <Row
                data={[taxItem.sgst, taxItem.cgst, taxItem.igst]}
                style={styles.row}
                textStyle={styles.text}
              />
              <Row
                data={[
                  "Total Amt",
                  "",
                  <Text style={{ alignSelf: "center" }}>{taxItem.total}</Text>,
                ]}
                style={styles.row}
                textStyle={styles.text}
              />
            </ScrollView>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              mode="contained"
              color="green"
              onPress={() => {
                setModal({ ...modal, tax: false });
                let tmp = [];
                param.invoiceitem.map((item, index) => {
                  if (item.dci_tran_id == taxItem.dci_tran_id && index == modal.serial) {
                    tmp.push(taxItem);
                  } else {
                    tmp.push(item);
                  }
                });
                //console.log(tmp);
                setParam({ ...param, invoiceitem: tmp });
                setTaxItem({
                  dci_tran_id: "",
                  description: "Jeans",
                  hsn: "6203",
                  barcode: "",
                  qty: "0",
                  rate: "0",
                  amount: "0",
                  dis_Per: "0",
                  dis_amt: "0",
                  sub_total: "0",
                  tax_per: "5.00",
                  sgst: "0",
                  cgst: "0",
                  igst: "0",
                  total: "0",
                });
              }}
            >
              Done
            </Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog
          visible={modal.item}
          onDismiss={() => {
            setModal({
              ...modal,
              item: false,
            });
          }}
        >
          <Dialog.Title>Choose Item </Dialog.Title>
          <Dialog.Content>
            <View style={{ flexDirection: "row" }}>
              <Searchbar
                placeholder="Search"
                onIconPress={() => {
                  Refresh();
                  setPage(0);
                }}
                style={{
                  marginBottom: 10,
                  width: "80%",
                }}
                onChangeText={(text) => {
                  setParam({
                    ...param,
                    search: text,
                  });
                  //console.log(param);
                }}
              />
              <Button
                mode="text"
                compact={true}
                style={{ width: "20%" }}
                onPress={() => {
                  setloading(true);
                  param.invoiceitem = selectAll;
                  setModal({
                    ...modal,
                    item: false,
                  });
                  setloading(false);
                }}
              >
                all
              </Button>
            </View>
            <ScrollView style={{ height: 500 }}>
              {itemGrid.length > 0 ? (
                itemGrid.map((obj, index) => {
                  var amt = obj.qty * obj.rate;
                  var dis = (param.discount / 100) * amt;
                  var ttl = amt - dis + (amt - dis) / 20;
                  if (param.state_id == param.company_state_id) {
                    var i_gst = "0";
                    var c_gst = ((amt - dis) / 40).toString();
                    var s_gst = ((amt - dis) / 40).toString();
                  } else {
                    var i_gst = ((amt - dis) / 20).toString();
                    var c_gst = "0";
                    var s_gst = "0";
                  }
                  let temp = {
                    dci_tran_id: obj.tran_id,
                    description: "Jeans",
                    hsn: "6203",
                    barcode: obj.barcode,
                    qty: obj.qty,
                    rate: obj.rate,
                    amount: amt,
                    dis_Per: param.discount,
                    dis_amt: dis.toString(),
                    sub_total: amt - dis,
                    tax_per: "5.00",
                    sgst: s_gst,
                    cgst: c_gst,
                    igst: i_gst,
                    total: ttl,
                  };
                  selectAll.push(temp);

                  return (
                    <Card
                      key={index}
                      onPress={() => {
                        setloading(true);
                        param.invoiceitem.push(temp);
                        setModal({
                          ...modal,
                          item: false,
                        });
                        setloading(false);
                      }}
                      style={{ backgroundColor: "#f9f9f9", marginBottom: 10 }}
                    >
                      <Card.Title
                        title={obj.barcode}
                        titleStyle={{ fontSize: 13, fontFamily: font.bold }}
                        subtitle={obj.qty + " x " + obj.rate + " = " + obj.rate * obj.qty}
                      />
                    </Card>
                  );
                })
              ) : (
                <Text> Fetching Items...</Text>
              )}
            </ScrollView>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              mode="contained"
              color="red"
              onPress={() => {
                setModal({ ...modal, item: false });
              }}
            >
              Close
            </Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog
          visible={modal.bill_to}
          onDismiss={() => {
            setModal({ ...modal, bill_to: false });
          }}
        >
          <Dialog.Title>Select Bill to </Dialog.Title>
          <Dialog.Content>
            <SearchableDropdown
              onItemSelect={(item) => {
                //console.log(item);
                setParam({
                  ...param,
                  customer_id: item.id == "" ? null : item.id,
                  customer: item.name,
                  state_id: item.state_id == "" ? null : item.state_id,
                  state_code: item.state_code,
                  gstin: item.gstin,
                  tally_id: item.id,
                  tally: item.name,
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
                placeholder: "Search Bill To",
                underlineColorAndroid: "transparent",
                style: {
                  padding: 13,
                  borderWidth: 1,
                  borderColor: "#7b7070",
                  borderRadius: 5,
                },
                onTextChange: (text) => {
                  postData("StockDropdown/SelectBillInSales", { search: text }).then((resp) => {
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
                setModal({ ...modal, bill_to: false });
              }}
            >
              Done
            </Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog
          visible={modal.ship_to}
          onDismiss={() => {
            setModal({ ...modal, ship_to: false });
          }}
        >
          <Dialog.Title>Select Ship to </Dialog.Title>
          <Dialog.Content>
            <SearchableDropdown
              onItemSelect={(item) => {
                // console.log(item);
                setParam({
                  ...param,
                  scustomer_id: item.id == "" ? null : item.id,
                  scustomer: item.name,
                  sstate_id: item.state_id == "" ? null : item.state_id,
                  sstate_code: item.state_code,
                  sgstin: item.gstin,
                  stype: item.type,
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
                placeholder: "Search Ship To",
                underlineColorAndroid: "transparent",
                style: {
                  padding: 13,
                  borderWidth: 1,
                  borderColor: "#7b7070",
                  borderRadius: 5,
                },
                onTextChange: (text) => {
                  postData("StockDropdown/SelectBillInSales", { search: text }).then((resp) => {
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
                setModal({ ...modal, ship_to: false });
              }}
            >
              Done
            </Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog
          visible={modal.tally}
          onDismiss={() => {
            setModal({ ...modal, tally: false });
          }}
        >
          <Dialog.Title>Select Tally to </Dialog.Title>
          <Dialog.Content>
            <SearchableDropdown
              onItemSelect={(item) => {
                setParam({ ...param, tally_id: item.id, tally: item.name });
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
              items={talllyList}
              defaultIndex={2}
              resetValue={false}
              textInputProps={{
                placeholder: "Search Tally",
                underlineColorAndroid: "transparent",
                style: {
                  padding: 13,
                  borderWidth: 1,
                  borderColor: "#7b7070",
                  borderRadius: 5,
                },
                onTextChange: (text) => {
                  postData("StockDropdown/SelectBillInSales", { search: text }).then((resp) => {
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
                setModal({ ...modal, tally: false });
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
                  setModal({
                    ...modal,
                    dc: true,
                  });
                }}
              >
                Pick DC
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
                label={"Prefix"}
                value={param.prefix}
                editable={false}
                onChangeText={(text) => {
                  setParam({
                    ...param,
                    prefix: text,
                  });
                }}
              ></TextInput>

              <TextInput
                style={styles.input}
                mode="outlined"
                label={"Invoice No."}
                value={param.invoice_no}
                editable={false}
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
                label={"Customer PO No."}
                value={param.customer_po_no}
                editable={false}
              ></TextInput>

              <DatePicker
                style={{ width: "100%", marginTop: 4, marginBottom: 4 }}
                date={param.po_date}
                mode="date"
                showIcon={false}
                placeholder="Select PO Date"
                format="DD/MM/YYYY"
                editable={false}
                customStyles={{
                  dateInput: {
                    borderRadius: 5,
                    alignItems: "flex-start",
                    height: 45,
                    padding: 14,
                  },
                }}
              />

              <DropDownPicker
                items={companyList}
                placeholder="Select Company"
                style={{ backgroundColor: "#ffffff", borderColor: "grey", marginTop: 6 }}
                itemStyle={{
                  justifyContent: "flex-start",
                }}
                dropDownStyle={{ backgroundColor: "#ffffff" }}
                defaultValue={companyList.length == 0 ? "" : param.company_id}
                onChangeItem={(item) => {
                  postData(`Transaction/GetInvoiceNoInSales?company_id=${item.value}`, "").then(
                    (resp) => {
                      setParam({
                        ...param,
                        company_id: item.value,
                        company_state: item.state,
                        company_state_id: item.state_id,
                        invoice_no: resp.toString(),
                      });
                    }
                  );
                }}
              />

              <TextInput
                style={styles.input}
                mode="outlined"
                label={"State"}
                disabled={true}
                value={param.company_state}
                disabled
              ></TextInput>

              <TouchableRipple
                onPress={() => {
                  setModal({ ...modal, bill_to: true });
                }}
              >
                <TextInput
                  style={styles.input}
                  mode="outlined"
                  label={"Bill To"}
                  placeholder="Select Bill To  Customer"
                  editable={false}
                  value={param.customer}
                ></TextInput>
              </TouchableRipple>

              <TextInput
                style={styles.input}
                mode="outlined"
                label={"Bill To GSTIN"}
                value={param.gstin}
                onChangeText={(text) => {
                  setParam({
                    ...param,
                    gstin: text,
                  });
                }}
              ></TextInput>

              <DropDownPicker
                items={stateList}
                placeholder="Bill To State"
                style={{ backgroundColor: "#ffffff", borderColor: "grey", marginTop: 6 }}
                itemStyle={{
                  justifyContent: "flex-start",
                }}
                dropDownStyle={{ backgroundColor: "#ffffff" }}
                defaultValue={stateList.length == 0 ? "" : param.state_id}
                onChangeItem={(item) => {
                  //console.log(item.selected);
                  setParam({
                    ...param,
                    state_id: item.value,
                    state_code: item.state_code,
                  });
                }}
              />

              <TouchableRipple
                onPress={() => {
                  setModal({ ...modal, ship_to: true });
                }}
              >
                <TextInput
                  style={styles.input}
                  mode="outlined"
                  label={"Ship To"}
                  placeholder="Select Ship To  Customer"
                  editable={false}
                  value={param.scustomer}
                ></TextInput>
              </TouchableRipple>

              <TextInput
                style={styles.input}
                mode="outlined"
                label={"Ship To GSTIN"}
                value={param.sgstin}
                onChangeText={(text) => {
                  setParam({
                    ...param,
                    sgstin: text,
                  });
                }}
              ></TextInput>

              <DropDownPicker
                items={stateList}
                placeholder="Ship To State"
                style={{ backgroundColor: "#ffffff", marginTop: 6, borderColor: "grey" }}
                itemStyle={{
                  justifyContent: "flex-start",
                }}
                dropDownStyle={{ backgroundColor: "#ffffff" }}
                defaultValue={param.sstate_id}
                onChangeItem={(item) => {
                  setParam({
                    ...param,
                    sstate_id: item.value,
                    sstate_code: item.state_code,
                  });
                }}
              />

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
                label={"E-Way Bill No."}
                value={param.eway_bill}
                onChangeText={(text) => {
                  setParam({
                    ...param,
                    eway_bill: text,
                  });
                }}
              ></TextInput>

              <TextInput
                style={styles.input}
                mode="outlined"
                label={"Billing"}
                value={param.billing}
                onChangeText={(text) => {
                  setParam({
                    ...param,
                    billing: text,
                  });
                }}
              ></TextInput>

              <TextInput
                style={styles.input}
                mode="outlined"
                label={"Gadddi"}
                value={param.gaddi}
                onChangeText={(text) => {
                  setParam({
                    ...param,
                    gaddi: text,
                  });
                }}
              ></TextInput>

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

              <TextInput
                style={styles.input}
                mode="outlined"
                label={"Discount"}
                value={param.discount}
                onChangeText={(text) => {
                  setParam({
                    ...param,
                    discount: text,
                  });
                }}
              ></TextInput>

              <TouchableRipple
                onPress={() => {
                  setModal({ ...modal, tally: true });
                }}
              >
                <TextInput
                  style={styles.input}
                  mode="outlined"
                  label={"Tally"}
                  placeholder="Select Tally"
                  editable={false}
                  value={param.tally}
                ></TextInput>
              </TouchableRipple>
            </View>

            <View>
              <Headline style={{ alignSelf: "center", marginBottom: 6 }}>Item Details</Headline>

              <Button
                color="blue"
                mode="contained"
                onPress={() => {
                  if (param.dc_id == "") {
                    alert("Please Pick DC");
                  } else if (param.state_id == "" || param.sstate_id == "") {
                    alert("Please Fill Bill to and Shipto state");
                  } else {
                    setModal({ ...modal, item: true });
                  }
                }}
              >
                Add Item
              </Button>
              <Button
                color="green"
                mode="contained"
                onPress={() => {
                  setManual(!manual);
                }}
              >
                Add Manual
              </Button>

              {manual && (
                <View>
                  <TextInput
                    style={styles.input}
                    mode="outlined"
                    label={"Description"}
                    value={taxItem.description}
                    onChangeText={(text) => {
                      setTaxItem({
                        ...taxItem,
                        description: text,
                      });
                    }}
                  ></TextInput>
                  <TextInput
                    style={styles.input}
                    mode="outlined"
                    label={"HSN"}
                    value={taxItem.hsn}
                    onChangeText={(text) => {
                      setTaxItem({
                        ...taxItem,
                        hsn: text,
                      });
                    }}
                  ></TextInput>
                  <TextInput
                    style={styles.input}
                    mode="outlined"
                    label={"Barcode"}
                    value={taxItem.barcode}
                    onChangeText={(text) => {
                      setTaxItem({
                        ...taxItem,
                        barcode: text,
                      });
                    }}
                  ></TextInput>
                  <TextInput
                    style={styles.input}
                    mode="outlined"
                    label={"Qty"}
                    value={taxItem.qty}
                    onChangeText={(text) => {
                      setTaxItem({
                        ...taxItem,
                        qty: text,
                        amount: (taxItem.rate * text).toString(),
                        sub_total: (taxItem.rate * text).toString(),
                        total: (taxItem.qty * text + (taxItem.rate * text) / 20).toString(),
                      });
                    }}
                  ></TextInput>
                  <TextInput
                    style={styles.input}
                    mode="outlined"
                    label={"Rate"}
                    value={taxItem.rate}
                    onChangeText={(text) => {
                      setTaxItem({
                        ...taxItem,
                        rate: text,
                        amount: (taxItem.qty * text).toString(),
                        sub_total: (taxItem.qty * text).toString(),
                        total: (taxItem.qty * text + (taxItem.rate * text) / 20).toString(),
                      });
                    }}
                  ></TextInput>

                  <TextInput
                    style={styles.input}
                    mode="outlined"
                    label={"Amount"}
                    disabled={true}
                    value={taxItem.amount}
                  ></TextInput>
                  <TextInput
                    style={styles.input}
                    mode="outlined"
                    label={"Total"}
                    disabled={true}
                    value={taxItem.total}
                    onChangeText={(text) => {
                      setTaxItem({
                        ...taxItem,
                        total: text,
                      });
                    }}
                  ></TextInput>
                  <Button
                    mode="contained"
                    color="green"
                    onPress={() => {
                      param.invoiceitem.push(taxItem);
                      setParam({ ...param });
                      setTaxItem({
                        dci_tran_id: "",
                        description: "Jeans",
                        hsn: "6203",
                        barcode: "",
                        qty: "0",
                        rate: "0",
                        amount: "0",
                        dis_Per: "0",
                        dis_amt: "0",
                        sub_total: "0",
                        tax_per: "5.00",
                        sgst: "0",
                        cgst: "0",
                        igst: "0",
                        total: "0",
                      });
                    }}
                  >
                    Done
                  </Button>
                </View>
              )}
              <ScrollView horizontal={true}>
                <Table borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}>
                  <Row
                    data={[
                      "S No.",
                      "Barcode",
                      "Qty",
                      "Rate",
                      "Description",
                      "Hsn",
                      "Taxes",
                      "Amount",
                      "Total",
                      "Action",
                    ]}
                    style={styles.head}
                    textStyle={styles.text}
                    widthArr={[50, 100, 50, 100, 80, 100, 100, 100, 100, 70]}
                  />
                  {param.invoiceitem.map((item, index) => {
                    ttl_qty = ttl_qty + parseFloat(item.qty);
                    ttl_amt = ttl_amt + parseFloat(item.sub_total);
                    ttl_tax =
                      ttl_tax +
                      (isNaN(parseFloat(item.cgst)) ? 0 : parseFloat(item.cgst)) +
                      (isNaN(parseFloat(item.sgst)) ? 0 : parseFloat(item.sgst)) +
                      (isNaN(parseFloat(item.igst)) ? 0 : parseFloat(item.igst));
                    grand_total = grand_total + parseFloat(item.total);
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
                          <FontAwesome
                            name="times"
                            size={30}
                            color="red"
                            onPress={() => {
                              param.invoiceitem.splice(index, 1);
                              setParam({ ...param, discount_per: "" });
                            }}
                          />,
                        ]}
                        style={styles.row}
                        textStyle={styles.text}
                        widthArr={[50, 100, 50, 100, 80, 100, 100, 100, 100, 70]}
                      />
                    );
                  })}
                </Table>
              </ScrollView>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ alignSelf: "center", marginBottom: 6 }}>Total Qty : {ttl_qty}</Text>
              <Text style={{ alignSelf: "center", marginBottom: 6 }}>Total Amt : {ttl_amt}</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <Text style={{ alignSelf: "center", marginBottom: 6 }}>Total Tax : {ttl_tax}</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <Text style={{ alignSelf: "center", marginBottom: 6 }}>
                Grand Total : {grand_total}
              </Text>
            </View>
            <View style={{ height: 100 }}></View>
          </View>
        </ScrollView>
      </SafeAreaView>
      <FAB
        style={styles.fabRight}
        icon="check"
        onPress={() => {
          if (param.company_id == "") {
            alert("Please Fill Company Name");
          } else if (param.date == "") {
            alert("Please Select Date");
          } else {
            setloading(true);
            //console.log(param);
            postData("Transaction/InsertSalesInvoice", param).then((data) => {
              setloading(false);
              if (data.valid) {
                Alert.alert("Form Save Succeessfully!!");
                navigation.navigate("pakkabilllist");
              } else {
                Alert.alert("Error", data.msg);
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
          navigation.navigate("pakkabilllist");
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

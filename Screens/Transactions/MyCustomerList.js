import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { Table, Row } from "react-native-table-component";
import { FontAwesome } from "@expo/vector-icons";
import {
  FAB,
  Text,
  DataTable,
  Searchbar,
  ActivityIndicator,
  Button,
  Portal,
  Dialog,
  TextInput,
  Checkbox,
} from "react-native-paper";
import { postData } from "../../_Services/Api_Service";
import { AuthContext } from "../../Components/Context";
import DropDownPicker from "react-native-dropdown-picker";
import DatePicker from "react-native-datepicker";
import Spinner from "react-native-loading-spinner-overlay";
import CheckBox from "@react-native-community/checkbox";

export default function MyCustomerList({ navigation }) {
  const { userId } = React.useContext(AuthContext);

  const [visible, setVisible] = React.useState(false);
  const [isopen, setOpen] = React.useState(false);
  const [modal, setModal] = React.useState({
    customer_id: "",
    visible: false,
    payment_date: "",
    payment: "",
    gr_qty: "",
    remarks: "",
  });

  const [gridData, setGrid] = React.useState([]);
  const [paymentGridData, setPaymentGrid] = React.useState([]);
  const [companyList, setCompany] = React.useState([]);

  const [page, setPage] = React.useState(0);
  const [isloading, setloading] = React.useState(true);

  const [param, setParam] = React.useState({
    user_id: "",
    search: "",
    customer_id: "",
    date: "",
  });

  var qty = 0,
    amount = 0,
    taxes = 0,
    freight = 0,
    discount = 0,
    extra_discount = 0,
    total_amt = 0,
    payment = 0,
    final_balance = 0;

  var payment_inner = 0;

  const [checked, setChecked] = React.useState([]);
  const [checked2, setChecked2] = React.useState([]);

  const widthArr = [
    60,
    100,
    100,
    100,
    100,
    100,
    100,
    100,
    100,
    100,
    100,
    100,
    100,
    100,
    100,
    // 100,
    // 100,
    // 100,
    // 100,
    // 100,
    // 100,
    // 100,
  ];

  const widthArr2 = [100, 100, 100, 100, 100];
  const [checkall, setCheckAll] = React.useState(false);
  const [modalCheckall, setModalCheckAll] = React.useState(false);
  const HeadAction = () => {
    return (
      <CheckBox
        value={checkall}
        style={{ textAlign: "center" }}
        onValueChange={(e) => {
          setCheckAll(e);
          let newrr = [...gridData];
          if (e) {
            newrr.map((item, key) => {
              newrr[key].selected = true;
            });
          } else {
            newrr.map((item, key) => {
              newrr[key].selected = false;
            });
          }
          setGrid(newrr);
          // console.log(newrr);
        }}
      />
    );
  };

  const Action = (selected, index) => {
    return (
      <CheckBox
        value={selected}
        onValueChange={(e) => {
          let newrr = [...gridData];
          newrr[index].selected = e;
          setGrid(newrr);
          //console.log(newrr);
        }}
      />
    );
  };

  const ModalHeadAction = () => {
    return (
      <CheckBox
        value={modalCheckall}
        style={{ textAlign: "center" }}
        onValueChange={(e) => {
          setModalCheckAll(e);
          let newrr = [...paymentGridData];
          if (e) {
            newrr.map((item, key) => {
              newrr[key].selected = true;
            });
          } else {
            newrr.map((item, key) => {
              newrr[key].selected = false;
            });
          }
          setPaymentGrid(newrr);
          // console.log(newrr);
        }}
      />
    );
  };
  const Action2 = (selected, index) => {
    return (
      <CheckBox
        value={selected}
        onValueChange={(e) => {
          let newrr = [...paymentGridData];
          newrr[index].selected = e;
          setPaymentGrid(newrr);
          //console.log(newrr);
        }}
      />
    );
  };

  const Refresh = () => {
    postData("Transaction/BrowseMyCustomer", param).then((data) => {
      //console.log(data);
      setGrid(data);
    });
  };

  const Refresh2 = () => {
    postData("Transaction/BrowseMyCustomerPayment", modal).then((data) => {
      //console.log(data);
      setPaymentGrid(data);
    });
  };

  React.useEffect(() => {
    userId().then((data) => {
      param.user_id = data;
      postData("StockDropdown/SelectMyCustomer", param).then((data) => {
        //console.log(data);
        setCompany(data);
      });
      setloading(false);
    });
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Portal>
        <Dialog
          visible={modal.visible}
          onDismiss={() => {
            setModal({ ...modal, visible: false });
          }}
        >
          <Dialog.Title>Payment</Dialog.Title>
          <Dialog.Content>
            <ScrollView>
              <Button
                mode="contained"
                color="red"
                onPress={() => {
                  paymentGridData.map((item) => {
                    if (item.selected) {
                      checked2.push({ tran_id: item.tran_id, type: "" });
                    }
                  });
                  setChecked(checked2);
                  //console.log(checked2);
                  let param = {
                    chkitem: checked2,
                  };
                  postData("Transaction/DeleteMyCustomerPayment", param);
                  setChecked([]);
                  setCheckAll(false);
                  Refresh();
                }}
              >
                Hide
              </Button>
              <ScrollView horizontal={true}>
                <Table borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}>
                  <Row
                    data={["Payment Date", "Payment", "GR Qty", "Remarks", ModalHeadAction()]}
                    style={styles.head}
                    textStyle={styles.text}
                    widthArr={widthArr2}
                  />
                  {paymentGridData.map((item, index) => {
                    payment_inner = payment_inner + parseFloat(item.payment);

                    return (
                      <Row
                        key={index}
                        data={[
                          item.payment_date,
                          item.payment,
                          item.gr_qty,
                          item.remarks,
                          Action2(item.selected, index),
                        ]}
                        style={styles.row}
                        textStyle={styles.text}
                        widthArr={widthArr2}
                      />
                    );
                  })}
                  <Row
                    data={["Total", payment_inner, "", "", ""]}
                    style={styles.head}
                    textStyle={styles.text}
                    widthArr={widthArr2}
                  />
                </Table>
              </ScrollView>
              <DatePicker
                style={{ width: "100%", marginTop: 4, marginBottom: 4 }}
                mode="date"
                showIcon={false}
                placeholder="Payment Date"
                format="DD/MM/YYYY"
                customStyles={{
                  dateInput: {
                    borderRadius: 5,
                    alignItems: "flex-start",
                    height: 45,
                    padding: 14,
                  },
                }}
                onDateChange={(date) => {
                  setModal({
                    ...modal,
                    payment_date: date,
                  });
                }}
              />
              <TextInput
                style={styles.textArea}
                mode="outlined"
                label={"Payment"}
                onChangeText={(text) => {
                  setModal({ ...modal, payment: text });
                }}
              ></TextInput>
              <TextInput
                style={styles.textArea}
                mode="outlined"
                label={"GR Qty"}
                onChangeText={(text) => {
                  setModal({ ...modal, gr_qty: text });
                }}
              ></TextInput>
              <TextInput
                style={styles.textArea}
                mode="outlined"
                multiline={true}
                numberOfLines={3}
                label={"Remarks"}
                onChangeText={(text) => {
                  setModal({ ...modal, payment_date: text });
                }}
              ></TextInput>
            </ScrollView>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              color="red"
              onPress={() => {
                setModal({ ...modal, visible: false });
              }}
            >
              Cancel
            </Button>
            <Button
              color="green"
              onPress={() => {
                postData("Transaction/InsertMyCustomerPayment", modal);
                setModal({ ...modal, visible: false });
              }}
            >
              Done
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <Spinner
        visible={isloading}
        textContent={"Loading.."}
        textStyle={styles.spinnerTextStyle}
        size={"large"}
        color={"#6200ee"}
        animation={"fade"}
        textStyle={{ color: "#6200ee" }}
      />
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Searchbar
          style={{ flex: 5 }}
          placeholder="Search"
          onIconPress={() => {
            Refresh();
            setPage(0);
          }}
          onChangeText={(text) => {
            param.search = text;
            setParam({ ...param });
            Refresh();
            setPage(0);
          }}
        />

        <FontAwesome
          name="filter"
          size={40}
          color="#6200ee"
          onPress={() => {
            setVisible(!visible);
          }}
        />
      </View>

      <View style={{ overflow: "scroll" }}>
        <DropDownPicker
          placeholder="Select Party"
          itemStyle={{
            justifyContent: "flex-start",
          }}
          style={styles.dropdown}
          items={companyList}
          onChangeItem={(item) => {
            param.customer_id = item.value;
            setParam({
              ...param,
              customer_id: item.value,
            });
            modal.customer_id = item.value;
            setModal({ ...modal, customer_id: item.value });
          }}
          onOpen={() => {
            setOpen(true);
          }}
          onClose={() => {
            setOpen(false);
            Refresh();
            Refresh2();
          }}
        />

        {isopen && <View style={{ height: 150 }} />}
      </View>

      {visible && (
        <View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Button
              mode="contained"
              color="blue"
              onPress={() => {
                setModal({ ...modal, visible: true });
              }}
            >
              Payment
            </Button>

            <DatePicker
              style={{ marginTop: 4, marginBottom: 4 }}
              mode="date"
              showIcon={false}
              placeholder="Payment Date"
              format="DD/MM/YYYY"
              onDateChange={(date) => {
                setParam({
                  ...param,
                  date: date,
                });
              }}
            />

            <Button
              mode="contained"
              color="green"
              onPress={() => {
                postData("Transaction/InsertMyCustomerMarkDate", param);
              }}
            >
              Save
            </Button>
            <Button
              mode="contained"
              color="red"
              onPress={() => {
                gridData.map((item) => {
                  if (item.selected) {
                    checked.push({ tran_id: item.tran_id, type: item.mycustomer });
                  }
                });
                setChecked(checked);
                // console.log(checked);
                let param = {
                  chkitem: checked,
                };
                postData("Transaction/DeleteMyCustomer", param);
                setChecked([]);
                setCheckAll(false);
                Refresh();
              }}
            >
              Hide
            </Button>
          </View>
        </View>
      )}

      <ScrollView horizontal={true}>
        <View>
          <Table borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}>
            <Row
              data={[
                HeadAction(),
                "DC Date",
                "Local Name",
                "Qty",
                "Amount",
                "Taxes",
                "Freight",
                "Discount",
                "Extra Discount",
                "Total Amt",
                "Payment",
                "Payment Date",
                "GR Qty",
                "Comment",
                "Final Balance",
                // "Company Name",
                // "Invoice Amt",
                // "Invoice No.",
                // "Builty No.",
                // "Transport",
                // "DC No.",
                // "Remarks",
              ]}
              style={styles.head}
              textStyle={styles.text}
              widthArr={widthArr}
            />
          </Table>
          <ScrollView>
            <Table borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}>
              {gridData.map((item, index) => {
                qty = qty + parseFloat(item.qty);
                amount = amount + parseFloat(item.amount);
                taxes = taxes + parseFloat(item.taxes);
                freight = freight + parseFloat(item.freight);
                discount = discount + parseFloat(item.dis_per);
                extra_discount = extra_discount + parseFloat(item.discount);
                total_amt = total_amt + parseFloat(item.total_amt);
                payment = payment + parseFloat(item.payment);
                final_balance = final_balance + parseFloat(item.balance);
                return (
                  <Row
                    key={index}
                    data={[
                      Action(item.selected, index),
                      item.date,
                      item.mycustomer,
                      item.qty,
                      item.amount,
                      item.taxes,
                      item.freight,
                      item.dis_per,
                      item.discount,
                      item.total_amt,
                      item.payment,
                      item.payment_date,
                      item.gr_qty,
                      item.payment_remarks,
                      item.balance,
                      // item.company_namme,
                      // item.invoice_no,
                      // item.invoice_amt,
                      // item.builty_no,
                      // item.transport,
                      // item.dc_no,
                      // item.remarks,
                    ]}
                    style={styles.row}
                    textStyle={styles.text}
                    widthArr={widthArr}
                  />
                );
              })}
              <Row
                data={[
                  "Total",
                  "",
                  "",
                  qty,
                  amount,
                  taxes,
                  freight,
                  discount,
                  extra_discount,
                  total_amt,
                  payment,
                  "",
                  "",
                  "",
                  final_balance,
                  // "",
                  // "",
                  // "",
                  // "",
                  // "",
                  // "",
                  // "",
                ]}
                style={styles.head}
                textStyle={styles.text}
                widthArr={widthArr}
              />
            </Table>
          </ScrollView>
        </View>
      </ScrollView>
      {/* <DataTable>
        <DataTable.Pagination
          page={page}
          numberOfPages={gridData.length < 10 ? page + 1 : page + 2}
          onPageChange={(page) => {
            setPage(page);
            param.skip = page * 10;
            Refresh();
          }}
        />
      </DataTable> */}
    </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 16,
    left: 0,
    bottom: 0,
  },
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: "#fff" },
  header: { height: 50, backgroundColor: "#537791" },
  text: { textAlign: "center", fontWeight: "100" },
  dataWrapper: { marginTop: -1 },
  row: { height: 40 },
  head: { height: 40, backgroundColor: "#f1f8ff" },
  text: { margin: 6 },
  dropdown: {
    height: 45,
    marginTop: 4,
    marginBottom: 4,
    //borderWidth: 2,
    borderColor: "grey",
  },
});

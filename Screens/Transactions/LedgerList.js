import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image, ScrollView, FlatList } from "react-native";
import { Table, Row } from "react-native-table-component";
import { FontAwesome, EvilIcons } from "@expo/vector-icons";
import {
  FAB,
  Text,
  DataTable,
  Searchbar,
  Button,
  Portal,
  Dialog,
  TextInput,
} from "react-native-paper";
import { postData } from "../../_Services/Api_Service";
import { AuthContext } from "../../Components/Context";
import SearchableDropdown from "react-native-searchable-dropdown";
import Spinner from "react-native-loading-spinner-overlay";
import DatePicker from "react-native-datepicker";
import CheckBox from "@react-native-community/checkbox";

function LedgerList({ navigation }) {
  const { userId } = React.useContext(AuthContext);
  const [visible, setVisible] = React.useState(false);
  const [gridData, setGrid] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [isloading, setloading] = React.useState(true);
  const [ledgerList, setLedgerList] = React.useState([]);
  const [paymentGridData, setPaymentGrid] = React.useState([]);
  const [param, setParam] = React.useState({
    user_id: "",
    ledger_id: "0",
    search: "",
    skip: "0",
    from_date: "",
    to_date: "",
  });
  const [modal, setModal] = React.useState({
    tran_id: "",
    party_id: "",
    ledger_id: "",
    visible: false,
    payment_date: "",
    payment: "",
    gr_qty: "",
    remarks: "",
    user_id: "",
  });
  var payment_inner = 0;
  const itemsPerPage = gridData.length > 10 ? 10 : gridData.length;
  const widthArr2 = [100, 100, 100, 100, 100];
  const widthArr = [
    70,
    100,
    120,
    200,
    200,
    150,
    100,
    100,
    150,
    100,
    150,
    100,
    100,
    150,
    100,
    100,
    100,
    100,
    100,
    100,
    100,
  ];
  const [checkall, setCheckAll] = React.useState(false);
  const [modalCheckall, setModalCheckAll] = React.useState(false);
  const [checked, setChecked] = React.useState([]);
  const [checked2, setChecked2] = React.useState([]);
  const Action = (tran_id) => {
    return (
      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        <FontAwesome
          name="trash"
          size={30}
          color="red"
          onPress={() => {
            Alert.alert(
              "Alert",
              "Are you sure ?",
              [
                {
                  text: "No",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel",
                },
                {
                  text: "Yes",
                  onPress: () => {
                    Delete(tran_id);
                  },
                },
              ],
              { cancelable: false }
            );
          }}
        />
      </View>
    );
  };
  const Delete = (tran_id) => {
    let _param = {
      tran_id: tran_id,
    };
    setloading(true);
    postData("Transaction/DeleteLedgerPayment", _param).then((data) => {
      Refresh();
      setloading(false);
    });
  };
  const ActionChk = (selected, index) => {
    return (
      <CheckBox
        value={selected}
        onValueChange={(e) => {
          let newrr = [...gridData];
          newrr[index].selected = e;
          setGrid(newrr);
          console.log(newrr);
        }}
      />
    );
  };
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
          console.log(newrr);
        }}
      />
    );
  };
  const Refresh = () => {
    postData("Transaction/BrowseTransactionLedger", param).then((data) => {
      setGrid(data);
      setloading(false);
    });
  };
  const Refresh2 = () => {
    let param = {
      ledger_id: modal.ledger_id,
      user_id: 1,
    };
    postData("Transaction/GetLedgerPaymentList", param).then((data) => {
      setPaymentGrid(data);
    });
  };

  React.useEffect(() => {
    userId().then((data) => {
      param.user_id = data;
      modal.user_id = data;
      postData("StockDashboard/PreviewDateFilter", param).then((data) => {
        //console.log(data);
        param.from_date = data.from_date;
        param.to_date = data.to_date;
      });
    });
    setloading(false);
  }, []);
  const SearchLedgerList = (search) => {
    let _param = {
      user_id: param.user_id,
      search: search,
    };
    postData("StockDropdown/GetLedgerList", _param).then((resp) => {
      setLedgerList(resp);
    });
  };

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
                  postData("Transaction/UpdateLedgerHide", param);
                  setChecked([]);
                  setCheckAll(false);
                  Refresh();
                  Refresh2();
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
                postData("Transaction/InsertLedgerPayment", modal);
                setModal({ ...modal, visible: false });
              }}
            >
              Done
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Searchbar
          style={{ flex: 10 }}
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

      {visible && (
        <View style={{ overflow: "scroll" }}>
          <SearchableDropdown
            onItemSelect={(item) => {
              //setParam({ ...param, ledger_id: item.id });
              param.ledger_id = item.id;
              modal.ledger_id = item.id;
              Refresh();
              Refresh2();
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
            items={ledgerList}
            defaultIndex={2}
            resetValue={false}
            textInputProps={{
              placeholder: "Search Ledger Name",
              underlineColorAndroid: "transparent",
              style: { padding: 13, borderWidth: 1, borderColor: "#7b7070", borderRadius: 5 },
              onTextChange: (text) => SearchLedgerList(text),
            }}
            listProps={{
              nestedScrollEnabled: true,
            }}
          />
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Button
              mode="contained"
              color="blue"
              onPress={() => {
                if (param.ledger_id != "") {
                  navigation.navigate("ledgerform", { ledger_id: param.ledger_id });
                }
              }}
            >
              Opening Bal
            </Button>
            <Button
              mode="contained"
              color="red"
              onPress={() => {
                gridData.map((item) => {
                  if (item.selected) {
                    checked.push({ tran_id: item.tran_id, type: item.hide_type });
                  }
                });
                setChecked(checked);
                // console.log(checked);
                let param = {
                  ledgerchkitem: checked,
                };
                postData("Transaction/UpdateLedgerHide", param);
                setChecked([]);
                setCheckAll(false);
                Refresh();
              }}
            >
              Hide
            </Button>
            <Button
              mode="contained"
              color="blue"
              onPress={() => {
                setModal({ ...modal, visible: true });
              }}
            >
              Payment
            </Button>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <DatePicker
              style={{ marginTop: 4, marginBottom: 4 }}
              date={param.from_date}
              mode="date"
              showIcon={false}
              placeholder="From Date"
              format="DD/MM/YYYY"
              onDateChange={(date) => {
                setParam({
                  ...param,
                  from_date: date,
                });
              }}
            />

            <DatePicker
              style={{ marginTop: 4, marginBottom: 4 }}
              date={param.to_date}
              mode="date"
              showIcon={false}
              placeholder="To Date"
              format="DD/MM/YYYY"
              onDateChange={(date) => {
                setParam({
                  ...param,
                  to_date: date,
                });
              }}
            />
            <EvilIcons
              name="arrow-right"
              size={40}
              color="#6200ee"
              onPress={() => {
                postData("StockDashboard/DateRangeFilter", param);
                Refresh(param);
              }}
            />
          </View>
        </View>
      )}

      <ScrollView horizontal={true}>
        <View>
          <Table borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}>
            <Row
              data={[
                HeadAction(),
                "Date",
                "Ledger Name",
                "Mode",
                "Lot No.",
                "Receive",
                "Short",
                "Excess",
                "Rate",
                "Taxes",
                "Amount",
                "Payment",
                "Gr Issue",
                "Gr Receive",
                "Payment Remarks",
                "Final Balance",
                "Created By",
                "Created On",
                "Edit By",
                "Edit On",
                "Action",
              ]}
              style={styles.head}
              textStyle={styles.text}
              widthArr={widthArr}
            />
          </Table>
          {/* {gridData.map((item, index) => {
            return (
              <Row
                key={index}
                data={[
                  ActionChk(item.selected, index),
                  item.date,
                  item.ledger_name,
                  item.mode,
                  item.comment,
                  item.receive,
                  item.shortage,
                  item.excess,
                  item.rate,
                  item.tax,
                  item.amount,
                  item.payment,
                  item.gr_issue,
                  item.gr_receive,
                  item.payment_remarks,
                  item.final_balance,
                  item.created_by,
                  item.created_on,
                  item.edit_by,
                  item.edit_on,
                  Action(item.tran_id),
                ]}
                style={styles.row}
                textStyle={styles.text}
                widthArr={widthArr}
              />
            );
          })} */}
          <FlatList
            data={gridData}
            getItemLayout={(data, index) => ({ length: 55, offset: 55 * index, index })}
            initialNumToRender={5}
            renderItem={({ item, index }) => (
              <Table borderStyle={{ borderWidth: 1, borderColor: "#c8e1ff" }}>
                <Row
                  key={index}
                  data={[
                    ActionChk(item.selected, index),
                    item.date,
                    item.ledger_name,
                    item.mode,
                    item.comment,
                    item.receive,
                    item.shortage,
                    item.excess,
                    item.rate,
                    item.tax,
                    item.amount,
                    item.payment,
                    item.gr_issue,
                    item.gr_receive,
                    item.payment_remarks,
                    item.final_balance,
                    item.created_by,
                    item.created_on,
                    item.edit_by,
                    item.edit_on,
                    Action(item.tran_id),
                  ]}
                  style={styles.row}
                  textStyle={styles.text}
                  widthArr={widthArr}
                />
              </Table>
            )}
            keyExtractor={(item) => item.tran_id}
          />
        </View>
      </ScrollView>
      {/* <DataTable>
        <DataTable.Pagination
          page={page}
          numberOfPages={itemsPerPage <= 10 ? page + 1 : page + 2}
          onPageChange={(page) => {
            setPage(page);
            let temp = param;
            temp.skip = page * 10;
            Refresh(temp);
          }}
        />
      </DataTable> */}

      {/* <FAB
                style={styles.fab}
                icon="plus"
                onPress={() => {
                    navigation.navigate("ledgerform");
                }}
            /> */}
    </View>
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
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: "#fff" },
  header: { height: 50, backgroundColor: "#537791" },
  text: { textAlign: "center", fontWeight: "100" },
  dataWrapper: { marginTop: -1 },
  row: { height: 55 },
  head: { height: 55, backgroundColor: "#f1f8ff" },
  text: { margin: 6 },
});

export default LedgerList;

import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, SafeAreaView } from "react-native";
import { Table, Row } from "react-native-table-component";

import { FontAwesome, EvilIcons } from "@expo/vector-icons";
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
} from "react-native-paper";
import { postData } from "../../_Services/Api_Service";
import { AuthContext } from "../../Components/Context";
import DropDownPicker from "react-native-dropdown-picker";
import SearchableDropdown from "react-native-searchable-dropdown";
import DatePicker from "react-native-datepicker";
import Spinner from "react-native-loading-spinner-overlay";
export default function Tally({ navigation }) {
  const { userId } = React.useContext(AuthContext);

  const [visible, setVisible] = React.useState(false);
  const [isopen, setOpen] = React.useState(false);

  const [gridData, setGrid] = React.useState([]);
  const [contactList, setContact] = React.useState([]);
  const [companyList, setCompany] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [isloading, setloading] = React.useState(true);

  const [param, setParam] = React.useState({
    user_id: "",
    search: "",
    skip: "",
    contact_id: "",
    type: "",
    company_id: "",
    from_date: "",
    to_date: "",
  });

  const TypeList = [
    { label: "Purchaser Party", value: "Purchaser Party" },
    { label: "Saler Party", value: "Saler Party" },
    { label: "Expense", value: "Expense" },
  ];

  var totals = {
    bill: 0,
    sgst: 0,
    cgst: 0,
    igst: 0,
    debit: 0,
    credit: 0,
  };

  const widthArr = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100];

  const Refresh = () => {
    postData("Reports/BrowseReportTally", param).then((data) => {
      //console.log(data);
      setGrid(data);
      setloading(false);
    });
  };

  React.useEffect(() => {
    totals = {
      bill: 0,
      sgst: 0,
      cgst: 0,
      igst: 0,
      debit: 0,
      credit: 0,
    };
  }, [param]);

  React.useEffect(() => {
    userId().then((data) => {
      param.user_id = data;
      postData("StockDashboard/PreviewDateFilter", param).then((data) => {
        //console.log(data);
        param.from_date = data.from_date;
        param.to_date = data.to_date;
      });
    });
    postData("StockDropdown/GetContactList", param).then((data) => {
      //console.log(data);
      setContact(data);
    });
    postData("StockDropdown/GetCompanyList", param).then((data) => {
      //console.log(data);
      setCompany(data);
    });

    navigation.addListener("focus", () => {
      setTimeout(() => {
        Refresh();
      }, 1000);
    });
  }, []);

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
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Searchbar
          style={{ flex: 10 }}
          placeholder="Search"
          onIconPress={() => {
            Refresh();
            setPage(0);
          }}
          onChangeText={(text) => {
            setParam({
              ...param,
              search: text,
            });
            Refresh();
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
          <DropDownPicker
            placeholder="Select Type"
            itemStyle={{
              justifyContent: "flex-start",
            }}
            style={styles.dropdown}
            items={TypeList}
            onChangeItem={(item) => {
              setParam({
                ...param,
                type: item.value,
              });
              Refresh();
            }}
          />

          <SearchableDropdown
            onItemSelect={(item) => {
              setParam({ ...param, contact_id: item.id });
              Refresh();
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
            items={contactList}
            defaultIndex={2}
            resetValue={false}
            textInputProps={{
              placeholder: "Search Contact",
              underlineColorAndroid: "transparent",
              style: {
                padding: 13,
                borderWidth: 1,
                borderColor: "#7b7070",
                borderRadius: 5,
              },
              onTextChange: (text) => {},
            }}
            listProps={{
              nestedScrollEnabled: true,
            }}
          />

          <DropDownPicker
            placeholder="Select Company"
            itemStyle={{
              justifyContent: "flex-start",
            }}
            style={styles.dropdown}
            items={companyList}
            onChangeItem={(item) => {
              setParam({
                ...param,
                company_id: item.value,
              });
              Refresh();
            }}
            onOpen={() => {
              setOpen(true);
            }}
            onClose={() => {
              setOpen(false);
            }}
          />

          {isopen && <View style={{ height: 150 }} />}
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
                Refresh();
              }}
            />
          </View>
        </View>
      )}

      <ScrollView horizontal={true}>
        <Table borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}>
          <Row
            data={[
              "Date",
              "Particular",
              "Type",
              "Bill",
              "SGST",
              "CGST",
              "IGST",
              "Invoice No.",
              "Debit",
              "Credit",
              "Balance",
              "Remarks",
            ]}
            style={styles.head}
            textStyle={styles.text}
            widthArr={widthArr}
          />
          {gridData.map((item, index) => {
            totals.bill += parseFloat(item.bill);
            totals.sgst += parseFloat(item.sgst);
            totals.cgst += parseFloat(item.cgst);
            totals.igst += parseFloat(item.igst);
            totals.debit += parseFloat(item.debit);
            totals.credit += parseFloat(item.credit);
            return (
              <Row
                key={index}
                data={[
                  item.date,
                  item.particular,
                  item.type,
                  item.bill,
                  item.sgst,
                  item.cgst,
                  item.igst,
                  item.invoice_no,
                  item.debit,
                  item.credit,
                  item.balance,
                  item.remarks,
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
              totals.bill,
              totals.sgst,
              totals.cgst,
              totals.igst,
              "",
              totals.debit,
              totals.credit,
              "",
              "",
            ]}
            style={styles.row}
            textStyle={styles.text}
            widthArr={widthArr}
          />
        </Table>
      </ScrollView>
      <DataTable>
        <DataTable.Pagination
          page={page}
          numberOfPages={gridData.length < 10 ? page + 1 : page + 2}
          onPageChange={(page) => {
            setPage(page);
            param.skip = page * 10;
            Refresh(param);
          }}
        />
      </DataTable>
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

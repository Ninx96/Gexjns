import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image, ScrollView, ListView, Alert, FlatList } from "react-native";
import { Table, Row } from "react-native-table-component";
import { FontAwesome, EvilIcons } from "@expo/vector-icons";
import {
  FAB,
  Text,
  DataTable,
  Searchbar,
  ActivityIndicator,
  Button,
  TextInput,
} from "react-native-paper";
import { postData } from "../../_Services/Api_Service";
import { AuthContext } from "../../Components/Context";

import DropDownPicker from "react-native-dropdown-picker";
import DatePicker from "react-native-datepicker";

import Spinner from "react-native-loading-spinner-overlay";

function PakkaBillList({ navigation }) {
  const { userId } = React.useContext(AuthContext);

  const [gridData, setGrid] = React.useState([]);
  const [companyList, setCompany] = React.useState([]);

  const [isloading, setloading] = React.useState(true);

  const [visible, setVisible] = React.useState(false);
  const [isopen, setOpen] = React.useState(false);

  const [param, setParam] = React.useState({
    user_id: "",
    search: "",
    skip: "0",
    company_id: "",
    amount: "0",
    from_date: "",
    to_date: "",
  });

  const widthArr = [50, 100, 200, 200, 150, 100, 140, 100, 150, 120, 200, 200, 100, 150];

  const RenderItem = ({ item, index }) => (
    <Table borderStyle={{ borderWidth: 1, borderColor: "#c8e1ff" }}>
      <Row
        key={index}
        data={[
          index + 1,
          item.date,
          item.company_name,
          item.customer,
          item.broker,
          item.invoice_no,
          ActionDC(item.dc_id, item.dc_no, item.customer),
          item.dc_date,
          item.gstin,
          item.bill,
          item.remarks,
          item.tally_name,
          item.created_by,
          Action(item.tran_id),
        ]}
        style={styles.row}
        textStyle={styles.text}
        widthArr={widthArr}
      />
    </Table>
  );

  const ActionDC = (dc_id, dc_no, party) => {
    return (
      <Button
        mode="contained"
        color="green"
        compact={true}
        onPress={() => {
          navigation.navigate("rptdc", { tran_id: dc_id, party: party, dc_no: dc_no });
        }}
      >
        {dc_no}
      </Button>
    );
  };
  const Action = (tran_id) => {
    return (
      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        <FontAwesome
          name="edit"
          size={30}
          onPress={() => {
            navigation.navigate("pakkabillform", { tran_id: tran_id });
          }}
          color="green"
        />

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
        <FontAwesome
          name="file"
          size={30}
          color="black"
          onPress={() => {
            navigation.navigate("rptsales", { invoice_id: tran_id });
          }}
        />
      </View>
    );
  };
  const Delete = (tran_id) => {
    let _param = {
      tran_id: tran_id,
      user_id: param.user_id,
    };
    setloading(true);
    postData("Transaction/DeleteSalesInvoice", _param).then((data) => {
      Refresh();
      setloading(false);
    });
  };

  const Refresh = () => {
    postData("Transaction/BrowseSalesInvoice", param).then((data) => {
      // console.log(data);
      setGrid(data);
      setloading(false);
    });
  };

  React.useEffect(() => {
    userId().then((data) => {
      param.user_id = data;
      postData("StockDropdown/GetCompanyList", param).then((data) => {
        //console.log(data);
        setCompany(data);
      });
      postData("StockDashboard/PreviewDateFilter", param).then((data) => {
        //console.log(data);
        param.from_date = data.from_date;
        param.to_date = data.to_date;
      });
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
            Refresh(param);
          }}
          onChangeText={(text) => {
            param.search = text;
            setParam({ ...param });
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
          <TextInput
            style={styles.input}
            mode="outlined"
            label={"Amount"}
            value={param.amount}
            onChangeText={(text) => {
              setParam({
                ...param,
                amount: text,
              });
            }}
          ></TextInput>
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
            }}
            onOpen={() => {
              setOpen(true);
            }}
            onClose={() => {
              setOpen(false);
            }}
          />
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
          {isopen && <View style={{ height: 150 }} />}
        </View>
      )}
      <ScrollView horizontal={true}>
        <View>
          <Table borderStyle={{ borderWidth: 1, borderColor: "#c8e1ff" }}>
            <Row
              data={[
                "S No",
                "Date",
                "Company Name",
                "Party",
                "Gaddi Name",
                "Invoice No",
                "Dc No",
                "Dc Date",
                "Gstin",
                "Bill",
                "Remarks",
                "Tally Name",
                "Created By",
                "Action",
              ]}
              style={styles.head}
              textStyle={styles.text}
              widthArr={widthArr}
            />
          </Table>

          <FlatList
            data={gridData}
            getItemLayout={(data, index) => ({ length: 55, offset: 55 * index, index })}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            renderItem={RenderItem}
            keyExtractor={(item) => item.tran_id}
          />
        </View>
      </ScrollView>

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => {
          navigation.navigate("pakkabillform");
        }}
      />
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
  input: {
    height: 45,
    marginTop: 4,
    marginBottom: 4,
  },
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: "#fff" },
  header: { height: 50, backgroundColor: "#537791" },
  text: { textAlign: "center", fontWeight: "100" },
  dataWrapper: { marginTop: -1 },
  row: { height: 55 },
  head: { height: 55, backgroundColor: "#f1f8ff" },
  text: { margin: 6 },
});

export default PakkaBillList;

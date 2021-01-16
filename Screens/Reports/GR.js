import React, { useState, useEffect } from "react";
import {  StyleSheet,  View,  ScrollView,  SafeAreaView,  Dimensions,} from "react-native";
import { Table, Row } from "react-native-table-component";
import { FontAwesome, EvilIcons } from "@expo/vector-icons";
import {  FAB,  Text,  DataTable,  Searchbar,  ActivityIndicator,  Button,  Portal,  Dialog,  TextInput,  Divider,} from "react-native-paper";
import { postData } from "../../_Services/Api_Service";
import { AuthContext } from "../../Components/Context";
import DatePicker from "react-native-datepicker";
import Spinner from "react-native-loading-spinner-overlay";
export default function GR({ navigation }) {
  const { userId } = React.useContext(AuthContext);

  const [visible, setVisible] = React.useState(false);
  const [modal, setModal] = React.useState({ tran_id: "", visible: false });

  const [gridData, setGrid] = React.useState([]);

  const [page, setPage] = React.useState(0);
  const [isloading, setloading] = React.useState(true);

  const [param, setParam] = React.useState({
    user_id: "",
    search: "",
    barcode: "",
    skip: "",
    from_date: "",
    to_date: "",
  });

  const widthArr = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100];

  const Refresh = (arg) => {
    postData("Reports/BrowseReportGR", arg).then((data) => {
      //console.log(data);
      setGrid(data);
      setloading(false);
    });
  };

  const Action = (tran_id) => {
    return (
      <Button
        onPress={() => {
          setModal({ tran_id: tran_id, visible: true });
        }}
      >
        Update
      </Button>
    );
  };

  React.useEffect(() => {
    userId().then((data) => {
      param.user_id = data;
      postData("StockDashboard/PreviewDateFilter", param).then((data) => {
        //console.log(data);
        param.from_date = data.from_date;
        param.to_date = data.to_date;
      });
      Refresh(param);
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
      <Portal>
        <Dialog
          visible={modal.visible}
          onDismiss={() => {
            setModal({ ...modal, visible: false });
          }}
        >
          <Dialog.Title>Update Remarks</Dialog.Title>
          <Dialog.Content>
            <TextInput
              style={styles.textArea}
              multiline={true}
              numberOfLines={5}
              mode="outlined"
              label={"Remarks"}
              onChangeText={(text) => { }}
            ></TextInput>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => {
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
            Refresh(param);
            setPage(0);
          }}
          onChangeText={(text) => {
            setParam({
              ...param,
              search: text,
            });
            //console.log(param);
          }}
        />
        <FontAwesome name="filter" size={40} color="#6200ee" onPress={() => {
          setVisible(!visible);
        }} />
      </View>

      {visible && (
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
          <EvilIcons name="arrow-right" size={40} color="#6200ee" onPress={() => {
            postData("StockDashboard/DateRangeFilter", param);
            Refresh(param);
          }} />
        </View>
      )}

      <ScrollView horizontal={true}>
        <Table borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}>
          <Row
            data={[
              "Date",
              "Challan No.",
              "Party",
              "Mode of GR",
              "Item",
              "Issue",
              "Receive",
              "Balance",
              "Amount",
              "Remarks",
              "Action",
            ]}
            style={styles.head}
            textStyle={styles.text}
            widthArr={widthArr}
          />
          {gridData.map((item, index) => {
            return (
              <Row
                key={index}
                data={[
                  item.date,
                  item.challan_no,
                  item.company_name,
                  item.mode_of_gr,
                  item.item,
                  item.issue,
                  item.receive,
                  item.balance,
                  item.amount,
                  item.remarks,
                  Action(item.tran_id),
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

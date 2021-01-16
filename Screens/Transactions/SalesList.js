import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image, ScrollView, Alert, FlatList } from "react-native";
import { Table, Row } from "react-native-table-component";
import { FontAwesome, EvilIcons } from "@expo/vector-icons";
import { FAB, Text, DataTable, Searchbar, Button } from "react-native-paper";
import { postData } from "../../_Services/Api_Service";
import { AuthContext } from "../../Components/Context";
import Spinner from "react-native-loading-spinner-overlay";
import DatePicker from "react-native-datepicker";

import * as Print from "expo-print";

function SalesList({ navigation }) {
  const { userId } = React.useContext(AuthContext);
  const [visible, setVisible] = React.useState(false);
  const [gridData, setGrid] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [isloading, setloading] = React.useState(true);

  const [param, setParam] = React.useState({
    user_id: "",
    ledger_id: "0",
    search: "",
    skip: "0",
    from_date: "",
    to_date: "",
  });

  const itemsPerPage = gridData.length > 10 ? 10 : gridData.length;
  const from = page * itemsPerPage;
  const to = (page + 1) * itemsPerPage;

  const widthArr = [50, 100, 100, 200, 80, 80, 150, 150, 120];
  const img = (file_path) => {
    return (
      <Image
        source={{
          uri: `https://musicstore.quickgst.in/Attachment_Img/PackingSlipImage1/${file_path}`,
        }}
        style={{ width: 120, height: 60 }}
      />
    );
  };

  const Action = (tran_id) => {
    return (
      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        <FontAwesome
          name="edit"
          size={30}
          color="green"
          onPress={() => {
            navigation.navigate("salesform", { tran_id: tran_id });
          }}
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
            navigation.navigate("rptpackingslip", { tran_id: tran_id });
            // Print.printAsync({
            //   uri: `https://musicstore.quickgst.in/App_Rtp/RptPackingSlip.aspx?tran_id=${tran_id}`,
            // });
          }}
        />
      </View>
    );
  };

  const Delete = (tran_id) => {
    let _param = {
      user_id: param.user_id,
      tran_id: tran_id,
    };
    setloading(true);
    postData("Transaction/DeleteSalesPackingSlip", _param).then((data) => {
      Refresh();
      setloading(false);
    });
  };

  const Refresh = () => {
    postData("Transaction/BrowseSalePackingSlip", param).then((data) => {
      setGrid(data);
      setloading(false);
    });
  };

  React.useEffect(() => {
    userId().then((data) => {
      param.user_id = data;
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
                "Sr No",
                "Date",
                "PS No",
                "Local Name",
                "Gaddi",
                "Qty",
                "Remarks",
                "Created By",
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
                  index + 1,
                  item.date,
                  item.packing_slip_no,
                  item.customer,
                  item.broker,
                  item.qty,
                  item.remarks,
                  // img(item.attachment),
                  item.created_by,
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
                    index + 1,
                    item.date,
                    item.packing_slip_no,
                    item.customer,
                    item.broker,
                    item.qty,
                    item.remarks,
                    // img(item.attachment),
                    item.created_by,
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
      <DataTable>
        <DataTable.Pagination
          page={page}
          numberOfPages={itemsPerPage < 10 ? page + 1 : page + 2}
          onPageChange={(page) => {
            setPage(page);
            param.skip = page * 10;
            Refresh();
          }}
        />
      </DataTable>

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => {
          navigation.navigate("salesform");
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
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: "#fff" },
  header: { height: 50, backgroundColor: "#537791" },
  text: { textAlign: "center", fontWeight: "100" },
  dataWrapper: { marginTop: -1 },
  row: { height: 55 },
  head: { height: 55, backgroundColor: "#f1f8ff" },
  text: { margin: 6 },
});

export default SalesList;

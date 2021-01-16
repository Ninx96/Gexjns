import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, SafeAreaView } from "react-native";
import { Table, Row } from "react-native-table-component";
import Spinner from "react-native-loading-spinner-overlay";
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

export default function DC({ navigation }) {
  const { userId } = React.useContext(AuthContext);

  const [visible, setVisible] = React.useState(false);

  const [gridData, setGrid] = React.useState([]);
  const [modal, setModal] = React.useState({ tran_id: "", visible: false, remarks: "" });
  const [page, setPage] = React.useState(0);
  const [isloading, setloading] = React.useState(true);

  const [param, setParam] = React.useState({
    user_id: "",
    search: "",
    barcode: "",
    skip: "",
  });

  const widthArr = [100, 120, 150, 120, 150, 100, 100, 150, 100];

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

  const Refresh = () => {
    postData("Reports/BrowseReportMyDC", param).then((data) => {
      //console.log(data);
      setGrid(data);
      setloading(false);
    });
  };

  React.useEffect(() => {
    userId().then((data) => {
      param.user_id = data;
    });

    Refresh();
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
              value={modal.remarks}
              onChangeText={(text) => {
                setModal({ ...modal, remarks: text });
              }}
            ></TextInput>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => {
                postData("Reports/UpdateDCRemarks", { remarks: modal.remarks });
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
        <View>
          <TextInput
            style={styles.input}
            mode="outlined"
            label={"Barcode"}
            onChangeText={(text) => {
              setParam({
                ...param,
                barcode: text,
              });
              Refresh();
            }}
          />
        </View>
      )}

      <ScrollView horizontal={true}>
        <Table borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}>
          <Row
            data={[
              "Date",
              "DC No.",
              "Customer",
              "Gaddi Name",
              "Employee Name",
              "Qty",
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
                  item.dc_no,
                  item.customer,
                  item.gaddi_name,
                  item.emp_name,
                  item.qty,
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
            Refresh();
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

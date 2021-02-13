import React from "react";
import { StyleSheet, View, Image, ScrollView, Modal, Alert } from "react-native";
import { FontAwesome, EvilIcons } from "@expo/vector-icons";
import {
  FAB,
  Text,
  DataTable,
  Searchbar,
  Button,
  TouchableRipple,
  Dialog,
  Portal,
  TextInput,
} from "react-native-paper";
import { Table, Row } from "react-native-table-component";
import { postData } from "../_Services/Api_Service";
import { AuthContext } from "../Components/Context";
import font from "../fonts.js";
import DatePicker from "react-native-datepicker";
import Spinner from "react-native-loading-spinner-overlay";
import DropDownPicker from "react-native-dropdown-picker";
function PaymentList({ navigation }) {
  const { userId } = React.useContext(AuthContext);
  const [gridData, setGrid] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [isloading, setloading] = React.useState(true);

  const [param, setParam] = React.useState({
    user_id: "",
    search: "",
    skip: 0,
    from_date: "",
    to_date: "",
  });
  const itemsPerPage = gridData.length > 10 ? 10 : gridData.length;

  const widthArr = [50, 100, 150, 150, 80, 150, 80];

  const Action = (payment_id) => {
    return (
      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        <FontAwesome
          name="edit"
          size={30}
          onPress={() => {
            navigation.navigate("paymentform", { payment_id: payment_id });
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
                    Delete(payment_id);
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

  const Refresh = () => {
    setloading(true);
    postData("Transaction/BrowsePayment", param).then((data) => {
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

  const Delete = (payment_id) => {
    let _param = {
      user_id: param.user_id,
      payment_id: payment_id,
    };
    setloading(true);
    postData("Transaction/DeletePayment", _param).then((data) => {
      Refresh();
      setloading(false);
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
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Searchbar
          style={{ flex: 8 }}
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
      </View>

      <ScrollView horizontal={true}>
        <Table borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}>
          <Row
            data={["Sr No", "Date", "From Party.", "To Party", "Amount", "Remarks", "Action"]}
            style={styles.head}
            textStyle={styles.text}
            widthArr={widthArr}
          />

          {gridData.map((item, index) => {
            return (
              <Row
                key={index}
                data={[
                  index + 1,
                  item.date,
                  item.from_party,
                  item.to_party,
                  item.amount,
                  item.remarks,
                  Action(item.payment_id),
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
          navigation.navigate("paymentform");
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
  row: { height: 40 },
  head: { height: 40, backgroundColor: "#f1f8ff" },
  text: { margin: 6 },
  listContent: {
    fontFamily: font.medium,
    fontSize: 14,
    marginRight: 10,
  },

  listContentBox: {
    display: "flex",
    marginVertical: 3,
  },
  spinnerTextStyle: {
    color: "#FFF",
  },
});

export default PaymentList;

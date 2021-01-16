import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Button,
  Image,
  ScrollView,
  ListView,
} from "react-native";
import { Table, Row } from "react-native-table-component";
import { FontAwesome } from "@expo/vector-icons";
import {
  FAB,
  Text,
  DataTable,
  Searchbar,
  ActivityIndicator,
} from "react-native-paper";
import { postData } from "../../_Services/Api_Service";
import { AuthContext } from "../../Components/Context";
import DropDownPicker from "react-native-dropdown-picker";
import Spinner from "react-native-loading-spinner-overlay";
function UserList({ navigation }) {
  const { userId } = React.useContext(AuthContext);

  const [gridData, setGrid] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [isloading, setloading] = React.useState(true);
  const [param, setParam] = React.useState({
    user_id: "",
    type_id: "",
    search: "",
    skip: "0",
  });

  

  const widthArr = [150, 100, 200, 100];

  const Action = (user_id) => {
    return (
      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        <FontAwesome
          name="edit"
          size={30}
          color="green"
          onPress={() => {
            navigation.navigate("userform", { muser_id: user_id });
          }}
        />
        {/* <FontAwesome name="trash" size={24} color="red" onPress={() => { Delete(muser_id); }} /> */}
      </View>
    );
  };

  const Refresh = () => {
    postData("Masters/BrowseUser", param).then((data) => {
      setGrid(data);
      setloading(false);
    });
  };

  React.useEffect(() => {
    userId().then((data) => {
      setParam({
        ...param,
        user_id: data,
      });
    });
    navigation.addListener("focus", () => {
      Refresh();
    });
  }, []);

  const Delete = (muser_id) => {
    let _param = {
      user_id: param.user_id,
      muser_id: muser_id,
    };
    setloading(true);
    postData("Masters/DeleteUser", _param).then((data) => {
      Refresh(param);
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
      <Searchbar
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
      <ScrollView horizontal={true}>
        <Table borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}>
          <Row
            data={["Full Name", "Mobile", "Email", "Action"]}
            style={styles.head}
            textStyle={styles.text}
            widthArr={widthArr}
          />
          {gridData.map((item, index) => {
            return (
              <Row
                key={index}
                data={[
                  item.full_name,
                  item.mobile,
                  item.email,
                  Action(item.user_id),
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

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => {
          navigation.navigate("userform");
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
  spinnerTextStyle: {
    color: "#FFF",
  },
});

export default UserList;

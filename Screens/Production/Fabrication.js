import React from "react";
import { Button } from "react-native-paper";
import { View, ScrollView, StyleSheet, Alert, FlatList } from "react-native";
import { Table, Row } from "react-native-table-component";
import { postData } from "../../_Services/Api_Service";
import Spinner from "react-native-loading-spinner-overlay";
import font from "../../fonts.js";
import { AuthContext } from "../../Components/Context";

export default function Fabrication({ route, navigation }) {
  const { userId } = React.useContext(AuthContext);
  const [isloading, setloading] = React.useState(true);
  const [gridData, setGrid] = React.useState([]);
  const [param, setParam] = React.useState({
    user_id: "",
    search: "",
    process_id: "13",
    check_all: false,
  });

  const widthArr = [100, 100, 80, 180, 100, 100, 100, 100, 100, 100, 100, 100];

  const RenderItem = ({ item, index }) => (
    <Table borderStyle={{ borderWidth: 1, borderColor: "#c8e1ff" }}>
      <Row
        key={index}
        data={[
          //index + 1,
          item.issue_date,
          item.issue_to,
          item.qty,
          Action(item.tran_id, item.issueto_id, item.issue_to, item.hala, item.hide),
          item.process,
          item.target_date,
          item.lot_no,
          item.hala,
          item.size,
          item.remarks,
          item.created_by,
          item.created_on,
        ]}
        style={styles.row}
        textStyle={styles.text}
        widthArr={widthArr}
      />
    </Table>
  );

  const Delete = (tran_id) => {
    setloading(true);
    postData("Production/DeleteProductionFabrication", { tran_id: tran_id }).then((data) => {
      Refresh();
      setloading(false);
    });
  };

  const Hide = (tran_id, hide) => {
    let _param = {
      hide_unhide: hide == "True" ? false : true,
      tran_id: tran_id,
    };
    setloading(true);
    postData("Production/UpdateFabHide", _param).then((data) => {
      setloading(true);
      Refresh();
    });
  };

  const Action = (tran_id, issueto_id, issue_to, hala, hide) => {
    return (
      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        <Button
          mode="contained"
          compact={true}
          color="green"
          onPress={() =>
            navigation.push("DailyWashing", {
              tran_id: 0,
              party_id: issueto_id,
              party_name: issue_to,
              hala: hala,
              entry_type: "Fabrication",
              entry_id: tran_id,
            })
          }
        >
          Receive
        </Button>
        <Button
          mode="contained"
          compact={true}
          color="#E5E7E9"
          onPress={() => {
            Alert.alert(
              "Alert",
              "Are you sure ?",
              [
                {
                  text: "No",
                  style: "cancel",
                },
                {
                  text: "Yes",
                  onPress: () => {
                    Hide(tran_id, hide);
                  },
                },
              ],
              { cancelable: false }
            );
          }}
        >
          {hide == "True" ? "Unhide" : "Hide"}
        </Button>
        <Button
          mode="contained"
          compact={true}
          color="red"
          onPress={() => {
            Alert.alert(
              "Alert",
              "Are you sure ?",
              [
                {
                  text: "No",
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
        >
          X
        </Button>
      </View>
    );
  };

  const Refresh = () => {
    postData("Production/BrowseProductionFabrication", param).then((data) => {
      // console.log(data);
      setGrid(data);
      setloading(false);
    });
  };

  React.useEffect(() => {
    userId().then((data) => {
      param.user_id = data;
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
      <ScrollView horizontal={true}>
        <View>
          <Table borderStyle={{ borderWidth: 1, borderColor: "#c8e1ff" }}>
            <Row
              data={[
                //"S No",
                "Date",
                "Party",
                "Qty",
                "Action",
                "Process",
                "Target Date",
                "Lot No.",
                "Hala",
                "Size",
                "Remarks",
                "Created By",
                "Created On",
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

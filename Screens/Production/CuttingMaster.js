import React from "react";
import { Button } from "react-native-paper";
import { View, ScrollView, StyleSheet, Alert, FlatList } from "react-native";
import { Table, Row } from "react-native-table-component";
import { postData } from "../../_Services/Api_Service";
import Spinner from "react-native-loading-spinner-overlay";
import font from "../../fonts.js";
import { AuthContext } from "../../Components/Context";
import ProductionHeader from "./ProductionHeader";

export default function CuttingMaster({ route, navigation }) {
  const { userId } = React.useContext(AuthContext);
  const [isloading, setloading] = React.useState(true);
  const [gridData, setGrid] = React.useState([]);
  const [param, setParam] = React.useState({
    user_id: "",
    process_id: "12",
    check_all: false,
  });

  const widthArr = [100, 100, 80, 180, 100, 100, 100, 100];

  const Short = (tran_id) => {
    <Button mode="contained" compact={true}>
      Short No.
    </Button>;
  };
  const Roll = (tran_id) => {
    <Button mode="contained" compact={true}>
      Roll No.
    </Button>;
  };

  const RenderItem = ({ item, index }) => (
    <Table borderStyle={{ borderWidth: 1, borderColor: "#c8e1ff" }}>
      <Row
        key={index}
        data={[
          //index + 1,
          Short(item.tran_id),
          Roll(item.tran_id),
          item.qty,
          item.process,
          item.target_date,
          item.remarks,
          item.created_by,
          Action(item.tran_id),
        ]}
        style={styles.row}
        textStyle={styles.text}
        widthArr={widthArr}
      />
    </Table>
  );

  const Delete = (tran_id) => {
    setloading(true);
    postData("Production/DeleteProductionCutting", { tran_id: tran_id }).then((data) => {
      Refresh();
      setloading(false);
    });
  };

  const Action = (tran_id, issueto_id, cutting_datetime, issue_date, qty) => {
    return (
      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        <Button
          mode="contained"
          compact={true}
          color="green"
          onPress={() =>
            navigation.push("IssueGodown", {
              issueto_id: issueto_id,
              issue_date: issue_date,
              qty: qty,
              cutting_datetime: cutting_datetime,
            })
          }
        >
          Issue
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
    <>
      <ProductionHeader index={2} navigation={navigation} />
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
                  "Short No.",
                  "Roll No.",
                  "Qty",
                  "Process",
                  "Target Date",
                  "Remarks",
                  "Created",
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
      </View>
    </>
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

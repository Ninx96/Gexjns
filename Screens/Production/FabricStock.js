import React from "react";
import {
  TextInput,
  Searchbar,
  Button,
  TouchableRipple,
  Title,
  Portal,
  Dialog,
} from "react-native-paper";
import { View, ScrollView, StyleSheet, Alert, FlatList, Dimensions } from "react-native";
import { Table, Row } from "react-native-table-component";
import { AuthContext } from "../../Components/Context";
import { postData } from "../../_Services/Api_Service";
import DatePicker from "react-native-datepicker";
import { Picker } from "@react-native-picker/picker";
import SearchableDropdown from "react-native-searchable-dropdown";
import Spinner from "react-native-loading-spinner-overlay";
import font from "../../fonts.js";
import ProductionHeader from "./ProductionHeader";
import moment from "moment";

export default function FabricStock({ navigation }) {
  const { userId } = React.useContext(AuthContext);
  const [supplierList, setSupplierList] = React.useState([]);
  const [issueList, setIssueList] = React.useState([]);
  const [gridData, setGrid] = React.useState([]);
  const [isloading, setloading] = React.useState(true);
  const [modal, setModal] = React.useState({
    supplier: false,
  });
  const [param, setParam] = React.useState({
    user_id: "",
    search: "",

    tran_id: "",
    process_id: "12",
    issueto_id: "",
    supplier_id: "",
    supplier: "",
    date: moment().format("DD/MM/YYYY"),
    target_date: moment().format("DD/MM/YYYY"),
    return_to_date: moment().format("DD/MM/YYYY"),
    remarks: "",
    pur_tran: [],
  });

  const widthArr = [100, 100, 100, 80, 100, 100, 100, 100, 100, 100];

  const RenderItem = ({ item, index }) => (
    <Table borderStyle={{ borderWidth: 1, borderColor: "#c8e1ff" }}>
      <Row
        key={index}
        data={[
          //index + 1,
          item.date,
          item.roll_no,
          item.qty,
          Action(item),
          item.supplier,
          item.fabric_category,
          item.short_no,
          item.fabric_name,
          item.color,
          item.description,
        ]}
        style={styles.row}
        textStyle={styles.text}
        widthArr={widthArr}
      />
    </Table>
  );

  const Action = (item) => {
    return (
      <Button
        mode="contained"
        color="green"
        compact={true}
        onPress={() => {
          item.date = moment().format("DD/MM/YYYY");
          param.pur_tran.push(item);
          setParam({ ...param });
        }}
      >
        Add
      </Button>
    );
  };

  const Action2 = (index) => {
    return (
      <Button
        mode="contained"
        color="orange"
        compact={true}
        onPress={() => {
          param.pur_tran.splice(index, 1);
          setParam({ ...param });
        }}
      >
        Delete
      </Button>
    );
  };

  const Refresh = () => {
    setloading(true);
    postData("Production/BrowseProductionFabricStock", param).then((data) => {
      if (data.length === 0) {
        setLoadBtn(false);
      }
      //console.log(data);
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
    postData("StockDropdown/GetIssueList", { process_id: "12" }).then((resp) => {
      setIssueList(resp);
    });
    postData("StockDropdown/GetSupplierPurchaseList", { search: "" }).then((resp) => {
      setSupplierList(resp);
    });
    navigation.addListener("focus", () => {
      setTimeout(() => {
        Refresh();
      }, 1000);
    });
  }, []);

  return (
    <>
      <ProductionHeader index={1} navigation={navigation} />
      <View style={{ flex: 1 }}>
        <Portal>
          <Dialog
            visible={modal.supplier}
            onDismiss={() => {
              setModal({ ...modal, supplier: false });
            }}
          >
            <Dialog.Title>Select Return to </Dialog.Title>
            <Dialog.Content>
              <SearchableDropdown
                onItemSelect={(item) => {
                  setParam({ ...param, supplier_id: item.id, supplier: item.name });
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
                items={supplierList}
                defaultIndex={2}
                resetValue={false}
                textInputProps={{
                  placeholder: "Search Supplier",
                  underlineColorAndroid: "transparent",
                  style: {
                    padding: 13,
                    borderWidth: 1,
                    borderColor: "#7b7070",
                    borderRadius: 5,
                  },
                  onTextChange: (text) => {
                    postData("StockDropdown/GetSupplierPurchaseList", { search: text }).then(
                      (resp) => {
                        setSupplierList(resp);
                      }
                    );
                  },
                }}
                listProps={{
                  nestedScrollEnabled: true,
                }}
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                onPress={() => {
                  setModal({ ...modal, supplier: false });
                }}
              >
                Done
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        <ScrollView>
          <Searchbar style={{ flex: 10 }} placeholder="Search" onChangeText={(text) => {}} />
          <View>
            <Title>Selected Item</Title>
            <ScrollView horizontal={true}>
              <View>
                <Table borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}>
                  <Row
                    data={[
                      //"S No.",
                      "Date",
                      "Roll No.",
                      "Qty",
                      "Action",
                      "Supplier",
                      "Fabric Cat.",
                      "Short No.",
                      "Fabric Name",
                      "Color",
                      "Description",
                    ]}
                    style={styles.head}
                    textStyle={styles.text}
                    widthArr={widthArr}
                  />
                </Table>
                <ScrollView>
                  <Table borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}>
                    {param.pur_tran.map((item, index) => {
                      return (
                        <Row
                          key={index}
                          data={[
                            //index + 1,
                            item.date,
                            item.roll_no,
                            item.qty,
                            Action2(index),
                            item.supplier,
                            item.fabric_category,
                            item.short_no,
                            item.fabric_name,
                            item.color,
                            item.description,
                          ]}
                          style={styles.row}
                          textStyle={styles.text}
                          widthArr={widthArr}
                        />
                      );
                    })}
                  </Table>
                </ScrollView>
              </View>
            </ScrollView>
          </View>
          <View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-evenly", marginVertical: 5 }}
            >
              <View
                style={{
                  borderWidth: 0.6,
                  //borderColor: "#A9A9A9",
                  borderColor: "black",
                  borderRadius: 5,
                  marginTop: 8,
                  height: 45,
                  width: "40%",
                  backgroundColor: "white",
                }}
              >
                <Picker
                  selectedValue={param.issueto_id}
                  style={{ height: 45, width: "100%" }}
                  onValueChange={(itemValue, itemIndex) => {
                    setParam({ ...param, issueto_id: itemValue });
                  }}
                >
                  <Picker.Item label="- - -Select Type- - -" value="" />
                  {issueList.map((item) => (
                    <Picker.Item label={item.name} value={item.id} />
                  ))}
                </Picker>
              </View>

              <DatePicker
                style={{ width: "40%", marginTop: 10, marginBottom: 4 }}
                date={param.target_date}
                mode="date"
                showIcon={false}
                placeholder="Target Date"
                format="DD/MM/YYYY"
                onDateChange={(date) => {
                  setParam({ ...param, target_date: date });
                }}
                customStyles={{
                  dateInput: {
                    borderRadius: 5,
                    alignpur_tran: "flex-start",
                    height: 45,
                    padding: 14,
                  },
                }}
              />
            </View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-evenly", marginVertical: 5 }}
            >
              <TouchableRipple
                style={{ width: "20%", height: 45 }}
                onPress={() => {
                  setModal({ ...modal, supplier: true });
                }}
              >
                <TextInput
                  style={{ width: "100%", height: 45 }}
                  mode="outlined"
                  label={"Return To"}
                  placeholder="Select Return To"
                  editable={false}
                  value={param.supplier}
                ></TextInput>
              </TouchableRipple>
              <DatePicker
                style={{ width: "20%", marginTop: 8, marginBottom: 4 }}
                date={param.return_to_date}
                mode="date"
                showIcon={false}
                placeholder="Return to Date"
                format="DD/MM/YYYY"
                onDateChange={(date) => {
                  setParam({ ...param, return_to_date: date });
                }}
                customStyles={{
                  dateInput: {
                    borderRadius: 5,
                    alignpur_tran: "flex-start",
                    height: 45,
                    padding: 14,
                  },
                }}
              />
              <TextInput
                style={{ width: "40%", height: 45 }}
                mode="outlined"
                label={"Remarks"}
                placeholder="Remarks"
                onChangeText={(text) => {
                  setParam({ ...param, remarks: text });
                }}
                value={param.remarks}
              ></TextInput>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "flex-end", marginVertical: 5 }}>
              <Button
                mode="contained"
                style={{ marginHorizontal: 5 }}
                color="red"
                onPress={() => {
                  postData("Production/InsertProductionFabricReturn", param).then(() => {
                    alert("Saved Succeessfully...");
                    setParam({});
                  });
                }}
              >
                Return
              </Button>
              <Button
                mode="contained"
                style={{ marginHorizontal: 5 }}
                color="red"
                onPress={() => {
                  postData("Production/InsertProductionFabricStock", param).then(() => {
                    alert("Saved Succeessfully...");
                    setParam({});
                  });
                }}
              >
                Save
              </Button>
            </View>
          </View>
          <View>
            <ScrollView horizontal={true}>
              <View>
                <Table borderStyle={{ borderWidth: 1, borderColor: "#c8e1ff" }}>
                  <Row
                    data={[
                      //"S No.",
                      "Date",
                      "Roll No.",
                      "Qty",
                      "Action",
                      "Supplier",
                      "Fabric Cat.",
                      "Short No.",
                      "Fabric Name",
                      "Color",
                      "Description",
                    ]}
                    style={styles.head}
                    textStyle={styles.text}
                    widthArr={widthArr}
                  />
                </Table>
                <FlatList
                  data={gridData}
                  getItemLayout={(data, index) => ({ length: 40, offset: 40 * index, index })}
                  initialNumToRender={5}
                  maxToRenderPerBatch={5}
                  renderItem={RenderItem}
                  keyExtractor={(item) => item.roll_no}
                />
              </View>
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    height: 45,
    marginTop: 4,
    marginBottom: 4,
  },
  textArea: {
    marginTop: 4,
    marginBottom: 4,
  },
  fabLeft: {
    position: "absolute",
    margin: 16,
    left: 0,
    bottom: 0,
    backgroundColor: "#6200ee",
  },
  fabRight: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#6200ee",
  },
  dropdown: {
    height: 45,
    marginTop: 4,
    marginBottom: 4,
    //borderWidth: 2,
    borderColor: "grey",
  },
  header: { height: 50, backgroundColor: "#537791" },
  text: { textAlign: "center", fontWeight: "100" },
  dataWrapper: { marginTop: -1 },
  row: { height: 40 },
  head: { height: 40, backgroundColor: "#f1f8ff" },
  text: { margin: 6 },
  listContent: {
    fontFamily: font.medium,
    fontSize: 13,
    marginRight: 10,
  },
  spinnerTextStyle: {
    color: "#FFF",
  },
});

import React from "react";
import {
  TextInput,
  Searchbar,
  Button,
  TouchableRipple,
  Title,
  Portal,
  Dialog,
  FAB,
} from "react-native-paper";
import { View, ScrollView, StyleSheet, Alert, FlatList, Image } from "react-native";
import { Table, Row } from "react-native-table-component";
import { AuthContext } from "../../Components/Context";
import { postData } from "../../_Services/Api_Service";
import DatePicker from "react-native-datepicker";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import { Picker } from "@react-native-picker/picker";
import SearchableDropdown from "react-native-searchable-dropdown";
import Spinner from "react-native-loading-spinner-overlay";
import font from "../../fonts.js";
import moment from "moment";

export default function DailyWashing({ route, navigation }) {
  const { userId } = React.useContext(AuthContext);

  const reqParam = route.params;
  //const reqParam = {};
  const [isloading, setloading] = React.useState(true);
  const [dailyReceiptList, setDailyReceiptList] = React.useState([]);
  const [partyList, setPartyList] = React.useState([]);
  const [modal, setModal] = React.useState({
    item: false,
    index: false,
    party: false,
    issue: false,
  });
  const [item, setItem] = React.useState({
    item_name: "",
    lot_no: "",
    receive: "",
    issue: "",
    rate: "",
    remarks: "",
  });
  const [param, setParam] = React.useState({
    tran_id: reqParam.tran_id === undefined ? 0 : reqParam.tran_id,
    date: moment().format("DD/MM/YYYY"),
    target_date: moment().format("DD/MM/YYYY"),
    lr_no: "",
    washing_id: "",
    mode: "Bill",
    item: "",
    lot_no: "",
    issue: "",
    receive: "",
    remarks: "",
    short: "",
    excess: "",
    rate: "",
    amount: "",
    uri: require("../../assets/upload.png"),
    file_path: "",
    uri1: require("../../assets/upload.png"),
    file_path1: "",
    party_id: reqParam.party_id,
    party_name: reqParam.party_name,
    party_type: "Contact",
    days_of_payment: "",
    ledger_id: "",
    daily_receipt: "",
    taxes: "",
    paid: "",
    dis_per: "",
    discount: "",
    gaddi_comm: "",
    other_charges: "",
    other_charges_less: "",
    total: "",
    gr_issue: "",
    gr_receive: "",
    prefix: "REC",
    entry_type: reqParam.entry_type,
    entry_id: reqParam.entry_id,
    user_id: "",
    fabitem: [],
  });
  var issueParam = {
    tran_id: "0",
    process_id: "",
    type: "Contact",
    issueto_id: reqParam.party_id,
    lot_no: "",
    qty: "",
    size: "",
    hala: "",
    shortage: "0",
    excess: "0",

    date: moment().format("DD/MM/YYYY"),
    target_date: moment().format("DD/MM/YYYY"),
    remarks: "",
    user_id: "",
  };

  var issueUrl = false;

  const widthArr = [50, 100, 100, 80, 100, 100];

  const ImageUpload = async () => {
    try {
      const Camera = await Permissions.getAsync(Permissions.CAMERA);
      const camera_roll = await Permissions.getAsync(Permissions.MEDIA_LIBRARY);

      if (!Camera.granted) {
        Permissions.askAsync(Permissions.CAMERA);
      } else if (!camera_roll.granted) {
        Permissions.askAsync(Permissions.MEDIA_LIBRARY);
      } else {
        const options = {
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.2,
          base64: true,
        };
        Alert.alert("Select Upload Option", "Choose an Option To Continue", [
          {
            text: "Camera",
            onPress: () => {
              ImagePicker.launchCameraAsync(options).then((result) => {
                if (!result.cancelled) {
                  setParam({
                    ...param,
                    uri: { uri: result.uri },
                    file_path: result.base64,
                  });
                }
              });
            },
          },
          {
            text: "Gallery",
            onPress: () => {
              ImagePicker.launchImageLibraryAsync(options).then((result) => {
                if (!result.cancelled) {
                  setParam({
                    ...param,
                    uri: { uri: result.uri },
                    file_path: result.base64,
                  });
                }
              });
            },
          },
        ]);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const Image2Upload = async () => {
    try {
      const Camera = await Permissions.getAsync(Permissions.CAMERA);
      const camera_roll = await Permissions.getAsync(Permissions.MEDIA_LIBRARY);

      if (!Camera.granted) {
        Permissions.askAsync(Permissions.CAMERA);
      } else if (!camera_roll.granted) {
        Permissions.askAsync(Permissions.MEDIA_LIBRARY);
      } else {
        const options = {
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.2,
          base64: true,
        };
        Alert.alert("Select Upload Option", "Choose an Option To Continue", [
          {
            text: "Camera",
            onPress: () => {
              ImagePicker.launchCameraAsync(options).then((result) => {
                if (!result.cancelled) {
                  setParam({
                    ...param,
                    uri1: { uri: result.uri },
                    file_path1: result.base64,
                  });
                }
              });
            },
          },
          {
            text: "Gallery",
            onPress: () => {
              ImagePicker.launchImageLibraryAsync(options).then((result) => {
                if (!result.cancelled) {
                  setParam({
                    ...param,
                    uri1: { uri: result.uri },
                    file_path1: result.base64,
                  });
                }
              });
            },
          },
        ]);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const Action = (key, item) => {
    return (
      <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
        <Button
          mode="contained"
          color="red"
          compact={true}
          onPress={() => {
            setItem(item);
            setModal({ ...modal, item: true, index: key });
            param.fabitem.splice(key, 1);
          }}
        >
          Edit
        </Button>

        <Button
          mode="contained"
          color="blue"
          compact={true}
          onPress={() => {
            param.fabitem.splice(key, 1);
            setParam({ ...param });
          }}
        >
          X
        </Button>
      </View>
    );
  };

  React.useEffect(() => {
    userId().then((data) => {
      param.user_id = data;
    });
    postData("StockDropdown/GetFabDailyReciept", {}).then((resp) => {
      setDailyReceiptList(resp);
    });
    postData("StockDropdown/SelectPartyInDailyWashing", { search: "" }).then((resp) => {
      setPartyList(resp);
    });

    if (reqParam.entry_type == "Fabrication") {
      postData("Production/PickFabInDailyWashing", { fab_id: reqParam.entry_id }).then((resp) => {
        param.fabitem = resp;
        issueParam.fabrication_id = reqParam.entry_id;
        issueParam.process_id = "17";
        issueParam.lot_no = resp[0].lot_no;
        issueParam.qty = resp[0].qty;
        issueParam.size = resp[0].size;
        issueParam.hala = resp[0].hala;
        issueUrl = "InsertProductionKaj";
      });
    } else if (reqParam.entry_type == "Washing") {
      postData("Production/PickWashInDailyWashing", { wash_id: reqParam.entry_id }).then((resp) => {
        param.fabitem = resp;
        issueParam.washing_id = reqParam.entry_id;
        issueParam.process_id = "15";
        issueParam.lot_no = resp[0].lot_no;
        issueParam.qty = resp[0].qty;
        issueParam.size = resp[0].size;
        issueParam.hala = resp[0].hala;
        issueUrl = "InsertProductionDhagaCutting";
      });
    } else if (reqParam.entry_type == "Cutting Master") {
      // postData("Production/PreviewDailyWashing", param).then((resp) => {
      //   param.fabitem = resp;
      // });
    } else if (reqParam.entry_type == "Dhaga Cutting") {
      postData("Production/PickDhagaInDailyWashing", { dhaga_id: reqParam.entry_id }).then(
        (resp) => {
          param.fabitem = resp;
          issueParam.dhagacutting_id = reqParam.entry_id;
          issueParam.process_id = "16";
          issueParam.lot_no = resp[0].lot_no;
          issueParam.qty = resp[0].qty;
          issueParam.size = resp[0].size;
          issueParam.hala = resp[0].hala;
          issueUrl = "InsertProductionPackaging";
        }
      );
    }

    if (param.tran_id) {
      postData("Production/PreviewDailyWashing", param).then((resp) => {
        setParam({ ...param, ...resp });
      });
    } else {
      postData("Production/GetLRNoInDailyWashing", {}).then((resp) => {
        setParam({ ...param, lr_no: resp.toString() });
      });
    }
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Portal>
        <Dialog
          visible={modal.item}
          onDismiss={() => {
            setModal({ ...modal, item: false });
          }}
        >
          <Dialog.Title>Item Details</Dialog.Title>
          <Dialog.Content>
            <TextInput
              style={{ height: 45 }}
              mode="outlined"
              label={"Lot No."}
              placeholder="Lot No."
              onChangeText={(text) => {
                setItem({ ...item, lot_no: text });
              }}
              value={item.lot_no}
            ></TextInput>
            <TextInput
              style={{ height: 45 }}
              mode="outlined"
              label={"Receive"}
              placeholder="Receive"
              onChangeText={(text) => {
                setItem({ ...item, receive: text });
              }}
              value={item.receive}
            ></TextInput>
            <TextInput
              style={{ height: 45 }}
              mode="outlined"
              label={"Rate"}
              placeholder="Rate"
              onChangeText={(text) => {
                setItem({ ...item, rate: text });
              }}
              value={item.rate}
            ></TextInput>
            <TextInput
              style={{ height: 45 }}
              mode="outlined"
              label={"Remarks"}
              placeholder="Remarks"
              onChangeText={(text) => {
                setItem({ ...item, remarks: text });
              }}
              value={item.remarks}
            ></TextInput>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => {
                if (modal.index) {
                  param.fabitem.splice(index, 1, item);
                } else {
                  param.fabitem.push(item);
                }

                setModal({ ...modal, item: false });
                setParam({ ...param });
              }}
            >
              Done
            </Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog
          visible={modal.party || modal.issue}
          onDismiss={() => {
            setModal({ ...modal, party: false, issue: false });
          }}
        >
          <Dialog.Title>Select Party </Dialog.Title>
          <Dialog.Content>
            <SearchableDropdown
              onItemSelect={(item) => {
                if (modal.party) {
                  setParam({
                    ...param,
                    party_id: item.id,
                    party_type: item.type,
                    party_name: item.name,
                  });
                } else {
                  setParam({ ...param });
                }
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
              items={partyList}
              defaultIndex={2}
              resetValue={false}
              textInputProps={{
                placeholder: "Search Party",
                underlineColorAndroid: "transparent",
                style: {
                  padding: 13,
                  borderWidth: 1,
                  borderColor: "#7b7070",
                  borderRadius: 5,
                },
                onTextChange: (text) => {
                  postData("StockDropdown/SelectPartyInDailyWashing", { search: text }).then(
                    (resp) => {
                      setPartyList(resp);
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
                setModal({ ...modal, party: false, issue: false });
              }}
            >
              Done
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <ScrollView>
        <Title style={{ textAlign: "center" }}>Receipt Information</Title>
        <View style={{ marginVertical: 5 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginVertical: 5 }}>
            <TouchableRipple
              style={{ width: "40%", height: 45 }}
              onPress={() => {
                setModal({ ...modal, issue: true });
              }}
            >
              <TextInput
                style={{ width: "100%", height: 45 }}
                mode="outlined"
                label={"Issued Party"}
                placeholder="Issued Party"
                editable={false}
                value={param.issue}
              ></TextInput>
            </TouchableRipple>

            <TouchableRipple
              style={{ width: "40%", height: 45 }}
              onPress={() => {
                setModal({ ...modal, party: true });
              }}
            >
              <TextInput
                style={{ width: "100%", height: 45 }}
                mode="outlined"
                label={"Party"}
                placeholder="Party"
                editable={false}
                value={param.party_name}
              ></TextInput>
            </TouchableRipple>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginVertical: 5 }}>
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
                selectedValue={""}
                style={{ height: 45, width: "100%" }}
                onValueChange={(itemValue, itemIndex) => {
                  setParam({ ...param, issueto_id: itemValue });
                }}
              >
                <Picker.Item label="--Option--" value="" />
                {dailyReceiptList.map((item) => (
                  <Picker.Item label={item.name} value={item.name} />
                ))}
              </Picker>
            </View>

            <DatePicker
              style={{ width: "40%", marginTop: 10, marginBottom: 4 }}
              date={param.date}
              mode="date"
              showIcon={false}
              placeholder="Issue Date"
              format="DD/MM/YYYY"
              onDateChange={(date) => {
                setParam({ ...param, date: date });
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
          <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginVertical: 5 }}>
            <TextInput
              style={{ width: "40%", height: 45 }}
              mode="outlined"
              label={"Payment Days"}
              placeholder="Remarks"
              onChangeText={(text) => {
                setParam({ ...param, days_of_payment: text });
              }}
              value={param.days_of_payment}
            ></TextInput>

            <TextInput
              style={{ width: "40%", height: 45 }}
              mode="outlined"
              label={"Ledger No."}
              placeholder="Remarks"
              onChangeText={(text) => {
                setParam({ ...param, lr_no: text });
              }}
              value={param.lr_no}
            ></TextInput>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginVertical: 5 }}>
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
                selectedValue={param.mode}
                style={{ height: 45, width: "100%" }}
                onValueChange={(itemValue, itemIndex) => {
                  setParam({ ...param, issueto_id: itemValue });
                }}
              >
                <Picker.Item label="--Option--" value="" />
                <Picker.Item label="Payment" value="Payment" />
                <Picker.Item label="Bill" value="Bill" />
                <Picker.Item label="GR" value="GR" />
              </Picker>
            </View>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginVertical: 5 }}>
            <TextInput
              style={{ width: "85%", height: 100 }}
              mode="outlined"
              label={"Remarks"}
              placeholder="Remarks"
              onChangeText={(text) => {
                setParam({ ...param, remarks: text });
              }}
              value={param.remarks}
            ></TextInput>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginVertical: 5 }}>
            <View style={{ width: "40%" }}>
              <Image source={param.uri} style={{ width: "100%", height: 150, borderRadius: 10 }} />
              <Button mode="contained" compact={true} onPress={ImageUpload} color="green">
                Browse
              </Button>
              <Button
                mode="contained"
                color="red"
                onPress={() => {
                  setParam({ ...param, uri: require("../../assets/upload.png"), file_path: "" });
                }}
              >
                Clear
              </Button>
            </View>
            <View style={{ width: "40%" }}>
              <Image source={param.uri1} style={{ width: "100%", height: 150, borderRadius: 10 }} />
              <Button mode="contained" compact={true} onPress={Image2Upload} color="green">
                Browse
              </Button>
              <Button
                mode="contained"
                color="red"
                onPress={() => {
                  setParam({ ...param, uri1: require("../../assets/upload.png"), file_path1: "" });
                }}
              >
                Clear
              </Button>
            </View>
          </View>
        </View>
        <View style={{ marginVertical: 5, paddingHorizontal: 2 }}>
          <Searchbar style={{ flex: 10 }} placeholder="Search" onChangeText={(text) => {}} />
          <ScrollView horizontal={true}>
            <View>
              <Table borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}>
                <Row
                  data={["S No.", "Lot No.", "Receive", "Rate", "Amount", "Remarks", "Action"]}
                  style={styles.head}
                  textStyle={styles.text}
                  widthArr={widthArr}
                />
              </Table>
              <Table borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}>
                {param.fabitem.map((item, index) => {
                  return (
                    <Row
                      key={index}
                      data={[
                        index + 1,
                        item.lot_no,
                        item.receive,
                        item.rate,
                        item.amount,
                        item.remarks,
                        Action(index, item),
                      ]}
                      style={styles.row}
                      textStyle={styles.text}
                      widthArr={widthArr}
                    />
                  );
                })}
              </Table>
            </View>
          </ScrollView>
          <Button
            mode="contained"
            color="green"
            compact={true}
            style={{ alignSelf: "flex-end", margin: 10 }}
            onPress={() => {
              setModal({ item: true });
            }}
          >
            Add Manual
          </Button>
        </View>
        <View style={{ height: 80 }}></View>
      </ScrollView>
      <FAB
        style={styles.fabRight}
        icon="check"
        onPress={() => {
          if (param.party_name == "") {
            alert("Please Select Party");
          } else if (param.date == "") {
            alert("Please Select Date");
          } else {
            setloading(true);
            //console.log(param);
            postData("Production/InsertFabDailyWashing", param).then((data) => {
              setloading(false);
              if (data.valid) {
                if (issueUrl) {
                  issueParam.date = param.date;
                  issueParam.remarks = param.remarks;
                  issueParam.user_id = param.user_id;
                  postData("Production/" + issueUrl, issueParam).then((data) => {
                    if (data.valid) {
                      Alert.alert("Form Save Succeessfully!!");
                      navigation.goBack();
                    } else {
                      Alert.alert("Error", data.msg);
                    }
                  });
                } else {
                  Alert.alert("Form Save Succeessfully!!");
                  navigation.goBack();
                }
              } else {
                Alert.alert("Error", data.msg);
              }
            });
          }
        }}
      />
      <FAB
        style={styles.fabLeft}
        icon="close"
        onPress={() => {
          navigation.goBack();
        }}
      />
    </View>
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

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
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  FlatList,
  Image,
} from "react-native";
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

const ShopGRForm = () => {
  const { tran_id } = route.params == undefined ? 0 : route.params;
  const [isloading, setloading] = React.useState(true);
  const { userId } = React.useContext(AuthContext);
  const [partyList, setPartyList] = React.useState([]);
  const [param, setParam] = React.useState({
    tran_id: tran_id == undefined ? 0 : tran_id,
    date: moment().format("DD/MM/YYYY"),
    party: "",
    amount: "",
    remarks: "",
    uri1: require("../../assets/upload.png"),
    image_path1: "",
    uri: require("../../assets/upload.png"),
    image_path: "",
    entry_no: "",
    prefix: "PB",
    user_id: "",
  });
  const [modal, setModal] = React.useState({
    party: false,
  });

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
                    image_path: result.base64,
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
                    image_path: result.base64,
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
                    image_path1: result.base64,
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
                    image_path1: result.base64,
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

  const Preview = () => {
    postData("Transaction/PreviewDayBook", param).then((resp) => {
      //console.log(resp);
      if (resp.image_path) {
        param.uri = `https://musicstore.quickgst.in/Attachment_Img/Day_Book_DetailsImage/${resp.image_path}`;
      }
      if (resp.image_path1) {
        param.uri1 = `https://musicstore.quickgst.in/Attachment_Img/Day_Book_DetailsImageTwo/${resp.image_path1}`;
      }
      setParam({
        ...param,
        amount: resp.invoice_amt,
        ...resp,
      });

      setloading(false);
    });
  };

  React.useEffect(() => {
    userId().then((data) => {
      param.user_id = data;
    });
    if (tran_id != undefined) {
      Preview();
    } else {
      postData("Transaction/EntryNoInDayBook", "").then((resp) => {
        setParam({ ...param, entry_no: resp.toString() });
        setloading(false);
      });
    }
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
          visible={modal.party}
          onDismiss={() => {
            setModal({ ...modal, party: false });
          }}
        >
          <Dialog.Title>Select Party </Dialog.Title>
          <Dialog.Content>
            <SearchableDropdown
              onItemSelect={(item) => {
                //console.log(item);
                setParam({
                  ...param,
                  party: item.name,
                });
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
                  postData("StockDropdown/GetContactDetails", {
                    search: text,
                  }).then((resp) => {
                    //console.log(resp);
                    setPartyList(resp);
                  });
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
                setModal({ ...modal, party: false });
              }}
            >
              Done
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <ScrollView>
        <View style={{ marginVertical: 5 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              marginVertical: 5,
            }}
          >
            <DatePicker
              style={{ width: "40%", marginTop: 10, marginBottom: 4 }}
              date={param.date}
              mode="date"
              showIcon={false}
              placeholder="Select Date"
              format="DD/MM/YYYY"
              onDateChange={(date) => {
                setParam({
                  ...param,
                  date: date,
                });
              }}
              customStyles={{
                dateInput: {
                  borderRadius: 5,
                  alignItems: "flex-start",
                  height: 45,
                  padding: 14,
                },
              }}
            />

            <TouchableRipple
              style={{ width: "40%" }}
              onPress={() => {
                setModal({ ...modal, party: true });
              }}
            >
              <TextInput
                style={{ height: 45, width: "100%" }}
                mode="outlined"
                label={"Party"}
                value={param.party}
                editable={false}
              ></TextInput>
            </TouchableRipple>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              marginVertical: 5,
            }}
          >
            <TextInput
              style={styles.input}
              mode="outlined"
              label={"GR No."}
              value={param.entry_no}
              disabled={true}
              onChangeText={(text) => {
                setParam({
                  ...param,
                  entry_no: text,
                });
              }}
            ></TextInput>

            <TextInput
              style={styles.input}
              mode="outlined"
              label={"Gaddi"}
              value={param.invoice_amt}
              onChangeText={(text) => {
                setParam({
                  ...param,
                  invoice_amt: text,
                });
              }}
            ></TextInput>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              marginVertical: 5,
            }}
          >
            <TextInput
              style={styles.textArea}
              multiline={true}
              numberOfLines={5}
              mode="outlined"
              label={"Remarks"}
              value={param.remarks}
              onChangeText={(text) => {
                setParam({
                  ...param,
                  remarks: text,
                });
              }}
            ></TextInput>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              marginVertical: 5,
            }}
          >
            <View style={{ width: "40%" }}>
              <Image
                source={param.uri}
                style={{ width: "100%", height: 150, borderRadius: 10 }}
              />
              <Button
                mode="contained"
                compact={true}
                onPress={ImageUpload}
                color="green"
              >
                Browse
              </Button>
              <Button
                mode="contained"
                color="red"
                onPress={() => {
                  setParam({
                    ...param,
                    uri: require("../../assets/upload.png"),
                    image_path: "",
                  });
                }}
              >
                Clear
              </Button>
            </View>
            <View style={{ width: "40%" }}>
              <Image
                source={param.uri1}
                style={{ width: "100%", height: 150, borderRadius: 10 }}
              />
              <Button
                mode="contained"
                compact={true}
                onPress={Image2Upload}
                color="green"
              >
                Browse
              </Button>
              <Button
                mode="contained"
                color="red"
                onPress={() => {
                  setParam({
                    ...param,
                    uri1: require("../../assets/upload.png"),
                    image_path1: "",
                  });
                }}
              >
                Clear
              </Button>
            </View>
          </View>
          <View style={{ marginVertical: 5 }}></View>
        </View>
      </ScrollView>
      <FAB
        style={styles.fabRight}
        icon="check"
        onPress={() => {
          if (param.party == "") {
            alert("Please Select Patrty Name");
          } else {
            setloading(true);

            postData("Transaction/InsertDayBook", param).then((data) => {
              setloading(false);
              if (data.valid) {
                Alert.alert("Form Save Succeessfully!!");
                navigation.goBack();
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    height: 45,
    width: "40%",
  },
  textArea: {
    width: "85%",
    height: 100,
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

export default ShopGRForm;

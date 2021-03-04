import React, { Component, Fragment } from "react";
import {
  Text,
  TextInput,
  FAB,
  TouchableRipple,
  Portal,
  Dialog,
  Button,
  Headline,
  Chip,
  Title,
} from "react-native-paper";
import { View, ScrollView, StyleSheet, Image, Alert, Dimensions } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import DatePicker from "react-native-datepicker";
import { getData, postData } from "../../_Services/Api_Service";
import { AuthContext } from "../../Components/Context";
import SearchableDropdown from "react-native-searchable-dropdown";
import { FontAwesome } from "@expo/vector-icons";
import { BarCodeScanner } from "expo-barcode-scanner";
import Spinner from "react-native-loading-spinner-overlay";
const { width, height } = Dimensions.get("window");

export default function PoDetailsForm({ route, navigation }) {
  const { po_id } = route.params == undefined ? 0 : route.params;
  const { userId } = React.useContext(AuthContext);
  const [isloading, setloading] = React.useState(true);
  const [IsizeList, setIsizeList] = React.useState({
    sizeList: [],
  });
  const [IcolorList, setIcolorList] = React.useState({
    colorList: [],
  });
  const [IitemList, setIitemList] = React.useState({
    itemList: [],
  });
  const [modal, setModal] = React.useState({
    index: "",
    design: "",
    selected: false,
    visible: false,
  });
  const [barmodal, setBarModal] = React.useState({
    index: "",
    qty: "",
    visible: false,
  });
  const [typeList, settypeList] = React.useState([]);
  const [partymodal, setPartyModal] = React.useState({
    party: false,
    partyForm: false,
    party_name: "",
    type_id: "",
  });
  const [partyList, setPartyList] = React.useState([]);
  const [brokerList, setBrokerList] = React.useState([]);
  const [brokerempList, setBrokerEmpList] = React.useState([]);
  const [Image1, setImage1] = React.useState(require("../../assets/upload.png"));
  const [Image2, setImage2] = React.useState(require("../../assets/upload.png"));
  const [param, setParam] = React.useState({
    user_id: "",
    po_id: po_id == undefined ? 0 : po_id,
    po_date: "",
    prefix: "",
    po_no: "",
    party_id: "",
    party: "",
    type: "Contact",
    broker_id: "",
    emp_id: "",
    mobile: "",
    loose: "",
    no_of_partial: "",
    details_item: "",
    billing: "",
    remarks: "",
    qty: "",
    transport: "",
    file_path: "",
    file_path1: "",
    image_name: "",
    image_name1: "",

    sizeList: [],
    colorList: [],
    itemList: [],
    barcodeList: [],
  });
  const [qr, setqr] = React.useState(false);
  const [scanned, setScanned] = React.useState(false);
  const [hasPermission, setHasPermission] = React.useState(null);
  let barcode;

  async function BarcodeScanner() {
    try {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    } catch (err) {
      console.warn(err);
    }
  }

  React.useEffect(() => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    today = dd + "/" + mm + "/" + yyyy;
    param.po_date = today;

    let _user_id = "";
    userId().then((data) => {
      _user_id = data;
      setParam({
        ...param,
        user_id: data,
      });

      BarcodeScanner();
    });

    let _param = {
      user_id: param.user_id,
    };
    postData("StockDropdown/GetBrokerList", _param).then((resp) => {
      setBrokerList(resp);
    });

    let _data = {
      po_id: po_id == undefined ? 0 : po_id,
    };
    postData("StockDropdown/GetSizeList", _data).then((resp) => {
      setIsizeList({ ...IsizeList, sizeList: resp });
    });
    postData("StockDropdown/GetColorList", _data).then((resp) => {
      setIcolorList({ ...IcolorList, colorList: resp });
    });
    postData("StockDropdown/GetItemList", _data).then((resp) => {
      setIitemList({ ...IitemList, itemList: resp });
    });
    postData("StockDropdown/GetTypeList", "").then((resp) => {
      settypeList(resp);
    });

    if (po_id != undefined) {
      Preview();
    } else {
      postData("Transaction/EntryNoInPo", "").then((resp) => {
        setParam({ ...param, po_no: resp.po_no });
        setloading(false);
      });
    }
  }, []);

  const SearchPartyList = (search) => {
    let _param = {
      user_id: param.user_id,
      search: search,
    };
    postData("StockDropdown/SelectPartyName", _param).then((resp) => {
      setPartyList(resp);
    });
  };

  const GetBrokerEmployee = (id) => {
    param.state_id = id;
    let _param = {
      user_id: param.user_id,
      broker_id: id,
    };
    postData("StockDropdown/GetBrokerEmployee", _param).then((resp) => {
      setBrokerEmpList(resp);
    });
  };

  let dimensions = Dimensions.get("window");
  let imageWidth = Math.round((dimensions.width * 12) / 16);
  let imageHeight = Math.round(imageWidth / 2);

  const SelectSize = (index, size, selected) => {
    IsizeList.sizeList[index].selected = !selected;
    setIsizeList({ ...IsizeList, sizeList: IsizeList.sizeList });
  };

  const selectColor = (index, color, selected) => {
    IcolorList.colorList[index].selected = !selected;
    setIcolorList({ ...IcolorList, colorList: IcolorList.colorList });
  };

  const selectItem = (index, label, selected) => {
    IitemList.itemList[index].selected = !selected;
    setIitemList({ ...IitemList, itemList: IitemList.itemList });
  };
  const AddDesign = () => {
    IitemList.itemList[modal.index].selected = true;
    IitemList.itemList[modal.index].design = modal.design;
    setIitemList({ ...IitemList, itemList: IitemList.itemList });
    setModal({ ...modal, visible: false });
  };

  const Preview = () => {
    let data = {
      po_id: po_id,
    };
    postData("Transaction/PreviewPo", data).then((resp) => {
      GetBrokerEmployee(resp.broker_id);
      setTimeout(() => {
        setParam({
          ...param,
          po_date: resp.po_date,
          po_no: resp.po_no,
          party_id: resp.party_id,
          party: resp.party,
          broker_id: resp.broker_id == 0 ? "" : resp.broker_id,
          emp_id: resp.emp_id == 0 ? "" : resp.emp_id,
          mobile: resp.mobile,
          no_of_partial: resp.no_of_partial,
          loose: resp.loose,
          billing: resp.billing,
          remarks: resp.remarks,
          transport: resp.transport,
          image_name: resp.file_path,
          image_name1: resp.file_path1,
          barcodeList: resp.barcodeList,
        });

        if (resp.file_path != "") {
          setImage1({
            uri: `https://musicstore.quickgst.in/Attachment_Img/PO_DetailsImage/${resp.file_path}`,
          });
        }
        if (resp.file_path1 != "") {
          setImage2({
            uri: `https://musicstore.quickgst.in/Attachment_Img/PO_DetailsImageTwo/${resp.file_path}`,
          });
        }

        setloading(false);
      }, 2000);
    });
  };

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setqr(false);
    // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    param.barcodeList.push({ barcode: data });
    setParam({ ...param, barcodeList: param.barcodeList });
  };
  const handleBarCodeFill = () => {
    setScanned(true);
    setqr(false);
    // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    param.barcodeList.push({ barcode: barcode });
    setParam({ ...param, barcodeList: param.barcodeList });
    barcode = "";
  };
  const handleRemoveBarcode = (key) => {
    param.barcodeList.splice(key, 1);
    setParam({ ...param, barcodeList: param.barcodeList });
  };
  const AddBarcodeQty = () => {
    param.barcodeList[barmodal.index].qty = barmodal.qty;
    setParam({ ...param, barcodeList: param.barcodeList });
    setBarModal({ ...barmodal, visible: false });
    // console.log(param.barcodeList);
  };

  return (
    <Fragment>
      <Spinner
        visible={isloading}
        textContent={"Loading.."}
        textStyle={styles.spinnerTextStyle}
        size={"large"}
        color={"#6200ee"}
        animation={"fade"}
        textStyle={{ color: "#6200ee" }}
      />

      <View style={{ flex: 1 }}>
        <ScrollView>
          <View style={{ padding: 50 }}>
            <Button
              icon="account-plus"
              mode="contained"
              onPress={() => setPartyModal({ ...partymodal, partyForm: true })}
            >
              {" "}
              Add Party
            </Button>

            <TouchableRipple
              onPress={() => {
                setPartyModal({ ...partymodal, party: true });
              }}
            >
              <TextInput
                style={styles.input}
                mode="outlined"
                label={"Party"}
                value={param.party}
                editable={false}
              ></TextInput>
            </TouchableRipple>
            <DatePicker
              style={{ width: 260, marginTop: 4, marginBottom: 4 }}
              date={param.po_date}
              mode="date"
              placeholder="Select date"
              format="DD/MM/YYYY"
              showIcon={false}
              onDateChange={(date) => {
                setParam({
                  ...param,
                  po_date: date,
                });
              }}
              customStyles={{
                dateInput: {
                  borderRadius: 5,
                },
              }}
            />

            <TextInput
              style={styles.input}
              mode="outlined"
              label={"PO No."}
              value={param.po_no}
              disabled={true}
              onChangeText={(text) => {
                setParam({
                  ...param,
                  po_no: text,
                });
              }}
            ></TextInput>

            <DropDownPicker
              itemStyle={{
                justifyContent: "flex-start",
              }}
              placeholder="Select Gaddi"
              style={styles.dropdown}
              items={brokerList}
              defaultValue={param.broker_id}
              onChangeItem={(item) => {
                setParam({
                  ...param,
                  broker_id: item.value,
                });
                GetBrokerEmployee(item.value);
              }}
            />

            <DropDownPicker
              itemStyle={{
                justifyContent: "flex-start",
              }}
              placeholder="Select Gaddi Employee"
              style={styles.dropdown}
              items={brokerempList}
              defaultValue={param.emp_id}
              onChangeItem={(item) => {
                setParam({
                  ...param,
                  emp_id: item.value,
                });
              }}
            />

            <TextInput
              style={styles.input}
              mode="outlined"
              label={"Pethi"}
              value={param.no_of_partial}
              keyboardType="number-pad"
              onChangeText={(text) => {
                setParam({
                  ...param,
                  no_of_partial: text,
                });
              }}
            ></TextInput>

            <TextInput
              style={styles.input}
              mode="outlined"
              label={"Loose"}
              value={param.loose}
              onChangeText={(text) => {
                setParam({
                  ...param,
                  loose: text,
                });
              }}
            ></TextInput>

            <TextInput
              style={styles.input}
              mode="outlined"
              label={"Billing"}
              keyboardType="numeric"
              value={param.billing}
              onChangeText={(text) => {
                setParam({
                  ...param,
                  billing: text,
                });
              }}
            ></TextInput>

            <TextInput
              style={styles.input}
              mode="outlined"
              label={"Transport"}
              value={param.transport}
              onChangeText={(text) => {
                setParam({
                  ...param,
                  transport: text,
                });
              }}
            ></TextInput>

            <TextInput
              style={styles.input}
              mode="outlined"
              label={"Mobile"}
              keyboardType="numeric"
              value={param.mobile}
              onChangeText={(text) => {
                setParam({
                  ...param,
                  mobile: text,
                });
              }}
            ></TextInput>

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

            <View style={styles.container}>
              <Text style={{ marginTop: 8 }}>Image</Text>
              <TouchableRipple
                onPress={async () => {
                  try {
                    const Camera = await Permissions.getAsync(Permissions.CAMERA);
                    const camera_roll = await Permissions.getAsync(Permissions.MEDIA_LIBRARY);

                    let result = { cancelled: true };

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
                          onPress: async () => {
                            let result = await ImagePicker.launchCameraAsync(options).then(
                              (result) => {
                                if (!result.cancelled) {
                                  setImage1({ uri: result.uri });
                                  setParam({
                                    ...param,
                                    file_path: result.base64,
                                  });
                                }
                              }
                            );
                          },
                        },
                        {
                          text: "Gallery",
                          onPress: async () => {
                            await ImagePicker.launchImageLibraryAsync(options).then((result) => {
                              if (!result.cancelled) {
                                setImage1({ uri: result.uri });
                                setParam({
                                  ...param,
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
                }}
              >
                <Image source={Image1} style={{ height: imageHeight, width: imageWidth }} />
              </TouchableRipple>
            </View>

            <Headline style={{ alignSelf: "center", marginBottom: 6 }}>QR Code Details</Headline>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Button
                style={{ width: "100%" }}
                onPress={() => {
                  setqr(true);
                  setScanned(false);
                }}
                icon="qrcode-scan"
              >
                Open QR Scanner
              </Button>
            </View>
            <View
              style={{
                margin: 5,
                flexWrap: "wrap",
                flexDirection: "row",
              }}
            >
              {param.barcodeList.map((item, key) => (
                <Chip
                  key={key}
                  selected={false}
                  mode="outlined" //changing display mode, default is flat.
                  height={30} //give desirable height to chip
                  textStyle={{ color: "white", fontSize: 15 }} //label properties
                  style={{ backgroundColor: "#c9b95a" }} //display diff color BG
                  onClose={() => handleRemoveBarcode(key)}
                  onPress={() => {
                    setBarModal({
                      ...barmodal,
                      index: key,
                      qty: item.qty,
                      visible: true,
                    });
                  }}
                >
                  {item.barcode}
                </Chip>
              ))}
            </View>

            <Headline style={{ alignSelf: "center", marginBottom: 6 }}>Sizes</Headline>

            <View
              style={{
                margin: 5,
                flexWrap: "wrap",
                flexDirection: "row",
              }}
            >
              {IsizeList.sizeList.map((item, key) => (
                <Chip
                  key={key}
                  selected={item.selected}
                  selectedColor="blue"
                  mode="outlined" //changing display mode, default is flat.
                  height={30} //give desirable height to chip
                  textStyle={{ color: "white", fontSize: 15 }} //label properties
                  style={{ backgroundColor: "#c9b95a" }} //display diff color BG
                  onPress={() => SelectSize(key, item.label, item.selected)}
                >
                  {item.label}
                </Chip>
              ))}
            </View>

            <Headline style={{ alignSelf: "center", marginBottom: 6 }}>Colors</Headline>
            <View
              style={{
                margin: 5,
                flexWrap: "wrap",
                flexDirection: "row",
              }}
            >
              {IcolorList.colorList.map((item, key) => (
                <Chip
                  key={key}
                  selected={item.selected}
                  selectedColor="blue"
                  mode="outlined" //changing display mode, default is flat.
                  height={30} //give desirable height to chip
                  textStyle={{ color: "white", fontSize: 15 }} //label properties
                  style={{ backgroundColor: "#c9b95a" }} //display diff color BG
                  onPress={() => selectColor(key, item.label, item.selected)}
                >
                  {item.label}
                </Chip>
              ))}
            </View>

            <Headline style={{ alignSelf: "center", marginBottom: 6 }}>Item Details</Headline>
            <View
              style={{
                margin: 5,
                flexWrap: "wrap",
                flexDirection: "row",
              }}
            >
              {IitemList.itemList.map((item, key) => (
                <Chip
                  key={key}
                  selected={item.selected}
                  selectedColor="blue"
                  mode="outlined" //changing display mode, default is flat.
                  height={30} //give desirable height to chip
                  textStyle={{ color: "white", fontSize: 15 }} //label properties
                  style={{ backgroundColor: "#c9b95a" }} //display diff color BG
                  onPress={() => {
                    selectItem(key, item.label, item.selected);
                  }}
                  onLongPress={() => {
                    setModal({
                      ...modal,
                      index: key,
                      design: item.design,
                      selected: item.selected,
                      visible: true,
                    });
                  }}
                >
                  {item.label}
                </Chip>
              ))}
            </View>

            <Portal>
              <Dialog
                visible={partymodal.party}
                onDismiss={() => {
                  setPartyModal({ ...partymodal, party: false });
                }}
              >
                <Dialog.Title>Select Party </Dialog.Title>
                <Dialog.Content>
                  <SearchableDropdown
                    onItemSelect={(item) => {
                      setParam({
                        ...param,
                        party_id: item.id,
                        party: item.name,
                        mobile: item.mobile,
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
                        postData("StockDropdown/SelectPartyName", { search: text }).then((resp) => {
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
                      setPartyModal({ ...partymodal, party: false });
                    }}
                  >
                    Done
                  </Button>
                </Dialog.Actions>
              </Dialog>

              <Dialog visible={modal.visible} dismissable={true}>
                <Dialog.Title>Design</Dialog.Title>
                <Dialog.Content>
                  <TextInput
                    style={styles.input}
                    mode="outlined"
                    label={"Design"}
                    value={modal.design}
                    onChangeText={(text) => {
                      setModal({
                        ...modal,
                        design: text,
                      });
                    }}
                  ></TextInput>
                </Dialog.Content>
                <Dialog.Actions>
                  <Button
                    mode="contained"
                    color="blue"
                    onPress={() => {
                      AddDesign();
                    }}
                  >
                    Done
                  </Button>
                  <Button
                    mode="contained"
                    color="red"
                    onPress={() => {
                      setModal({ ...modal, visible: false });
                    }}
                  >
                    Close
                  </Button>
                </Dialog.Actions>
              </Dialog>

              <Dialog
                visible={qr}
                dismissable={true}
                style={{ width: width, height: height, alignSelf: "center" }}
              >
                <Dialog.Title style={{ textAlign: "center" }}>Scan QR Code</Dialog.Title>
                <FontAwesome
                  name="close"
                  size={30}
                  color="black"
                  style={{ color: "black", position: "absolute", top: "2%", right: "5%" }}
                  color="#fff"
                  onPress={() => {
                    setqr(false);
                  }}
                />
                <Dialog.Content>
                  <View style={{ width: "100%", height: "55%" }}>
                    <BarCodeScanner
                      //barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
                      onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                      style={[StyleSheet.absoluteFill, styles.barcontainer]}
                    >
                      <View style={styles.layerTop} />
                      <View>
                        <View style={styles.layerLeft} />
                        <View style={styles.focused} />
                        <View style={styles.layerRight} />
                      </View>
                      <View style={styles.layerBottom} />
                    </BarCodeScanner>
                  </View>

                  <View style={{ width: "100%", height: "45%", zIndex: 2 }}>
                    <Text style={{ textAlign: "center" }}>OR</Text>
                    <Title style={{ textAlign: "center" }}>Enter QR CODE</Title>
                    <TextInput
                      style={styles.input}
                      mode="outlined"
                      label={"QR CODE"}
                      onChangeText={(text) => {
                        barcode = text; //handleBarCodeFill(text)
                      }}
                    ></TextInput>
                    <Button
                      mode="contained"
                      color="blue"
                      onPress={() => {
                        handleBarCodeFill();
                      }}
                    >
                      Done
                    </Button>
                  </View>
                </Dialog.Content>
              </Dialog>
              <Dialog visible={partymodal.partyForm} dismissable={true}>
                <Dialog.Title>Add Party</Dialog.Title>
                <Dialog.Content>
                  <View style={{ height: 200 }}>
                    <TextInput
                      style={styles.input}
                      mode="outlined"
                      label={"Party Name"}
                      value={partymodal.party_name}
                      onChangeText={(text) => {
                        setPartyModal({
                          ...partymodal,
                          party_name: text,
                        });
                      }}
                    ></TextInput>
                    <DropDownPicker
                      itemStyle={{
                        justifyContent: "flex-start",
                      }}
                      placeholder="Select Type"
                      style={styles.dropdown}
                      items={typeList}
                      onChangeItem={(item) => {
                        setPartyModal({
                          ...partymodal,
                          type_id: item.value,
                        });
                      }}
                    />
                  </View>
                </Dialog.Content>
                <Dialog.Actions>
                  <Button
                    mode="contained"
                    color="red"
                    onPress={() => {
                      setPartyModal({ ...partymodal, partyForm: false });
                    }}
                  >
                    Close
                  </Button>
                  <Button
                    mode="contained"
                    color="blue"
                    onPress={() => {
                      if (partymodal.party_name == "") {
                        Alert.alert("Fill Party Name");
                      } else if (partymodal.type_id == "") {
                        Alert.alert("Select Type");
                      } else {
                        let _param = {
                          party_name: partymodal.party_name,
                          company_name: "",
                          type_id: partymodal.type_id,
                          user_id: param.user_id,
                        };
                        postData("Masters/InsertContactInPO", _param).then((data) => {
                          if (data.valid) {
                            Alert.alert("Save Succeessfully!!");
                            setPartyModal({ ...partymodal, partyForm: false });
                          } else {
                            Alert.alert(data.msg);
                          }
                          setloading(false);
                        });
                      }
                    }}
                  >
                    Done
                  </Button>
                </Dialog.Actions>
              </Dialog>

              <Dialog visible={barmodal.visible} dismissable={true}>
                <Dialog.Title>Barcode Qty</Dialog.Title>
                <Dialog.Content>
                  <TextInput
                    style={styles.input}
                    mode="outlined"
                    label={"Qty"}
                    value={barmodal.qty}
                    keyboardType="numeric"
                    onChangeText={(text) => {
                      setBarModal({
                        ...barmodal,
                        qty: text,
                      });
                    }}
                  ></TextInput>
                </Dialog.Content>
                <Dialog.Actions>
                  <Button
                    mode="contained"
                    color="blue"
                    onPress={() => {
                      AddBarcodeQty();
                    }}
                  >
                    Done
                  </Button>
                  <Button
                    mode="contained"
                    color="red"
                    onPress={() => {
                      setBarModal({ ...barmodal, visible: false });
                    }}
                  >
                    Close
                  </Button>
                </Dialog.Actions>
              </Dialog>
            </Portal>
          </View>
        </ScrollView>

        <FAB
          style={styles.fabRight}
          icon="check"
          onPress={() => {
            if (param.party_id == "") {
              alert("Please Select Party");
            } else if (param.po_no == "") {
              alert("Please Fill Po No");
            } else if (param.no_of_partial == "" && param.loose == "") {
              alert("Please Fill Either Pethi OR Loose");
            } else {
              setloading(true);
              IsizeList.sizeList.map((item, key) => {
                if (item.selected == true) {
                  param.sizeList.push({ size: item.label });
                }
              });
              IcolorList.colorList.map((item, key) => {
                if (item.selected == true) {
                  param.colorList.push({ color: item.label });
                }
              });
              IitemList.itemList.map((item, key) => {
                if (item.selected == true) {
                  param.itemList.push({ item: item.label, design: item.design });
                }
              });

              postData("Transaction/InsertPo", param).then((data) => {
                if (data.valid) {
                  Alert.alert("Form Save Succeessfully!!");
                  navigation.navigate("podetaillist");
                } else {
                  Alert.alert("Error", data.msg);
                  //console.log(data.msg);
                }
                setloading(false);
              });
            }
          }}
        />
        <FAB
          style={styles.fabLeft}
          icon="close"
          onPress={() => {
            navigation.navigate("podetaillist");
          }}
        />
      </View>
    </Fragment>
  );
}
const opacity = "rgba(0, 0, 0, .6)";
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
  barcontainer: {
    flex: 1,
    flexDirection: "column",
    width: width,
    height: height / 2,
    left: -24,
  },
  layerTop: {
    flex: 2,
    backgroundColor: opacity,
  },
  // layerCenter: {
  //   flex: 1,
  //   flexDirection: 'row'
  // },
  layerLeft: {
    flex: 1,
    backgroundColor: opacity,
  },
  focused: {
    flex: 10,
  },
  layerRight: {
    flex: 1,
    backgroundColor: opacity,
  },
  layerBottom: {
    flex: 2,
    backgroundColor: opacity,
  },
});

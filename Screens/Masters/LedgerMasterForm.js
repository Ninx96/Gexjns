import React from "react";
import {
  Text,
  TextInput,
  FAB,
  TouchableRipple,
  Divider,
  Headline,
  ActivityIndicator,
} from "react-native-paper";
import {
  View,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Alert,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { postData } from "../../_Services/Api_Service";
import { AuthContext } from "../../Components/Context";
import DropDownPicker from "react-native-dropdown-picker";
import DatePicker from "react-native-datepicker";
import Spinner from "react-native-loading-spinner-overlay";
export default function LedgerMasterForm({ route, navigation }) {
  const { ledger_id } = route.params == undefined ? 0 : route.params;
  const { userId } = React.useContext(AuthContext);
  const [isloading, setloading] = React.useState(true);
  const [stateList, setStateList] = React.useState([]);
  const [param, setParam] = React.useState({
    user_id: "",
    ledger_id: ledger_id == undefined ? 0 : ledger_id,
    ledger_name: "",
    address: "",
    city: "",
    pin: "",
    state_id: "",
    state_code: "",
    country: "",
    gstin: "",
    contact_person: "",
    mobile: "",
    email: "",
    advance_balance: "",
    opening_balance: "",
    opening_balance_date: "",
    remarks: "",
  });

  React.useEffect(() => {
    userId().then((data) => {
      setParam({
        ...param,
        user_id: data,
      });
    });
    postData("StockDropdown/StateList", "").then((resp) => {
      setStateList(resp);
    });

    if (ledger_id != undefined) {
      setTimeout(() => {
        Preview();
      }, 1000);
    } else {
      setloading(false);
    }
  }, []);

  const Preview = () => {
    postData("Masters/PreviewLedger", param).then((data) => {
      setParam({
        ...param,
        ledger_id: data.ledger_id,
        ledger_name: data.ledger_name,
        address: data.address,
        city: data.city,
        pin: data.pin,
        state_id: data.state_id,
        state_code: data.state_code,
        country: data.country,
        gstin: data.gstin,
        contact_person: data.contact_person,
        mobile: data.mobile,
        email: data.email,
        remarks: data.remarks,
        advance_balance: data.advance_balance,
        opening_balance: data.opening_balance,
        opening_balance_date: data.opening_balance_date,
      });
      setloading(false);
    });
  };
  const FillStateCode = (id) => {
    param.state_id = id;
    let data = {
      state_id: id,
    };
    postData("StockDropdown/StateCode", data).then((resp) => {
      setParam({
        ...param,
        state_code: resp.state_code,
      });
    });
  };

  let dimensions = Dimensions.get("window");
  let imageWidth = Math.round((dimensions.width * 12) / 16);
  let imageHeight = Math.round(imageWidth / 2);
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
	  
      <SafeAreaView>
        <ScrollView>
          <View style={{ padding: 50 }}>
            <Headline style={{ alignSelf: "center", marginBottom: 6 }}>
              Details
            </Headline>
            <TextInput
              mode="outlined"
              style={styles.input}
              label={"Ledger Name"}
              value={param.ledger_name}
              onChangeText={(text) => {
                setParam({
                  ...param,
                  ledger_name: text,
                });
              }}
            ></TextInput>

            <TextInput
              style={styles.input}
              mode="outlined"
              label={"Address"}
              value={param.address}
              onChangeText={(text) => {
                setParam({
                  ...param,
                  address: text,
                });
              }}
            ></TextInput>

            <TextInput
              style={styles.input}
              mode="outlined"
              label={"City"}
              value={param.city}
              onChangeText={(text) => {
                setParam({
                  ...param,
                  city: text,
                });
              }}
            ></TextInput>

            <TextInput
              style={styles.input}
              mode="outlined"
              label={"Pin"}
              value={param.pin}
              onChangeText={(text) => {
                setParam({
                  ...param,
                  pin: text,
                });
              }}
            ></TextInput>

            <DropDownPicker
              items={stateList}
              placeholder="Select State"
              style={{ backgroundColor: "#ffffff" }}
              itemStyle={{
                justifyContent: "flex-start",
              }}
              dropDownStyle={{ backgroundColor: "#ffffff" }}
              defaultValue={param.state_id}
              onChangeItem={(item) => {
                setParam({
                  ...param,
                  state_id: item.value,
                });
                FillStateCode(item.value);
              }}
            />
            <TextInput
              style={styles.input}
              mode="outlined"
              label={"State Code"}
              value={param.state_code}
              disabled
              onChangeText={(text) => {
                setParam({
                  ...param,
                  state_code: text,
                });
              }}
            ></TextInput>

            <TextInput
              style={styles.input}
              mode="outlined"
              label={"Country"}
              value={param.country}
              onChangeText={(text) => {
                setParam({
                  ...param,
                  country: text,
                });
              }}
            ></TextInput>

            <TextInput
              style={styles.input}
              mode="outlined"
              label={"GSTIN"}
              value={param.gstin}
              onChangeText={(text) => {
                setParam({
                  ...param,
                  gstin: text,
                });
              }}
            ></TextInput>

            <TextInput
              style={styles.input}
              mode="outlined"
              label={"Contact Person"}
              value={param.contact_person}
              onChangeText={(text) => {
                setParam({
                  ...param,
                  contact_person: text,
                });
              }}
            ></TextInput>

            <TextInput
              style={styles.input}
              mode="outlined"
              label={"Mobile"}
              value={param.mobile}
              onChangeText={(text) => {
                setParam({
                  ...param,
                  mobile: text,
                });
              }}
            ></TextInput>

            <TextInput
              style={styles.input}
              mode="outlined"
              label={"Email"}
              value={param.email}
              onChangeText={(text) => {
                setParam({
                  ...param,
                  email: text,
                });
              }}
            ></TextInput>
            <TextInput
              style={styles.input}
              mode="outlined"
              label={"Advance Balance"}
              value={param.advance_balance}
              onChangeText={(text) => {
                setParam({
                  ...param,
                  advance_balance: text,
                });
              }}
            ></TextInput>

            <TextInput
              style={styles.input}
              mode="outlined"
              label={"Opening Balance"}
              value={param.opening_balance}
              onChangeText={(text) => {
                setParam({
                  ...param,
                  opening_balance: text,
                });
              }}
            ></TextInput>

            <DatePicker
              style={{ width: imageWidth, marginTop: 4, marginBottom: 4 }}
              date={param.opening_balance_date}
              mode="date"
              placeholder="select date"
              format="DD/MM/YYYY"
              onDateChange={(date) => {
                setParam({
                  ...param,
                  opening_balance_date: date,
                });
              }}
            />
            <TextInput
              style={styles.input}
              mode="outlined"
              label={"Remarks"}
              multiline
              numberOfLines={4}
              value={param.remarks}
              onChangeText={(text) => {
                setParam({
                  ...param,
                  remarks: text,
                });
              }}
            ></TextInput>
          </View>
        </ScrollView>
      </SafeAreaView>
      <FAB
        style={styles.fabRight}
        icon="check"
        onPress={() => {
          if (param.ledger_name == "") {
            alert("Please Fill Ledger Name");
          } else {
            setloading(true);
            postData("Masters/InsertLedger", param).then((data) => {
              setloading(false);
              if (data.valid) {
                Alert.alert("Save Succeessfully!!");
                navigation.goBack();
              } else {
                Alert.alert(data.msg);
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
  spinnerTextStyle: {
    color: "#FFF",
  },
});

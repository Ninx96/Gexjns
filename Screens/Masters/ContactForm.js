import React from "react";
import {
  Text,
  TextInput,
  Checkbox,
  Paragraph,
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
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { postData } from "../../_Services/Api_Service";
import { AuthContext } from "../../Components/Context";
import DropDownPicker from "react-native-dropdown-picker";
import Spinner from "react-native-loading-spinner-overlay";
export default function ContactForm({ route, navigation }) {
  const { contact_id } = route.params == undefined ? 0 : route.params;
  const { userId } = React.useContext(AuthContext);
  const [isloading, setloading] = React.useState(true);
  const [stateList, setStateList] = React.useState([]);
  const [typeList, setTypeList] = React.useState([]);
  const [param, setParam] = React.useState({
    user_id: "",
    contact_id: contact_id == undefined ? 0 : contact_id,
    party_name: "",
    company_name: "",
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
    remarks: "",
    ledger: false,
    customer: false,
    type_id: "",
    opening_balance: "",
    opening_balance_date: "",
    advance_balance: "",
    advance_balance_date: "",
    disable: false,
    tds: "",
    owner_name: "",
    owner_mobile: "",
    dis_per: "",
    dis_per_pc: "",
    extra_dis_per: "",
    extra_dis_pc: "",
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
    postData("StockDropdown/GetTypeList", "").then((resp) => {
      setTypeList(resp);
    });
    if (contact_id != undefined) {
      setTimeout(() => {
        Preview();
      }, 1000);
    } else {
      setloading(false);
    }
  }, []);

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

  const Preview = () => {
    let data = {
      contact_id: param.contact_id,
    };
    postData("Masters/PreviewContact", data).then((resp) => {
      setParam({
        ...param,
        contact_id: resp.contact_id,
        party_name: resp.party_name,
        company_name: resp.company_name,
        address: resp.address,
        city: resp.city,
        pin: resp.pin,
        state: resp.state,
        state_id: resp.state_id,
        state_code: resp.state_code,
        country: resp.country,
        gstin: resp.gstin,
        contact_person: resp.contact_person,
        mobile: resp.mobile,
        email: resp.email,
        remarks: resp.remarks,
        ledger: resp.ledger == "True" ? true : false,
        customer: resp.customer == "True" ? true : false,
        type_id: resp.type_id,
        disable: resp.disable == "True" ? true : false,
        tds: resp.tds,
        owner_name: resp.owner_name,
        owner_mobile: resp.owner_mobile,
        dis_per: resp.dis_per,
        dis_per_pc: resp.dis_per_pc,
        extra_dis_per: resp.extra_dis_per,
        extra_dis_pc: resp.extra_dis_pc,
      });
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
      <SafeAreaView>
        <ScrollView>
          <View style={{ padding: 50 }}>
            <Headline style={{ alignSelf: "center", marginBottom: 6 }}>
              Details
            </Headline>
            <TextInput
              mode="outlined"
              style={styles.input}
              label={"Party Name"}
              value={param.party_name}
              onChangeText={(text) => {
                setParam({
                  ...param,
                  party_name: text,
                });
              }}
            ></TextInput>
            <TextInput
              mode="outlined"
              style={styles.input}
              label={"Company Name"}
              value={param.company_name}
              onChangeText={(text) => {
                setParam({
                  ...param,
                  company_name: text,
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

            <Text>Ledger</Text>
            <Checkbox
              color="#03dac4"
              status={param.ledger ? "checked" : "unchecked"}
              onPress={() => {
                setParam({
                  ...param,
                  ledger: !param.ledger,
                });
              }}
            ></Checkbox>

            <Text>Customer</Text>
            <Checkbox
              color="#03dac4"
              status={param.customer ? "checked" : "unchecked"}
              onPress={() => {
                setParam({
                  ...param,
                  customer: !param.customer,
                });
              }}
            ></Checkbox>

            <Text>Disable</Text>
            <Checkbox
              color="#03dac4"
              status={param.disable ? "checked" : "unchecked"}
              onPress={() => {
                setParam({
                  ...param,
                  disable: !param.disable,
                });
              }}
            ></Checkbox>

            <DropDownPicker
              items={typeList}
              placeholder="Select Type"
              style={{ backgroundColor: "#ffffff" }}
              itemStyle={{
                justifyContent: "flex-start",
              }}
              dropDownStyle={{ backgroundColor: "#ffffff" }}
              defaultValue={param.type_id}
              onChangeItem={(item) => {
                setParam({
                  ...param,
                  type_id: item.value,
                });
              }}
            />

            <TextInput
              style={styles.input}
              mode="outlined"
              label={"TDS"}
              value={param.tds}
              onChangeText={(text) => {
                setParam({
                  ...param,
                  tds: text,
                });
              }}
            ></TextInput>
            <TextInput
              style={styles.input}
              mode="outlined"
              label={"Owner Name"}
              value={param.owner_name}
              onChangeText={(text) => {
                setParam({
                  ...param,
                  owner_name: text,
                });
              }}
            ></TextInput>

            <TextInput
              style={styles.input}
              mode="outlined"
              label={"Owner Mobile"}
              value={param.owner_mobile}
              onChangeText={(text) => {
                setParam({
                  ...param,
                  owner_mobile: text,
                });
              }}
            ></TextInput>
            <TextInput
              style={styles.input}
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
            <TextInput
              style={styles.input}
              mode="outlined"
              label={"Dis Per"}
              value={param.dis_per}
              onChangeText={(text) => {
                setParam({
                  ...param,
                  dis_per: text,
                });
              }}
            ></TextInput>
            <TextInput
              style={styles.input}
              mode="outlined"
              label={"Dis Per Pc"}
              value={param.dis_per_pc}
              onChangeText={(text) => {
                setParam({
                  ...param,
                  dis_per_pc: text,
                });
              }}
            ></TextInput>
            <TextInput
              style={styles.input}
              mode="outlined"
              label={"Extra Dis Per"}
              value={param.extra_dis_per}
              onChangeText={(text) => {
                setParam({
                  ...param,
                  extra_dis_per: text,
                });
              }}
            ></TextInput>
            <TextInput
              style={styles.input}
              mode="outlined"
              label={"Extra Dis Pc"}
              value={param.extra_dis_pc}
              onChangeText={(text) => {
                setParam({
                  ...param,
                  extra_dis_pc: text,
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
          if (param.party_name == "") {
            alert("Please Fill Party Name");
          } else {
            setloading(true);
            postData("Masters/InsertContact", param).then((data) => {
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

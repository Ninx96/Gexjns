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
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { postData } from "../../_Services/Api_Service";
import { AuthContext } from "../../Components/Context";
import DropDownPicker from "react-native-dropdown-picker";
import Spinner from "react-native-loading-spinner-overlay";
export default function CompanyForm({ route, navigation }) {
  const { company_id } = route.params == undefined ? 0 : route.params;
  const { userId } = React.useContext(AuthContext);
  const [isloading, setloading] = React.useState(true);
  const [stateList, setStateList] = React.useState([]);
  const [param, setParam] = React.useState({
    user_id: "",
    company_id: company_id == undefined ? 0 : company_id,
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
    phone: "",
    email: "",
    bank: "",
    bank_branch: "",
    account_no: "",
    ifsc_code: "",
    payment_terms: "",
    logo_path: "",
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

    if (company_id != undefined) {
      Preview();
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
      company_id: param.company_id,
    };
    postData("Masters/Previewcompany", data).then((resp) => {
      setParam({
        ...param,
        company_id: resp.company_id,
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
        phone: resp.phone,
        bank: resp.bank,
        bank_branch: resp.bank_branch,
        account_no: resp.account_no,
        ifsc_code: resp.ifsc_code,
        payment_terms: resp.payment_terms,
        logo_path: resp.logo_path,
        remarks: resp.remarks,
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
            <TextInput
              style={styles.input}
              mode="outlined"
              label={"Phone"}
              value={param.phone}
              onChangeText={(text) => {
                setParam({
                  ...param,
                  phone: text,
                });
              }}
            ></TextInput>

            <TextInput
              style={styles.input}
              mode="outlined"
              label={"Bank"}
              value={param.bank}
              onChangeText={(text) => {
                setParam({
                  ...param,
                  bank: text,
                });
              }}
            ></TextInput>
            <TextInput
              style={styles.input}
              mode="outlined"
              label={"Bank Branch"}
              value={param.bank_branch}
              onChangeText={(text) => {
                setParam({
                  ...param,
                  bank_branch: text,
                });
              }}
            ></TextInput>
            <TextInput
              style={styles.input}
              mode="outlined"
              label={"Account No"}
              value={param.account_no}
              onChangeText={(text) => {
                setParam({
                  ...param,
                  account_no: text,
                });
              }}
            ></TextInput>
            <TextInput
              style={styles.input}
              mode="outlined"
              label={"IFSC Code"}
              value={param.ifsc_code}
              onChangeText={(text) => {
                setParam({
                  ...param,
                  ifsc_code: text,
                });
              }}
            ></TextInput>

            <TextInput
              style={styles.input}
              mode="outlined"
              label={"Payment Terms"}
              value={param.payment_terms}
              onChangeText={(text) => {
                setParam({
                  ...param,
                  payment_terms: text,
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
          </View>
        </ScrollView>
      </SafeAreaView>
      <FAB
        style={styles.fabRight}
        icon="check"
        onPress={() => {
          if (param.company_name == "") {
            alert("Please Fill Company Name");
          } else {
            setloading(true);
            postData("Masters/InsertCompany", param).then((data) => {
              setloading(false);
              if (data.valid) {
                Alert.alert("Save Succeessfully!!");
                navigation.goBack();
                //navigation.navigate("companylist");
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
          //navigation.navigate("companylist");
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

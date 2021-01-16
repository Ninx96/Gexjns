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
import Spinner from "react-native-loading-spinner-overlay";
export default function BrokerForm({ route, navigation }) {
  const { broker_id } = route.params == undefined ? 0 : route.params;
  const { userId } = React.useContext(AuthContext);
  const [isloading, setloading] = React.useState(true);
  const [param, setParam] = React.useState({
    user_id: "",
    broker_id: broker_id == undefined ? 0 : broker_id,
    company_name: "",
    gaddi_name: "",
    address: "",
    city: "",
    pin: "",
    state: "",
    country: "",
    gstin: "",
    contact_person: "",
    mobile: "",
    email: "",
    remarks: "",
    commission: "",
    emp: [],
  });

  React.useEffect(() => {
    userId().then((data) => {
      setParam({
        ...param,
        user_id: data,
      });
    });
    if (broker_id != undefined) {
      Preview();
    } else {
      setloading(false);
    }
  }, []);

  const Preview = () => {
    postData("Masters/PreviewBroker", param).then((data) => {
      setParam({
        ...param,
        broker_id: data.broker_id,
        company_name: data.company_name,
        gaddi_name: data.gaddi_name,
        address: data.address,
        city: data.city,
        pin: data.pin,
        state: data.state,
        country: data.country,
        gstin: data.gstin,
        contact_person: data.contact_person,
        mobile: data.mobile,
        email: data.email,
        remarks: data.remarks,
        commission: data.commission,
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
              label={"Gaddi Name"}
              value={param.gaddi_name}
              onChangeText={(text) => {
                setParam({
                  ...param,
                  gaddi_name: text,
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

            <TextInput
              style={styles.input}
              mode="outlined"
              label={"State"}
              value={param.state}
              onChangeText={(text) => {
                setParam({
                  ...param,
                  state: text,
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
              label={"Commission"}
              value={param.commission}
              onChangeText={(text) => {
                setParam({
                  ...param,
                  commission: text,
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
            postData("Masters/InsertBroker", param).then((data) => {
              setloading(false);
              if (data.valid) {
                Alert.alert("Form Save Succeessfully!!");
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

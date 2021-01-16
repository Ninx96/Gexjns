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
export default function DiscountFareForm({ route, navigation }) {
  const { tran_id } = route.params == undefined ? 0 : route.params;
  const { userId } = React.useContext(AuthContext);
  const [isloading, setloading] = React.useState(true);
  const [param, setParam] = React.useState({
    tran_id: tran_id == undefined ? 0 : tran_id,
    from_date: "",
    to_date: "",
    discount_per: "",
    per_pc: "",
    remarks: "",
    type: "",
    user_id: "",
  });

  let dimensions = Dimensions.get("window");
  let imageWidth = Math.round((dimensions.width * 12) / 16);

  React.useEffect(() => {
    userId().then((data) => {
      param.user_id = data;
    });
    Preview();
  }, []);

  const Preview = () => {
    postData("Masters/PreviewDiscountFare", param).then((data) => {
      //console.log(data);
      setParam(data);
      setloading(false);
    });
    //console.log(param);
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
              Discount Fare Details
            </Headline>
            <Text style={{ marginTop: 8 }}>From Date</Text>
            <DatePicker
              style={{ width: imageWidth, marginTop: 4, marginBottom: 4 }}
              date={param.from_date}
              mode="date"
              placeholder="Select From Date"
              format="DD/MM/YYYY"
              onDateChange={(date) => {
                setParam({
                  ...param,
                  from_date: date,
                });
              }}
            />

            <Text style={{ marginTop: 8 }}>To Date</Text>
            <DatePicker
              style={{ width: imageWidth, marginTop: 4, marginBottom: 4 }}
              date={param.to_date}
              mode="date"
              placeholder="Select To Date"
              format="DD/MM/YYYY"
              onDateChange={(date) => {
                setParam({
                  ...param,
                  to_date: date,
                });
              }}
            />

            <TextInput
              style={styles.input}
              mode="outlined"
              label={"Discount %"}
              value={param.discount_per}
              onChangeText={(text) => {
                setParam({
                  ...param,
                  discount_per: text,
                });
              }}
            ></TextInput>

            <TextInput
              style={styles.input}
              mode="outlined"
              label={"Per PC"}
              value={param.per_pc}
              onChangeText={(text) => {
                setParam({
                  ...param,
                  per_pc: text,
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
              label={"Type"}
              value={param.type}
              onChangeText={(text) => {
                setParam({
                  ...param,
                  type: text,
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
          postData("Masters/InsertDiscountFare", param).then((data) => {
            if (data.valid) {
              Alert.alert("Form Save Succeessfully!!");
              navigation.goBack();
            } else {
              Alert.alert("Error", data.msg);
            }
          });
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

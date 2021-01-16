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
import Spinner from "react-native-loading-spinner-overlay";
export default function FabricForm({ route, navigation }) {
  const { tran_id } = route.params == undefined ? 0 : route.params;
  const { userId } = React.useContext(AuthContext);
  const [isloading, setloading] = React.useState(true);
  const [CategoryList, setCategoryList] = React.useState([]);
  const [param, setParam] = React.useState({
    fabric_id: tran_id == undefined ? 0 : tran_id,
    category_id: "",
    fabric_code: "",
    fabric_name: "",
    color: "",
    description: "",
    remarks: "",
    user_id: "",
  });

  let dimensions = Dimensions.get("window");
  let imageWidth = Math.round((dimensions.width * 12) / 16);

  React.useEffect(() => {
    userId().then((data) => {
      param.user_id = data;
    });
    postData("StockDropdown/GetCategoryList", "").then((data) => {
      //console.log(data);
      setCategoryList(data);
    });
    Preview();
  }, []);

  const Preview = () => {
    postData("Masters/PreviewFabric", param).then((data) => {
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
              Fabric Details
            </Headline>
            <TextInput
              style={styles.input}
              mode="outlined"
              label={"Fabric Code"}
              value={param.fabric_code}
              onChangeText={(text) => {
                setParam({
                  ...param,
                  fabric_code: text,
                });
              }}
            ></TextInput>

            <TextInput
              style={styles.input}
              mode="outlined"
              label={"Fabric Name"}
              value={param.fabric_name}
              onChangeText={(text) => {
                setParam({
                  ...param,
                  fabric_name: text,
                });
              }}
            ></TextInput>

            <Text style={{ marginTop: 8 }}>Category</Text>
            <DropDownPicker
              itemStyle={{
                justifyContent: "flex-start",
              }}
              style={styles.dropdown}
              items={CategoryList}
              onChangeItem={(item) => {
                setparam({
                  ...param,
                  category_id: item.value,
                });
              }}
            />

            <TextInput
              style={styles.input}
              mode="outlined"
              label={"Color"}
              value={param.color}
              onChangeText={(text) => {
                setParam({
                  ...param,
                  color: text,
                });
              }}
            ></TextInput>

            <TextInput
              style={styles.input}
              mode="outlined"
              label={"Description"}
              value={param.description}
              onChangeText={(text) => {
                setParam({
                  ...param,
                  description: text,
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
          postData("Masters/InsertFabric", param).then((data) => {
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

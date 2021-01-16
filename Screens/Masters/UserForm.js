import React from "react";
import {
  Text,
  TextInput,
  Paragraph,
  FAB,
  TouchableRipple,
  Divider,
  Headline,
  ActivityIndicator,
  Checkbox,
} from "react-native-paper";
import {
  View,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Alert,
  CheckBox,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { postData, getData } from "../../_Services/Api_Service";
import { AuthContext } from "../../Components/Context";
import DropDownPicker from "react-native-dropdown-picker";
import { Table, Row } from "react-native-table-component";
import { set } from "react-native-reanimated";
import Spinner from "react-native-loading-spinner-overlay";
export default function UserForm({ route, navigation }) {
  const { muser_id } = route.params == undefined ? 0 : route.params;
  const { userId } = React.useContext(AuthContext);
  const [isloading, setloading] = React.useState(true);
  const [rightsData, setRights] = React.useState([]);
  const [isvisible, setVisible] = React.useState(true);

  const [param, setParam] = React.useState({
    user_id: "",
    muser_id: muser_id == undefined ? 0 : muser_id,
    full_name: "",
    mobile: "",
    email: "",
    password: "",
    disable: "",
    production_hide: "",
    production_delete: "",
    user_rights: [],
  });
  const widthArr = [150, 50, 50, 50, 50, 50];
  React.useEffect(() => {
    let user_id = "";
    userId().then((data) => {
      user_id = data;
      param.user_id = data;
      setParam({
        ...param,
        user_id: data,
      });
    });

    let _param = {
      user_id: muser_id == undefined ? 0 : muser_id,
    };
    postData("Masters/BrowseUserRightsList", _param).then((data) => {
      setRights(data);
      setloading(false);
    });

    if (muser_id != undefined) {
      setTimeout(() => {
        Preview();
      }, 1000);
    } else {
      setloading(false);
    }
  }, []);

  const Preview = () => {
    let data = {
      user_id: param.muser_id,
    };
    postData("Masters/PreviewUser", data).then((resp) => {
      setParam({
        ...param,
        muser_id: resp.user_id,
        full_name: resp.full_name,
        mobile: resp.mobile,
        email: resp.email,
        disable: resp.disable,
        production_hide: resp.production_hide,
        production_delete: resp.production_delete,
      });
      setVisible(false);
      setloading(false);
    });
  };

  const ViewRights = (view, index) => {
    return (
      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        <CheckBox
          value={view == "True" ? true : false}
          onValueChange={(e) => {
            let newrr = [...rightsData];
            newrr[index].view_right =
              newrr[index].view_right == "True" ? "False" : "True"; //Boolean(!rightsData[index].view_right);
            setRights(newrr);
          }}
        />
      </View>
    );
  };
  const InsertRights = (view, index) => {
    return (
      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        <CheckBox
          value={view == "True" ? true : false}
          onValueChange={(e) => {
            let newrr = [...rightsData];
            newrr[index].insert_right =
              newrr[index].insert_right == "True" ? "False" : "True"; //Boolean(!rightsData[index].view_right);
            setRights(newrr);
          }}
        />
      </View>
    );
  };
  const DeleteRights = (view, index) => {
    return (
      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        <CheckBox
          value={view == "True" ? true : false}
          onValueChange={(e) => {
            let newrr = [...rightsData];
            newrr[index].delete_right =
              newrr[index].delete_right == "True" ? "False" : "True";
            setRights(newrr);
          }}
        />
      </View>
    );
  };
  const EditRights = (view, index) => {
    return (
      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        <CheckBox
          value={view == "True" ? true : false}
          onValueChange={(e) => {
            let newrr = [...rightsData];
            newrr[index].edit_right =
              newrr[index].edit_right == "True" ? "False" : "True"; //Boolean(!rightsData[index].view_right);
            setRights(newrr);
          }}
        />
      </View>
    );
  };
  const PrintRights = (view, index) => {
    return (
      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        <CheckBox
          value={view == "True" ? true : false}
          onValueChange={(e) => {
            let newrr = [...rightsData];
            newrr[index].print_right =
              newrr[index].print_right == "True" ? "False" : "True"; //Boolean(!rightsData[index].view_right);
            setRights(newrr);
          }}
        />
      </View>
    );
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
      
        <ScrollView>
          <View style={{ padding: 50 }}>
            <Headline style={{ alignSelf: "center", marginBottom: 6 }}>
              Details
            </Headline>
            <TextInput
              mode="outlined"
              style={styles.input}
              label={"Full Name"}
              value={param.full_name}
              onChangeText={(text) => {
                setParam({
                  ...param,
                  full_name: text,
                });
              }}
            ></TextInput>
            <TextInput
              mode="outlined"
              style={styles.input}
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
            {isvisible ? (
              <TextInput
                style={styles.input}
                mode="outlined"
                label={"Password"}
                value={param.password}
                onChangeText={(text) => {
                  setParam({
                    ...param,
                    password: text,
                  });
                }}
              ></TextInput>
            ) : (
              <View></View>
            )}
            <Text>User Disable</Text>
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
            <Text>Production Level Hide</Text>
            <Checkbox
              color="#03dac4"
              status={param.production_hide ? "checked" : "unchecked"}
              onPress={() => {
                setParam({
                  ...param,
                  production_hide: !param.production_hide,
                });
              }}
            ></Checkbox>
            <Text>Production Level Delete</Text>
            <Checkbox
              color="#03dac4"
              status={param.production_delete ? "checked" : "unchecked"}
              onPress={() => {
                setParam({
                  ...param,
                  production_delete: !param.production_delete,
                });
              }}
            ></Checkbox>
          </View>
          <ScrollView horizontal={true}>
          <Table borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}>
            <Row
              data={[
                "Transaction Name",
                "View",
                "Insert",
                "Delete",
                "Edit",
                "Print",
              ]}
              style={styles.head}
              textStyle={styles.text}
              widthArr={widthArr}
            />
            {rightsData.map((item, index) => {
              return (
                <Row
                  key={index}
                  data={[
                    item.transaction_name,
                    ViewRights(item.view_right, index),
                    InsertRights(item.insert_right, index),
                    DeleteRights(item.delete_right, index),
                    EditRights(item.edit_right, index),
                    PrintRights(item.print_right, index),
                  ]}
                  style={styles.row}
                  textStyle={styles.text}
                  widthArr={widthArr}
                />
              );
            })}
          </Table>
        </ScrollView>
     
        </ScrollView>
      
      <FAB
        style={styles.fabRight}
        icon="check"
        onPress={() => {
          param.user_rights = rightsData;
          postData("Masters/InsertUser", param).then((data) => {
            if (data.valid) {
              Alert.alert("Save Succeessfully!!");
              navigation.goBack();
            } else {
              Alert.alert(data.msg);
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

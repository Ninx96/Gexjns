import React from "react";
import {
  Text,
  TextInput,
  FAB,
  TouchableRipple,
  Dialog,
  Button,
  ActivityIndicator,
  Portal,
} from "react-native-paper";
import { View, ScrollView, SafeAreaView, StyleSheet, Alert, Dimensions } from "react-native";
import { postData } from "../_Services/Api_Service";
import { AuthContext } from "../Components/Context";
import DatePicker from "react-native-datepicker";
import SearchableDropdown from "react-native-searchable-dropdown";
import Spinner from "react-native-loading-spinner-overlay";
export default function PaymentForm({ route, navigation }) {
  const { payment_id } = route.params == undefined ? 0 : route.params;
  const { userId } = React.useContext(AuthContext);
  const [isloading, setloading] = React.useState(true);
  const [partyList, setPartyList] = React.useState([]);
  const [modal, setModal] = React.useState({
    type: "",
    visible: false,
  });
  const [param, setParam] = React.useState({
    payment_id: payment_id == undefined ? 0 : payment_id,
    date: "",
    from_party: "",
    from_party_id: "",
    to_party: "",
    to_party_id: "",
    amount: "",
    remarks: "",
    user_id: "",
  });

  React.useEffect(() => {
    userId().then((data) => {
      param.user_id = data;
    });
    if (payment_id != undefined) {
      Preview();
    } else {
      setloading(false);
    }
  }, []);

  const Preview = () => {
    postData("Transaction/PreviewPayment", param).then((data) => {
      param.payment_id = data.payment_id;
      param.date = data.date;
      param.from_party = data.from_party;
      param.from_party_id = data.from_party_id;
      param.to_party = data.to_party;
      param.to_party_id = data.to_party_id;
      param.amount = data.amount;
      param.remarks = data.remarks;
      setParam({ ...param });
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
      <Portal>
        <Dialog
          visible={modal.visible}
          onDismiss={() => {
            setModal({ ...modal, visible: false });
          }}
        >
          <Dialog.Title>Select Party </Dialog.Title>
          <Dialog.Content>
            <SearchableDropdown
              onItemSelect={(item) => {
                if (modal.type === "from") {
                  param.from_party_id = item.id;
                  param.from_party = item.name;
                } else {
                  param.to_party_id = item.id;
                  param.to_party = item.name;
                }
                setParam({ ...param });
                //console.log(param);
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
                setModal({ ...modal, visible: false });
              }}
            >
              Done
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <SafeAreaView>
        <ScrollView>
          <View style={{ padding: 50 }}>
            <DatePicker
              style={{ width: 260, marginTop: 4, marginBottom: 4 }}
              date={param.date}
              mode="date"
              placeholder="Select date"
              format="DD/MM/YYYY"
              showIcon={false}
              onDateChange={(date) => {
                setParam({
                  ...param,
                  date: date,
                });
              }}
              customStyles={{
                dateInput: {
                  borderRadius: 5,
                },
              }}
            />

            <TouchableRipple
              onPress={() => {
                setModal({ ...modal, visible: true, type: "from" });
              }}
            >
              <TextInput
                style={styles.input}
                mode="outlined"
                label={"From Party"}
                value={param.from_party}
                editable={false}
              ></TextInput>
            </TouchableRipple>

            <TouchableRipple
              onPress={() => {
                setModal({ ...modal, visible: true, type: "to" });
              }}
            >
              <TextInput
                style={styles.input}
                mode="outlined"
                label={"To Party"}
                value={param.to_party}
                editable={false}
              ></TextInput>
            </TouchableRipple>

            <TextInput
              style={styles.input}
              mode="outlined"
              label={"Amount"}
              value={param.amount}
              keyboardType="numeric"
              onChangeText={(text) => {
                setParam({
                  ...param,
                  amount: text,
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
          </View>
        </ScrollView>
      </SafeAreaView>
      <FAB
        style={styles.fabRight}
        icon="check"
        onPress={() => {
          if (param.date === "") {
            Alert.alert("Select date");
          } else if (param.from_party_id === "") {
            Alert.alert("Fill from party");
          } else if (param.to_party_id === "") {
            Alert.alert("Fill to party");
          } else if (param.amount === "") {
            Alert.alert("Fill Amount");
          } else {
            postData("Transaction/InsertPayment", param).then((data) => {
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

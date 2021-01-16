import * as React from "react";
import { SafeAreaView, StyleSheet, ScrollView, View, Dimensions } from "react-native";
import {
  BottomNavigation,
  Button,
  Title,
  Text,
  Divider,
  DataTable,
  Dialog,
  Portal,
  TextInput,
} from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { AuthContext } from "../Components/Context";
import { postData } from "../_Services/Api_Service";
import Spinner from "react-native-loading-spinner-overlay";
import StepIndicator from "react-native-step-indicator";
import Moment from "moment";
import font from "../fonts.js";
import DatePicker from "react-native-datepicker";
import { FontAwesome, EvilIcons } from "@expo/vector-icons";

function AllScreen({ navigation }) {
  const { userId } = React.useContext(AuthContext);
  const [isloading, setloading] = React.useState(false);
  const [param, setParam] = React.useState({
    user_id: "",
    from_date: "",
    to_date: "",
  });
  const [trackList, setTrackList] = React.useState([]);
  const [trackparam, setTrackParam] = React.useState({
    user_id: "",
    status: "",
    party_name: "",
    gaddi_name: "",
    skip: 0,
  });
  const [page, setPage] = React.useState(0);
  const itemsPerPage = trackList.length > 10 ? 10 : trackList.length;
  const labels = ["Packing Slip", "Kacha Bill", "Pakka Bill", "Status", "Order", "Balance"];
  const [modal, setModal] = React.useState(false);
  React.useEffect(() => {
    userId().then((data) => {
      param.user_id = data;
      postData("StockDashboard/PreviewDateFilter", param).then((data) => {
        param.from_date = data.from_date;
        param.to_date = data.to_date;
        setParam({ ...param });
      });
      trackparam.user_id = data;
      Refresh();
    });

    navigation.addListener("tabPress", (e) => {
      userId().then((data) => {
        param.user_id = data;
        postData("StockDashboard/PreviewDateFilter", param).then((data) => {
          param.from_date = data.from_date;
          param.to_date = data.to_date;
          setParam({ ...param });
        });
        trackparam.user_id = data;
        postData("StockDashboard/OrderTrackList", trackparam).then((data) => {
          setTrackList(data);
          setloading(false);
        });
      });
    });
  }, [navigation]);

  const Refresh = () => {
    setloading(true);
    postData("StockDashboard/OrderTrackList", trackparam).then((data) => {
      setTrackList(data);
      setloading(false);
    });
  };

  return (
    <View style={{ flex: 1, padding: 5 }}>
      <Spinner
        visible={isloading}
        textContent={"Loading.."}
        textStyle={styles.spinnerTextStyle}
        size={"large"}
        color={"#6200ee"}
        animation={"fade"}
        textStyle={{ color: "#6200ee" }}
      />

      <View style={{ lex: 1, flexDirection: "row", alignItems: "center" }}>
        <View style={{ flex: 1 }}>
          <TextInput
            style={styles.input}
            mode="outlined"
            label={"Party Name"}
            onChangeText={(text) => {
              trackparam.party_name = text;
              postData("StockDashboard/OrderTrackList", trackparam).then((data) => {
                setTrackList(data);
              });
              setTrackParam({
                ...trackparam,
                party_name: text,
              });
            }}
          ></TextInput>
        </View>
        <View style={{ flex: 1 }}>
          <TextInput
            style={styles.input}
            mode="outlined"
            label={"Gaddi Name"}
            onChangeText={(text) => {
              trackparam.gaddi_name = text;
              postData("StockDashboard/OrderTrackList", trackparam).then((data) => {
                setTrackList(data);
              });
              setTrackParam({
                ...trackparam,
                gaddi_name: text,
              });
            }}
          ></TextInput>
        </View>
        <EvilIcons
          name="arrow-right"
          size={40}
          color="#6200ee"
          onPress={() => {
            Refresh();
          }}
        />
        <FontAwesome
          name="filter"
          size={40}
          color="#6200ee"
          onPress={() => {
            setModal(true);
          }}
        />
      </View>

      <ScrollView>
        {trackList.map((item, index) => {
          return (
            <>
              <Title
                style={{ fontFamily: font.bold, fontSize: 13, marginBottom: 10, marginTop: 10 }}
              >
                {item.party_name}
                {"\n"}
                Order No: {item.po_no} {"    "} {item.gaddi_name}
                {"\n"}
                Order Date: {item.po_date}
              </Title>

              <StepIndicator
                customStyles={customStyles}
                currentPosition={6}
                labels={labels}
                stepCount={6}
                renderLabel={({ position, stepStatus, label }) => {
                  return (
                    <View>
                      <Text style={{ fontSize: 9, marginTop: 10, textAlign: "center" }}>
                        {position == 0
                          ? "Sales\n\n" +
                            (item.ps_date == "" ? "" : item.ps_date + "\n" + item.ps_time)
                          : ""}
                        {position == 1
                          ? "Kacha Bill\n\n" +
                            (item.kb_date == "" ? "" : item.kb_date + "\n" + item.kb_time)
                          : ""}
                        {position == 2
                          ? "Pakka Bill\n\n" +
                            (item.pb_date == "" ? "" : item.pb_date + "\n" + item.pb_time)
                          : ""}
                        {position == 3 ? "Status\n\n" + item.status : ""}
                        {position == 4
                          ? "Order\n\n" + (isNaN(parseInt(item.order)) ? 0 : parseInt(item.order))
                          : ""}
                        {position == 5
                          ? "Balance\n\n" +
                            (isNaN(parseInt(item.balance)) ? 0 : parseInt(item.balance))
                          : ""}
                      </Text>
                    </View>
                  );
                }}
              />
              <Divider />
            </>
          );
        })}
      </ScrollView>
      <DataTable>
        <DataTable.Pagination
          page={page}
          numberOfPages={itemsPerPage < 10 ? page + 1 : page + 2}
          onPageChange={(page) => {
            setPage(page);
            trackparam.skip = page * 10;
            Refresh();
          }}
        />
      </DataTable>

      <Portal>
        <Dialog visible={modal} dismissable={true}>
          <Dialog.Title>Date Range</Dialog.Title>
          <Dialog.Content>
            <Title>From Date </Title>
            <DatePicker
              style={{ marginTop: 4, marginBottom: 4 }}
              date={param.from_date}
              mode="date"
              showIcon={false}
              placeholder="From Date"
              format="DD/MM/YYYY"
              onDateChange={(date) => {
                setParam({
                  ...param,
                  from_date: date,
                });
              }}
            />
            <Title>To Date </Title>
            <DatePicker
              style={{ marginTop: 4, marginBottom: 4 }}
              date={param.to_date}
              mode="date"
              showIcon={false}
              placeholder="To Date"
              format="DD/MM/YYYY"
              onDateChange={(date) => {
                setParam({
                  ...param,
                  to_date: date,
                });
              }}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              mode="contained"
              color="red"
              onPress={() => {
                setModal(false);
              }}
            >
              Close
            </Button>
            <Button
              mode="contained"
              onPress={() => {
                postData("StockDashboard/DateRangeFilter", param);
                Refresh();
                setModal(false);
              }}
            >
              Done
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

function ProcessScreen({ navigation }) {
  const { userId } = React.useContext(AuthContext);
  const [isloading, setloading] = React.useState(false);
  const [param, setParam] = React.useState({
    user_id: "",
    from_date: "",
    to_date: "",
  });
  const [trackList, setTrackList] = React.useState([]);
  const [trackparam, setTrackParam] = React.useState({
    user_id: "",
    status: "In Process",
    party_name: "",
    gaddi_name: "",
    skip: 0,
  });
  const [page, setPage] = React.useState(0);
  const itemsPerPage = trackList.length > 10 ? 10 : trackList.length;
  const labels = ["Packing Slip", "Kacha Bill", "Pakka Bill", "Status", "Order", "Balance"];
  const [modal, setModal] = React.useState(false);
  React.useEffect(() => {
    navigation.addListener("tabPress", (e) => {
      userId().then((data) => {
        param.user_id = data;
        postData("StockDashboard/PreviewDateFilter", param).then((data) => {
          param.from_date = data.from_date;
          param.to_date = data.to_date;
          setParam({ ...param });
        });
        trackparam.user_id = data;
        Refresh();
      });
    });
  }, [navigation]);

  const Refresh = () => {
    setloading(true);
    postData("StockDashboard/OrderTrackList", trackparam).then((data) => {
      setTrackList(data);
      setloading(false);
    });
  };

  return (
    <View style={{ flex: 1, padding: 5 }}>
      <Spinner
        visible={isloading}
        textContent={"Loading.."}
        textStyle={styles.spinnerTextStyle}
        size={"large"}
        color={"#6200ee"}
        animation={"fade"}
        textStyle={{ color: "#6200ee" }}
      />

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ flex: 1 }}>
          <TextInput
            style={styles.input}
            mode="outlined"
            label={"Party Name"}
            onChangeText={(text) => {
              setTrackParam({
                ...trackparam,
                party_name: text,
              });
            }}
          ></TextInput>
        </View>
        <View style={{ flex: 1 }}>
          <TextInput
            style={styles.input}
            mode="outlined"
            label={"Gaddi Name"}
            onChangeText={(text) => {
              setTrackParam({
                ...trackparam,
                gaddi_name: text,
              });
            }}
          ></TextInput>
        </View>

        <EvilIcons
          name="arrow-right"
          size={40}
          color="#6200ee"
          onPress={() => {
            Refresh();
          }}
        />
        <FontAwesome
          name="filter"
          size={40}
          color="#6200ee"
          onPress={() => {
            setModal(true);
          }}
        />
      </View>
      <ScrollView>
        {trackList.map((item, index) => {
          return (
            <>
              <Title
                style={{ fontFamily: font.bold, fontSize: 13, marginBottom: 10, marginTop: 10 }}
              >
                {item.party_name}
                {"\n"}
                Order No: {item.po_no} {"    "} {item.gaddi_name}
                {"\n"}
                Order Date: {item.po_date}
              </Title>

              <StepIndicator
                customStyles={customStyles}
                currentPosition={6}
                labels={labels}
                stepCount={6}
                renderLabel={({ position, stepStatus, label }) => {
                  return (
                    <View>
                      <Text style={{ fontSize: 9, marginTop: 10, textAlign: "center" }}>
                        {position == 0
                          ? "Sales\n\n" +
                            (item.ps_date == "" ? "" : item.ps_date + "\n" + item.ps_time)
                          : ""}
                        {position == 1
                          ? "Kacha Bill\n\n" +
                            (item.kb_date == "" ? "" : item.kb_date + "\n" + item.kb_time)
                          : ""}
                        {position == 2
                          ? "Pakka Bill\n\n" +
                            (item.pb_date == "" ? "" : item.pb_date + "\n" + item.pb_time)
                          : ""}
                        {position == 3 ? "Status\n\n" + item.status : ""}
                        {position == 4
                          ? "Order\n\n" + (isNaN(parseInt(item.order)) ? 0 : parseInt(item.order))
                          : ""}
                        {position == 5
                          ? "Balance\n\n" +
                            (isNaN(parseInt(item.balance)) ? 0 : parseInt(item.balance))
                          : ""}
                      </Text>
                    </View>
                  );
                }}
              />
              <Divider />
            </>
          );
        })}
      </ScrollView>
      <DataTable>
        <DataTable.Pagination
          page={page}
          numberOfPages={itemsPerPage < 10 ? page + 1 : page + 2}
          onPageChange={(page) => {
            setPage(page);
            trackparam.skip = page * 10;
            Refresh();
          }}
        />
      </DataTable>

      <Portal>
        <Dialog visible={modal} dismissable={true}>
          <Dialog.Title>Date Range</Dialog.Title>
          <Dialog.Content>
            <Title>From Date </Title>
            <DatePicker
              style={{ marginTop: 4, marginBottom: 4 }}
              date={param.from_date}
              mode="date"
              showIcon={false}
              placeholder="From Date"
              format="DD/MM/YYYY"
              onDateChange={(date) => {
                setParam({
                  ...param,
                  from_date: date,
                });
              }}
            />
            <Title>To Date </Title>
            <DatePicker
              style={{ marginTop: 4, marginBottom: 4 }}
              date={param.to_date}
              mode="date"
              showIcon={false}
              placeholder="To Date"
              format="DD/MM/YYYY"
              onDateChange={(date) => {
                setParam({
                  ...param,
                  to_date: date,
                });
              }}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              mode="contained"
              color="red"
              onPress={() => {
                setModal(false);
              }}
            >
              Close
            </Button>
            <Button
              mode="contained"
              onPress={() => {
                postData("StockDashboard/DateRangeFilter", param);
                Refresh();
                setModal(false);
              }}
            >
              Done
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

function HoldScreen({ navigation }) {
  const { userId } = React.useContext(AuthContext);
  const [isloading, setloading] = React.useState(false);
  const [param, setParam] = React.useState({
    user_id: "",
    from_date: "",
    to_date: "",
  });
  const [trackList, setTrackList] = React.useState([]);
  const [trackparam, setTrackParam] = React.useState({
    user_id: "",
    status: "Hold Cancel",
    party_name: "",
    gaddi_name: "",
    skip: 0,
  });
  const [page, setPage] = React.useState(0);
  const itemsPerPage = trackList.length > 10 ? 10 : trackList.length;
  const labels = ["Packing Slip", "Kacha Bill", "Pakka Bill", "Status", "Order", "Balance"];
  const [modal, setModal] = React.useState(false);
  React.useEffect(() => {
    navigation.addListener("tabPress", (e) => {
      userId().then((data) => {
        param.user_id = data;
        postData("StockDashboard/PreviewDateFilter", param).then((data) => {
          param.from_date = data.from_date;
          param.to_date = data.to_date;
          setParam({ ...param });
        });
        trackparam.user_id = data;
        Refresh();
      });
    });
  }, [navigation]);

  const Refresh = () => {
    setloading(true);
    postData("StockDashboard/OrderTrackList", trackparam).then((data) => {
      setTrackList(data);
      setloading(false);
    });
  };
  return (
    <View style={{ flex: 1, padding: 5 }}>
      <Spinner
        visible={isloading}
        textContent={"Loading.."}
        textStyle={styles.spinnerTextStyle}
        size={"large"}
        color={"#6200ee"}
        animation={"fade"}
        textStyle={{ color: "#6200ee" }}
      />

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ flex: 1 }}>
          <TextInput
            style={styles.input}
            mode="outlined"
            label={"Party Name"}
            onChangeText={(text) => {
              setTrackParam({
                ...trackparam,
                party_name: text,
              });
            }}
          ></TextInput>
        </View>
        <View style={{ flex: 1 }}>
          <TextInput
            style={styles.input}
            mode="outlined"
            label={"Gaddi Name"}
            onChangeText={(text) => {
              setTrackParam({
                ...trackparam,
                gaddi_name: text,
              });
            }}
          ></TextInput>
        </View>
        <EvilIcons
          name="arrow-right"
          size={40}
          color="#6200ee"
          onPress={() => {
            Refresh();
          }}
        />
        <FontAwesome
          name="filter"
          size={40}
          color="#6200ee"
          onPress={() => {
            setModal(true);
          }}
        />
      </View>
      <ScrollView>
        {trackList.map((item, index) => {
          return (
            <>
              <Title
                style={{ fontFamily: font.bold, fontSize: 13, marginBottom: 10, marginTop: 10 }}
              >
                {item.party_name}
                {"\n"}
                Order No: {item.po_no} {"    "} {item.gaddi_name}
                {"\n"}
                Order Date: {item.po_date}
              </Title>

              <StepIndicator
                customStyles={customStyles}
                currentPosition={6}
                labels={labels}
                stepCount={6}
                renderLabel={({ position, stepStatus, label }) => {
                  return (
                    <View>
                      <Text style={{ fontSize: 9, marginTop: 10, textAlign: "center" }}>
                        {position == 0
                          ? "Sales\n\n" +
                            (item.ps_date == "" ? "" : item.ps_date + "\n" + item.ps_time)
                          : ""}
                        {position == 1
                          ? "Kacha Bill\n\n" +
                            (item.kb_date == "" ? "" : item.kb_date + "\n" + item.kb_time)
                          : ""}
                        {position == 2
                          ? "Pakka Bill\n\n" +
                            (item.pb_date == "" ? "" : item.pb_date + "\n" + item.pb_time)
                          : ""}
                        {position == 3 ? "Status\n\n" + item.status : ""}
                        {position == 4
                          ? "Order\n\n" + (isNaN(parseInt(item.order)) ? 0 : parseInt(item.order))
                          : ""}
                        {position == 5
                          ? "Balance\n\n" +
                            (isNaN(parseInt(item.balance)) ? 0 : parseInt(item.balance))
                          : ""}
                      </Text>
                    </View>
                  );
                }}
              />
              <Divider />
            </>
          );
        })}
      </ScrollView>
      <DataTable>
        <DataTable.Pagination
          page={page}
          numberOfPages={itemsPerPage < 10 ? page + 1 : page + 2}
          onPageChange={(page) => {
            setPage(page);
            trackparam.skip = page * 10;
            Refresh();
          }}
        />
      </DataTable>
      <Portal>
        <Dialog visible={modal} dismissable={true}>
          <Dialog.Title>Date Range</Dialog.Title>
          <Dialog.Content>
            <Title>From Date </Title>
            <DatePicker
              style={{ marginTop: 4, marginBottom: 4 }}
              date={param.from_date}
              mode="date"
              showIcon={false}
              placeholder="From Date"
              format="DD/MM/YYYY"
              onDateChange={(date) => {
                setParam({
                  ...param,
                  from_date: date,
                });
              }}
            />
            <Title>To Date </Title>
            <DatePicker
              style={{ marginTop: 4, marginBottom: 4 }}
              date={param.to_date}
              mode="date"
              showIcon={false}
              placeholder="To Date"
              format="DD/MM/YYYY"
              onDateChange={(date) => {
                setParam({
                  ...param,
                  to_date: date,
                });
              }}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              mode="contained"
              color="red"
              onPress={() => {
                setModal(false);
              }}
            >
              Close
            </Button>
            <Button
              mode="contained"
              onPress={() => {
                postData("StockDashboard/DateRangeFilter", param);
                Refresh();
                setModal(false);
              }}
            >
              Done
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

function CompleteScreen({ navigation }) {
  const { userId } = React.useContext(AuthContext);
  const [isloading, setloading] = React.useState(false);
  const [param, setParam] = React.useState({
    user_id: "",
    from_date: "",
    to_date: "",
  });
  const [trackList, setTrackList] = React.useState([]);
  const [trackparam, setTrackParam] = React.useState({
    user_id: "",
    status: "Complete",
    party_name: "",
    gaddi_name: "",
    skip: 0,
  });
  const [page, setPage] = React.useState(0);
  const itemsPerPage = trackList.length > 10 ? 10 : trackList.length;
  const labels = ["Packing Slip", "Kacha Bill", "Pakka Bill", "Status", "Order", "Balance"];
  const [modal, setModal] = React.useState(false);
  React.useEffect(() => {
    navigation.addListener("tabPress", (e) => {
      userId().then((data) => {
        param.user_id = data;
        postData("StockDashboard/PreviewDateFilter", param).then((data) => {
          param.from_date = data.from_date;
          param.to_date = data.to_date;
          setParam({ ...param });
        });
        trackparam.user_id = data;
        Refresh();
      });
    });
  }, [navigation]);

  const Refresh = () => {
    setloading(true);
    postData("StockDashboard/OrderTrackList", trackparam).then((data) => {
      setTrackList(data);
      setloading(false);
    });
  };
  return (
    <View style={{ flex: 1, padding: 5 }}>
      <Spinner
        visible={isloading}
        textContent={"Loading.."}
        textStyle={styles.spinnerTextStyle}
        size={"large"}
        color={"#6200ee"}
        animation={"fade"}
        textStyle={{ color: "#6200ee" }}
      />

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ flex: 1 }}>
          <TextInput
            style={styles.input}
            mode="outlined"
            label={"Party Name"}
            onChangeText={(text) => {
              setTrackParam({
                ...trackparam,
                party_name: text,
              });
            }}
          ></TextInput>
        </View>
        <View style={{ flex: 1 }}>
          <TextInput
            style={styles.input}
            mode="outlined"
            label={"Gaddi Name"}
            onChangeText={(text) => {
              setTrackParam({
                ...trackparam,
                gaddi_name: text,
              });
            }}
          ></TextInput>
        </View>
        <EvilIcons
          name="arrow-right"
          size={40}
          color="#6200ee"
          onPress={() => {
            Refresh();
          }}
        />
        <FontAwesome
          name="filter"
          size={40}
          color="#6200ee"
          onPress={() => {
            setModal(true);
          }}
        />
      </View>
      <ScrollView>
        {trackList.map((item, index) => {
          return (
            <>
              <Title
                style={{ fontFamily: font.bold, fontSize: 13, marginBottom: 10, marginTop: 10 }}
              >
                {item.party_name}
                {"\n"}
                Order No: {item.po_no} {"    "} {item.gaddi_name}
                {"\n"}
                Order Date: {item.po_date}
              </Title>

              <StepIndicator
                customStyles={customStyles}
                currentPosition={6}
                labels={labels}
                stepCount={6}
                renderLabel={({ position, stepStatus, label }) => {
                  return (
                    <View>
                      <Text style={{ fontSize: 9, marginTop: 10, textAlign: "center" }}>
                        {position == 0
                          ? "Sales\n\n" +
                            (item.ps_date == "" ? "" : item.ps_date + "\n" + item.ps_time)
                          : ""}
                        {position == 1
                          ? "Kacha Bill\n\n" +
                            (item.kb_date == "" ? "" : item.kb_date + "\n" + item.kb_time)
                          : ""}
                        {position == 2
                          ? "Pakka Bill\n\n" +
                            (item.pb_date == "" ? "" : item.pb_date + "\n" + item.pb_time)
                          : ""}
                        {position == 3 ? "Status\n\n" + item.status : ""}
                        {position == 4
                          ? "Order\n\n" + (isNaN(parseInt(item.order)) ? 0 : parseInt(item.order))
                          : ""}
                        {position == 5
                          ? "Balance\n\n" +
                            (isNaN(parseInt(item.balance)) ? 0 : parseInt(item.balance))
                          : ""}
                      </Text>
                    </View>
                  );
                }}
              />
              <Divider />
            </>
          );
        })}
      </ScrollView>
      <DataTable>
        <DataTable.Pagination
          page={page}
          numberOfPages={itemsPerPage < 10 ? page + 1 : page + 2}
          onPageChange={(page) => {
            setPage(page);
            trackparam.skip = page * 10;
            Refresh();
          }}
        />
      </DataTable>
      <Portal>
        <Dialog visible={modal} dismissable={true}>
          <Dialog.Title>Date Range</Dialog.Title>
          <Dialog.Content>
            <Title>From Date</Title>
            <DatePicker
              style={{ marginTop: 4, marginBottom: 4 }}
              date={param.from_date}
              mode="date"
              showIcon={false}
              placeholder="From Date"
              format="DD/MM/YYYY"
              onDateChange={(date) => {
                setParam({
                  ...param,
                  from_date: date,
                });
              }}
            />
            <Title>To Date</Title>
            <DatePicker
              style={{ marginTop: 4, marginBottom: 4 }}
              date={param.to_date}
              mode="date"
              showIcon={false}
              placeholder="To Date"
              format="DD/MM/YYYY"
              onDateChange={(date) => {
                setParam({
                  ...param,
                  to_date: date,
                });
              }}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              mode="contained"
              color="red"
              onPress={() => {
                setModal(false);
              }}
            >
              Close
            </Button>
            <Button
              mode="contained"
              onPress={() => {
                postData("StockDashboard/DateRangeFilter", param);
                Refresh();
                setModal(false);
              }}
            >
              Done
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const Tab = createMaterialTopTabNavigator();
function OrderTracking({ props, navigation }) {
  return (
    <Tab.Navigator
      initialRouteName="All"
      swipeEnabled={false}
      tabBarOptions={{
        activeTintColor: "#fff",
        labelStyle: { fontSize: 11 },
        style: { backgroundColor: "#6200ee" },
        bounces: true,
        indicatorStyle: { backgroundColor: "#fff" },
      }}
    >
      <Tab.Screen name="All" component={AllScreen} options={{ tabBarLabel: "All" }} />
      <Tab.Screen
        name="In Process"
        component={ProcessScreen}
        options={{ tabBarLabel: "In Process" }}
      />
      <Tab.Screen
        name="Cancel Hold"
        component={HoldScreen}
        options={{ tabBarLabel: "Cancel/Hold" }}
      />
      <Tab.Screen
        name="Complete"
        component={CompleteScreen}
        options={{ tabBarLabel: "Complete" }}
      />
    </Tab.Navigator>
  );
}
const styles = StyleSheet.create({
  scene: {
    height: "100%",
    backgroundColor: "#fbfcfd",
    paddingHorizontal: 20,
  },
});
const customStyles = {
  stepIndicatorSize: 20,
  currentStepIndicatorSize: 20,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: "#6200ee",
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: "#6200ee",
  stepStrokeUnFinishedColor: "#aaaaaa",
  separatorFinishedColor: "#6200ee",
  separatorUnFinishedColor: "#aaaaaa",
  stepIndicatorFinishedColor: "#6200ee",
  stepIndicatorUnFinishedColor: "#ffffff",
  stepIndicatorCurrentColor: "#6200ee",
  stepIndicatorLabelFontSize: 10,
  currentStepIndicatorLabelFontSize: 10,
  stepIndicatorLabelCurrentColor: "#ffffff",
  stepIndicatorLabelFinishedColor: "#ffffff",
  stepIndicatorLabelUnFinishedColor: "#aaaaaa",
  labelColor: "#999999",
  labelSize: 10,
  currentStepLabelColor: "#6200ee",
};

export default OrderTracking;

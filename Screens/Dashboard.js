import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  ActivityIndicator,
  Dimensions,
  TouchableHighlight,
  Image,
} from "react-native";
import { Card, Title, Paragraph, List, Divider, Avatar, Button } from "react-native-paper";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { postData } from "../_Services/Api_Service";
import AsyncStorage from "@react-native-community/async-storage";
import { LineChart } from "react-native-chart-kit";
import { BottomNavigation } from "react-native-paper";
import moment from "moment";
import font from "../fonts.js";
import receive from "../assets/icons/receive.png";
import payamount from "../assets/icons/payamount.png";
import order from "../assets/icons/order.png";
import invoice from "../assets/icons/invoice.png";
import debit from "../assets/icons/debit.png";
import dc from "../assets/icons/dc.png";
import bank from "../assets/icons/bank.png";
import sales from "../assets/icons/sales.png";
import customer from "../assets/icons/customer.png";
import ledger from "../assets/icons/ledger.png";
import pack from "../assets/icons/pack.png";
import { mdiChartScatterPlotHexbin } from "@mdi/js";
import Spinner from "react-native-loading-spinner-overlay";
import { Col, Row, Grid } from "react-native-easy-grid";
import { AuthContext } from "../Components/Context";
import DatePicker from "react-native-datepicker";
import DropDownPicker from "react-native-dropdown-picker";
import { FontAwesome, EvilIcons, FontAwesome5 } from "@expo/vector-icons";
function Dashboard(props) {
  const { userId } = React.useContext(AuthContext);
  const [state, setstate] = React.useState({
    startDate: null,
    endDate: null,
    displayedDate: moment(),
  });
  const [chartData, setChartData] = React.useState({
    chartDataLabels: [0],
    chartDataAmountWise: [0],
    chartDataQtyWise: [0],
    chartDataQtyWise2: [0],
  });
  const [param, setParam] = React.useState({
    user_id: "",
    from_date: "",
    to_date: "",
  });
  const [figures, setFigures] = React.useState({
    user_id: "",
    fabric_stock: "0",
    cutting: "0",
    godown: "0",
    fabrication: "0",
    kaj_button: "0",
    washing: "0",
    dhaga_cutting: "0",
    packaging: "0",
    assortment: "0",
    factory_store: "0",
    shop_return: "0",
    gandhi_nagar: "0",
    total: "0",
    gross_sales: "0",
    total_qty: "0",
    dispatch_order: "0",
    total_order: "0",
  });
  const [tally, setTally] = React.useState({
    user_id: "",
    company_id: "25",
    pakka_bill: "0",
    invoice: "0",
    receivable_amt: "0",
    payable_amt: "0",
    debit_note: "0",
    cash_bank_balance: "0",
    receipt: "0",
    credit_note: "0",
    sales_order: "0",
  });
  const [companyList, setCompany] = React.useState([]);
  const initialLayout = { width: Dimensions.get("window").width };

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "Graphs", icon: "chart-scatter-plot-hexbin" },
    { key: "second", title: "Figures", icon: "format-list-numbered-rtl" },
    { key: "Third", title: "Transactions", icon: "file-document-box-outline" },
    { key: "Fourth", title: "Tally", icon: "ballot-recount-outline" },
  ]);
  const [isloading, setloading] = React.useState(true);

  React.useEffect(() => {
    userId().then((data) => {
      param.user_id = data;
      postData("StockDashboard/PreviewDateFilter", param).then((data) => {
        param.from_date = data.from_date;
        param.to_date = data.to_date;
      });
    });
    Refresh();
    GetCompanyList();
  }, []);

  async function GetCompanyList() {
    postData("StockDropdown/GetCompanyList", param).then((data) => {
      setCompany(data);
    });
  }

  async function Refresh() {
    param.user_id = await AsyncStorage.getItem("userToken");
    tally.user_id = await AsyncStorage.getItem("userToken");
    postData("StockDashboard/Dashboard", param).then((data) => {
      setFigures({
        ...param,
        fabric_stock: data.fabric_stock,
        cutting: data.cutting,
        godown: data.godown,
        fabrication: data.fabrication,
        kaj_button: data.kaj_button,
        washing: data.washing,
        dhaga_cutting: data.dhaga_cutting,
        packaging: data.packaging,
        assortment: data.assortment,
        factory_store: data.factory_store,
        shop_return: data.shop_return,
        gandhi_nagar: data.gandhi_nagar,
        total: data.total,
        gross_sales: data.gross_sales,
        total_qty: data.total_qty,
        dispatch_order: data.dispatch_order,
        total_order: data.total_order,
      });
      setloading(false);
    });
    postData("StockDashboard/DashboardMonthWiseGraph", param).then((data) => {
      chartData.chartDataLabels = [0];
      chartData.chartDataAmountWise = [0];
      chartData.chartDataQtyWise = [0];
      chartData.chartDataQtyWise2 = [0];
      for (const itemObj of data) {
        chartData.chartDataLabels.push(itemObj.date);
        //chartData.chartDataAmountWise.push(itemObj.amount);
        chartData.chartDataQtyWise.push(itemObj.qty);
        //chartData.chartDataQtyWise2.push(itemObj.po_qty);
      }
    });
    DashboardTally();
  }
  async function DashboardTally() {
    postData("StockDashboard/DashboardTally", tally).then((data) => {
      setTally({
        ...tally,
        pakka_bill: data.pakka_bill,
        invoice: data.invoice,
        receivable_amt: data.receivable_amt,
        payable_amt: data.payable_amt,
        debit_note: data.debit_note,
        cash_bank_balance: data.cash_bank_balance,
        receipt: data.receipt,
        credit_note: data.credit_note,
        sales_order: data.sales_order,
      });
    });
  }

  // const data1 = {
  //   labels: chartData.chartDataLabels,
  //   datasets: [
  //     {
  //       data: chartData.chartDataAmountWise,
  //       color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
  //       strokeWidth: 2,
  //     },
  //   ],
  //   legend: ["Amount Wise Sales"],
  // };
  const data2 = {
    labels: chartData.chartDataLabels,
    datasets: [
      {
        data: chartData.chartDataQtyWise,
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        strokeWidth: 2,
      },
      // {
      //   data: chartData.chartDataQtyWise2,
      //   color: (opacity = 1) => `rgba(10, 65, 244, ${opacity})`,
      //   strokeWidth: 2,
      // },
    ],
    //legend: ["Dispatch Qty ", "Po Dispatch Qty"],
    legend: ["Dispatch Qty "],
  };

  const FirstRoute = () => (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.scene}>
          <Grid>
            <Col style={{ padding: 5 }}>
              <List.Item
                title={"Gross Sales"}
                description={parseFloat(figures.gross_sales).toFixed(0)}
                style={{ width: "100%", backgroundColor: "#eee", borderRadius: 10 }}
                titleStyle={{ fontSize: 14, fontFamily: font.medium }}
                descriptionStyle={{ fontSize: 18, fontFamily: font.bold }}
                left={(props) => (
                  <FontAwesome name="rupee" size={30} color="#6200ee" style={{ marginTop: "8%" }} />
                )}
              />
            </Col>
            <Col style={{ padding: 5 }}>
              <List.Item
                title={"Total Qty"}
                description={parseFloat(figures.total_qty).toFixed(0)}
                style={{ width: "100%", backgroundColor: "#eee", borderRadius: 10 }}
                titleStyle={{ fontSize: 14, fontFamily: font.medium }}
                descriptionStyle={{ fontSize: 18, fontFamily: font.bold }}
                left={(props) => (
                  <FontAwesome5
                    name="sort-numeric-up"
                    size={30}
                    color="#6200ee"
                    style={{ marginTop: "8%" }}
                  />
                )}
              />
            </Col>
          </Grid>
          <Grid>
            <Col style={{ padding: 5 }}>
              <List.Item
                title={"Total Order"}
                description={parseFloat(figures.total_order).toFixed(0)}
                style={{ width: "100%", backgroundColor: "#eee", borderRadius: 10 }}
                titleStyle={{ fontSize: 14, fontFamily: font.medium }}
                descriptionStyle={{ fontSize: 18, fontFamily: font.bold }}
                left={(props) => (
                  <FontAwesome name="rupee" size={30} color="#6200ee" style={{ marginTop: "8%" }} />
                )}
              />
            </Col>
            <Col style={{ padding: 5 }}>
              <List.Item
                title={"Dispatch Order"}
                description={parseFloat(figures.dispatch_order).toFixed(0)}
                style={{ width: "100%", backgroundColor: "#eee", borderRadius: 10 }}
                titleStyle={{ fontSize: 14, fontFamily: font.medium }}
                descriptionStyle={{ fontSize: 18, fontFamily: font.bold }}
                left={(props) => (
                  <FontAwesome
                    name="cart-arrow-down"
                    size={30}
                    color="#6200ee"
                    style={{ marginTop: "8%" }}
                  />
                )}
              />
            </Col>
          </Grid>
          {/* <Text style={{ fontFamily: font.bold, fontSize: 20, marginBottom: 10, marginTop: 10 }}>
            Amount Wise Sales
          </Text>
          <LineChart
            data={data1}
            width={Dimensions.get("window").width - 40} // from react-native
            height={250}
            fromZero={true}
            yAxisLabel="₹"
            yLabelsOffset={-2}
            xLabelsOffset={9}
            segments={10}
            chartConfig={{
              backgroundColor: "#e26a00",
              backgroundGradientFrom: "#fb8c00",
              backgroundGradientTo: "#ffa726",
              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#ffa726",
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          /> */}

          <Text
            style={{
              fontFamily: font.bold,
              fontSize: 20,
              marginBottom: 10,
              marginTop: 10,
              textAlign: "center",
            }}
          >
            Quantity Wise Sales
          </Text>
          <LineChart
            data={data2}
            width={Dimensions.get("window").width - 40}
            height={250}
            fromZero={true}
            segments={10}
            yLabelsOffset={5}
            xLabelsOffset={4}
            withVerticalLabels={true}
            withHorizontalLabels={true}
            chartConfig={{
              backgroundColor: "#e26a00",
              backgroundGradientFrom: "#fb8c00",
              backgroundGradientTo: "#ffa726",
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#ffa726",
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  const SecondRoute = () => (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.scene}>
          <List.Item
            title={"Total"}
            description={figures.total}
            style={{
              width: "100%",
              backgroundColor: "#0278ae",
              borderRadius: 10,
              marginBottom: 10,
              borderColor: "#eee",
              borderWidth: 1,
              marginTop: 20,
            }}
            titleStyle={{
              fontSize: 24,
              fontFamily: font.medium,
              textAlign: "center",
              color: "#fff",
            }}
            descriptionStyle={{
              fontSize: 26,
              fontFamily: font.bold,
              textAlign: "center",
              color: "#fff",
            }}
          />
          <List.Item
            onPress={() => props.navigation.navigate("FabricStock")}
            title={"Fabric Stock"}
            description={figures.fabric_stock}
            style={{
              width: "100%",
              backgroundColor: "#eee",
              borderRadius: 10,
              marginBottom: 10,
              borderColor: "#eee",
              borderWidth: 1,
            }}
            titleStyle={{ fontSize: 24, fontFamily: font.medium, textAlign: "center" }}
            descriptionStyle={{ fontSize: 26, fontFamily: font.bold, textAlign: "center" }}
          />

          <Grid>
            <Col style={{ padding: 5 }}>
              <List.Item
                onPress={() => props.navigation.navigate("CuttingMaster")}
                title={"Cutting"}
                description={parseFloat(figures.cutting).toFixed(0)}
                style={{ width: "100%", backgroundColor: "#eee", borderRadius: 10 }}
                titleStyle={{ fontSize: 14, fontFamily: font.medium }}
                descriptionStyle={{ fontSize: 18, fontFamily: font.bold }}
              />
            </Col>
            <Col style={{ padding: 5 }}>
              <List.Item
                title={"Kaj Button"}
                onPress={() => props.navigation.navigate("KajButton")}
                description={parseFloat(figures.godown).toFixed(0)}
                style={{ width: "100%", backgroundColor: "#eee", borderRadius: 10 }}
                titleStyle={{ fontSize: 14, fontFamily: font.medium }}
                descriptionStyle={{ fontSize: 18, fontFamily: font.bold }}
              />
            </Col>
            <Col style={{ padding: 5 }}>
              <List.Item
                onPress={() => props.navigation.navigate("Fabrication")}
                title={"Fabrication"}
                description={parseFloat(figures.fabrication).toFixed(0)}
                style={{ width: "100%", backgroundColor: "#eee", borderRadius: 10 }}
                titleStyle={{ fontSize: 14, fontFamily: font.medium }}
                descriptionStyle={{ fontSize: 18, fontFamily: font.bold }}
              />
            </Col>
          </Grid>
          <Grid>
            <Col style={{ padding: 5 }}>
              <List.Item
                onPress={() => props.navigation.navigate("Washing")}
                title={"Washing"}
                onPress={() => props.navigation.navigate("Washing")}
                description={parseFloat(figures.washing).toFixed(0)}
                style={{ width: "100%", backgroundColor: "#eee", borderRadius: 10 }}
                titleStyle={{ fontSize: 14, fontFamily: font.medium }}
                descriptionStyle={{ fontSize: 18, fontFamily: font.bold }}
              />
            </Col>

            <Col style={{ padding: 5 }}>
              <List.Item
                onPress={() => props.navigation.navigate("DhagaCutting")}
                title={"Dhaga Cutting"}
                description={parseFloat(figures.dhaga_cutting).toFixed(0)}
                style={{ width: "100%", backgroundColor: "#eee", borderRadius: 10 }}
                titleStyle={{ fontSize: 14, fontFamily: font.medium }}
                descriptionStyle={{ fontSize: 18, fontFamily: font.bold }}
              />
            </Col>
          </Grid>
          <Grid>
            <Col style={{ padding: 5 }}>
              <List.Item
                title={"Godown"}
                onPress={() => props.navigation.navigate("Godown")}
                description={parseFloat(figures.godown).toFixed(0)}
                style={{ width: "100%", backgroundColor: "#eee", borderRadius: 10 }}
                titleStyle={{ fontSize: 14, fontFamily: font.medium }}
                descriptionStyle={{ fontSize: 18, fontFamily: font.bold }}
              />
            </Col>
            <Col style={{ padding: 5 }}>
              <List.Item
                onPress={() => props.navigation.navigate("Packaging")}
                title={"Packaging"}
                description={parseFloat(figures.packaging).toFixed(0)}
                style={{ width: "100%", backgroundColor: "#eee", borderRadius: 10 }}
                titleStyle={{ fontSize: 14, fontFamily: font.medium }}
                descriptionStyle={{ fontSize: 18, fontFamily: font.bold }}
              />
            </Col>
          </Grid>
          <Grid>
            <Col style={{ padding: 5 }}>
              <List.Item
                title={"Shop Return"}
                onPress={() => props.navigation.navigate("Shop")}
                description={figures.shop_return}
                style={{ width: "100%", backgroundColor: "#eee", borderRadius: 10 }}
                titleStyle={{ fontSize: 14, fontFamily: font.medium }}
                descriptionStyle={{ fontSize: 18, fontFamily: font.bold }}
              />
            </Col>
            <Col style={{ padding: 5 }}>
              <List.Item
                title={"Gandhi Nagar"}
                onPress={() => props.navigation.navigate("GandhiNagar")}
                description={figures.gandhi_nagar}
                style={{ width: "100%", backgroundColor: "#eee", borderRadius: 10 }}
                titleStyle={{ fontSize: 14, fontFamily: font.medium }}
                descriptionStyle={{ fontSize: 18, fontFamily: font.bold }}
              />
            </Col>
          </Grid>
          <Grid>
            <Col style={{ padding: 5 }}>
              <List.Item
                title={"Aassortment"}
                onPress={() => props.navigation.navigate("Assortment")}
                description={parseFloat(figures.assortment).toFixed(0)}
                style={{ width: "100%", backgroundColor: "#eee", borderRadius: 10 }}
                titleStyle={{ fontSize: 14, fontFamily: font.medium }}
                descriptionStyle={{ fontSize: 18, fontFamily: font.bold }}
              />
            </Col>
            <Col style={{ padding: 5 }}>
              <List.Item
                title={"Factory Store"}
                onPress={() => props.navigation.navigate("FactoryStore")}
                description={parseFloat(figures.factory_store).toFixed(0)}
                style={{ width: "100%", backgroundColor: "#eee", borderRadius: 10 }}
                titleStyle={{ fontSize: 14, fontFamily: font.medium }}
                descriptionStyle={{ fontSize: 18, fontFamily: font.bold }}
              />
            </Col>
          </Grid>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  const ThirdRoute = () => (
    <View style={{ flex: 1, justifyContent: "space-evenly", paddingHorizontal: 5 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
        <Button
          mode="contained"
          style={{ width: "95%" }}
          onPress={(e) => props.navigation.navigate("ShopBillList")}
        >
          Cash Sale
        </Button>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
        <Button
          mode="contained"
          compact={true}
          color="red"
          onPress={(e) => props.navigation.navigate("saleslist")}
        >
          Packing Slip
        </Button>
        <Button
          mode="contained"
          compact={true}
          color="red"
          onPress={(e) => props.navigation.navigate("kachabilllist")}
        >
          Kaccha Bill
        </Button>
        <Button
          mode="contained"
          compact={true}
          color="red"
          onPress={(e) => props.navigation.navigate("pakkabilllist")}
        >
          Pakka Bill
        </Button>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
        <Button
          mode="contained"
          compact={true}
          style={{ width: "95%" }}
          color="red"
          onPress={(e) => props.navigation.navigate("podetaillist")}
        >
          PO Details
        </Button>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
        <Button mode="contained" compact={true} color="red" style={{ width: "45%" }}>
          Receipt
        </Button>
        <Button mode="contained" compact={true} color="red" style={{ width: "45%" }}>
          Invoice Purchased
        </Button>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
        <Button mode="contained" compact={true} color="red">
          Challan Invoice
        </Button>
        <Button
          mode="contained"
          compact={true}
          onPress={(e) => props.navigation.navigate("DayBookList")}
          color="red"
        >
          Day Book
        </Button>
        <Button
          mode="contained"
          compact={true}
          onPress={(e) => props.navigation.navigate("ShopGRList")}
          color="red"
        >
          Shop GR
        </Button>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
        <Button mode="contained" compact={true} color="red">
          Bank
        </Button>
        <Button mode="contained" compact={true} color="red">
          D/C Note
        </Button>
        <Button mode="contained" compact={true} color="red">
          Gaddi Details
        </Button>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
        <Button mode="contained" compact={true} color="red">
          Kapda
        </Button>
        <Button mode="contained" compact={true} color="red">
          Fabric Return
        </Button>
        <Button mode="contained" compact={true} color="red">
          New Order
        </Button>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
        <Button mode="contained" compact={true} color="red">
          Party Debit
        </Button>
        <Button
          mode="contained"
          compact={true}
          color="red"
          onPress={(e) => props.navigation.navigate("ledgerlist")}
        >
          Ledger
        </Button>
        <Button
          mode="contained"
          compact={true}
          color="red"
          onPress={(e) => props.navigation.navigate("mycustomerlist")}
        >
          My Customer
        </Button>
      </View>
    </View>
  );

  const FourthRoute = () => (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.scene}>
          <DropDownPicker
            placeholder="Select Company"
            itemStyle={{
              justifyContent: "flex-start",
            }}
            style={(styles.dropdown, { marginBottom: "3%" })}
            defaultValue={tally.company_id}
            items={companyList}
            onChangeItem={(item) => {
              (tally.company_id = item.value), setTally({ ...tally });
              DashboardTally();
            }}
          />

          <List.Item
            title={"Pakka Bill"}
            description={tally.pakka_bill}
            style={{
              width: "100%",
              backgroundColor: "#eee",
              borderRadius: 10,
              marginBottom: 10,
              borderColor: "#eee",
              borderWidth: 1,
            }}
            titleStyle={{ fontSize: 24, fontFamily: font.medium, textAlign: "center" }}
            descriptionStyle={{ fontSize: 26, fontFamily: font.bold, textAlign: "center" }}
            left={(props) => <Image source={sales} style={styles.listViewImg}></Image>}
          />
          <List.Item
            title={"Purchase Invoice"}
            description={tally.invoice}
            style={{
              width: "100%",
              backgroundColor: "#eee",
              borderRadius: 10,
              marginBottom: 10,
              borderColor: "#eee",
              borderWidth: 1,
            }}
            titleStyle={{ fontSize: 24, fontFamily: font.medium, textAlign: "center" }}
            descriptionStyle={{ fontSize: 26, fontFamily: font.bold, textAlign: "center" }}
            left={(props) => <Image source={invoice} style={styles.listViewImg}></Image>}
          />

          <List.Item
            title={"Receivable Amount"}
            description={tally.receivable_amt}
            style={{
              width: "100%",
              backgroundColor: "#eee",
              borderRadius: 10,
              marginBottom: 10,
              borderColor: "#eee",
              borderWidth: 1,
            }}
            titleStyle={{ fontSize: 24, fontFamily: font.medium, textAlign: "center" }}
            descriptionStyle={{ fontSize: 26, fontFamily: font.bold, textAlign: "center" }}
            left={(props) => <Image source={receive} style={styles.listViewImg}></Image>}
          />

          <List.Item
            title={"Payable Amount"}
            description={tally.payable_amt}
            style={{
              width: "100%",
              backgroundColor: "#eee",
              borderRadius: 10,
              marginBottom: 10,
              borderColor: "#eee",
              borderWidth: 1,
            }}
            titleStyle={{ fontSize: 24, fontFamily: font.medium, textAlign: "center" }}
            descriptionStyle={{ fontSize: 26, fontFamily: font.bold, textAlign: "center" }}
            left={(props) => <Image source={payamount} style={styles.listViewImg}></Image>}
          />

          <List.Item
            title={"Debit Note"}
            description={tally.debit_note}
            style={{
              width: "100%",
              backgroundColor: "#eee",
              borderRadius: 10,
              marginBottom: 10,
              borderColor: "#eee",
              borderWidth: 1,
            }}
            titleStyle={{ fontSize: 24, fontFamily: font.medium, textAlign: "center" }}
            descriptionStyle={{ fontSize: 26, fontFamily: font.bold, textAlign: "center" }}
            left={(props) => <Image source={debit} style={styles.listViewImg}></Image>}
          />

          <List.Item
            title={"Cash/Bank Balance"}
            description={tally.cash_bank_balance}
            style={{
              width: "100%",
              backgroundColor: "#eee",
              borderRadius: 10,
              marginBottom: 10,
              borderColor: "#eee",
              borderWidth: 1,
            }}
            titleStyle={{ fontSize: 24, fontFamily: font.medium, textAlign: "center" }}
            descriptionStyle={{ fontSize: 26, fontFamily: font.bold, textAlign: "center" }}
            left={(props) => <Image source={bank} style={styles.listViewImg}></Image>}
          />

          <List.Item
            title={"Receipt"}
            description={tally.receipt}
            style={{
              width: "100%",
              backgroundColor: "#eee",
              borderRadius: 10,
              marginBottom: 10,
              borderColor: "#eee",
              borderWidth: 1,
            }}
            titleStyle={{ fontSize: 24, fontFamily: font.medium, textAlign: "center" }}
            descriptionStyle={{ fontSize: 26, fontFamily: font.bold, textAlign: "center" }}
            left={(props) => <Image source={dc} style={styles.listViewImg}></Image>}
          />

          <List.Item
            title={"Credit Note"}
            description={tally.credit_note}
            style={{
              width: "100%",
              backgroundColor: "#eee",
              borderRadius: 10,
              marginBottom: 10,
              borderColor: "#eee",
              borderWidth: 1,
            }}
            titleStyle={{ fontSize: 24, fontFamily: font.medium, textAlign: "center" }}
            descriptionStyle={{ fontSize: 26, fontFamily: font.bold, textAlign: "center" }}
            left={(props) => <Image source={debit} style={styles.listViewImg}></Image>}
          />

          <List.Item
            title={"Sales Order"}
            description={tally.sales_order}
            style={{
              width: "100%",
              backgroundColor: "#eee",
              borderRadius: 10,
              marginBottom: 10,
              borderColor: "#eee",
              borderWidth: 1,
            }}
            titleStyle={{ fontSize: 24, fontFamily: font.medium, textAlign: "center" }}
            descriptionStyle={{ fontSize: 26, fontFamily: font.bold, textAlign: "center" }}
            left={(props) => <Image source={pack} style={styles.listViewImg}></Image>}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    Third: ThirdRoute,
    Fourth: FourthRoute,
  });

  return (
    <View style={{ flex: 1, height: "100%" }}>
      <Spinner
        visible={isloading}
        textContent={"Loading.."}
        textStyle={styles.spinnerTextStyle}
        size={"large"}
        color={"#6200ee"}
        animation={"fade"}
        textStyle={{ color: "#6200ee" }}
      />
      <View style={{ overflow: "scroll" }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 5,
          }}
        >
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
          <EvilIcons
            name="arrow-right"
            size={40}
            color="#6200ee"
            onPress={() => {
              postData("StockDashboard/DateRangeFilter", param);
              Refresh();
            }}
          />
        </View>
      </View>

      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
        shifting={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  scene: {
    height: "100%",
    backgroundColor: "#fbfcfd",
    paddingHorizontal: 20,
  },
  cardView: {
    backgroundColor: "#fff",
    borderRadius: 10,
    width: 130,
    height: 100,
    marginLeft: 10,
    marginRight: 10,
    padding: 15,
  },
  cardViewTitle: { fontSize: 14, fontFamily: font.bold, paddingLeft: 0, textAlign: "center" },
  cardViewImg: { width: 40, height: 40, marginLeft: "auto", marginRight: "auto" },
  listViewImg: { width: 50, height: 60, marginLeft: "auto", marginRight: "auto" },
  datecontainer: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
export default Dashboard;

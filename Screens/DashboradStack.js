import React, { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/FontAwesome5";
import Dashboard from "./Dashboard";
import SalesList from "./Transactions/SalesList";
import SalesForm from "./Transactions/SalesForm";
import kachaBillList from "./Transactions/KachaBillList";
import kachaBillForm from "./Transactions/KachaBillForm";
import PakkaBillList from "./Transactions/PakkaBillList";
import PakkaBillForm from "./Transactions/PakkaBillForm";
import PoDetailsList from "./Transactions/PoDetailsList";
import PoDetailsForm from "./Transactions/PoDetailsForm";
import MyCustomerList from "./Transactions/MyCustomerList";
import MyCustomerForm from "./Transactions/MyCustomerForm";
import LedgerList from "./Transactions/LedgerList";
import LedgerForm from "./Transactions/LedgerForm";
import OrderTracking from "./OrderTracking";
import PaymentList from "./PaymentList";
import PaymentForm from "./PaymentForm";
import FabricStock from "./Production/FabricStock";

//Reports
import RptPo from "./Transactions/RptPo";
import RptSales from "./Transactions/RptSales";
import RptPakingSlip from "./Transactions/RptPackingSlip";
import RptDeliveryCahllan from "./Transactions/RptDeliveryChallan";

function DashboardStack(prop) {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          headerLeft: () => (
            <Icon
              name="bars"
              size={25}
              style={{ marginLeft: 15 }}
              onPress={() => prop.navigation.openDrawer()}
            />
          ),
          headerTitle: "Dashboard",
        }}
      />

      {/* ---------------------Transactions--------------------- */}

      <Stack.Screen
        name="saleslist"
        component={SalesList}
        options={{
          headerTitle: "Sales",
        }}
      />
      <Stack.Screen
        name="salesform"
        component={SalesForm}
        options={{
          headerTitle: "Sales",
        }}
      />

      <Stack.Screen
        name="kachabilllist"
        component={kachaBillList}
        options={{
          headerTitle: "Kacha Bill",
        }}
      />
      <Stack.Screen
        name="kachabillform"
        component={kachaBillForm}
        options={{
          headerTitle: "Kacha Bill",
        }}
      />

      <Stack.Screen
        name="pakkabilllist"
        component={PakkaBillList}
        options={{
          headerTitle: "Pakka Bill",
        }}
      />
      <Stack.Screen
        name="pakkabillform"
        component={PakkaBillForm}
        options={{
          headerTitle: "Pakka Bill",
        }}
      />

      <Stack.Screen
        name="podetaillist"
        component={PoDetailsList}
        options={{
          headerTitle: "PO Detail",
        }}
      />
      <Stack.Screen
        name="podetailform"
        component={PoDetailsForm}
        options={{
          headerTitle: "PO Detail",
        }}
      />

      <Stack.Screen
        name="mycustomerlist"
        component={MyCustomerList}
        options={{
          headerTitle: "My Customer",
        }}
      />
      <Stack.Screen
        name="mycustomerfrom"
        component={MyCustomerForm}
        options={{
          headerTitle: "My Customer",
        }}
      />

      <Stack.Screen
        name="ledgerlist"
        component={LedgerList}
        options={{
          headerTitle: "Ledger",
        }}
      />
      <Stack.Screen
        name="ledgerform"
        component={LedgerForm}
        options={{
          headerTitle: "Ledger",
        }}
      />

      <Stack.Screen
        name="ordertracking"
        component={OrderTracking}
        options={{
          headerLeft: () => (
            <Icon
              name="arrow-left"
              size={25}
              style={{ marginLeft: 15 }}
              onPress={() => prop.navigation.goBack("Dashboard")}
            />
          ),
          headerTitle: "Track Order",
        }}
      />
      <Stack.Screen
        name="paymentlist"
        component={PaymentList}
        options={{
          headerLeft: () => (
            <Icon
              name="arrow-left"
              size={25}
              style={{ marginLeft: 15 }}
              onPress={() => prop.navigation.goBack("Dashboard")}
            />
          ),
          headerTitle: "Payment List",
        }}
      />
      <Stack.Screen
        name="paymentform"
        component={PaymentForm}
        options={{
          headerTitle: "Payment",
        }}
      />

      {/*<-------------------------- Prints ---------------------------------->*/}

      <Stack.Screen
        name="rptpo"
        component={RptPo}
        options={{
          headerTitle: "Print",
        }}
      />
      <Stack.Screen
        name="rptsales"
        component={RptSales}
        options={{
          headerTitle: "Print",
        }}
      />
      <Stack.Screen
        name="rptpackingslip"
        component={RptPakingSlip}
        options={{
          headerTitle: "Print",
        }}
      />
      <Stack.Screen
        name="rptdc"
        component={RptDeliveryCahllan}
        options={{
          headerTitle: "Print",
        }}
      />

      {/* -------------------------------------------------------------- */}
      <Stack.Screen
        name="test"
        component={FabricStock}
        options={{
          headerTitle: "Test",
        }}
      />
    </Stack.Navigator>
  );
}

export default DashboardStack;
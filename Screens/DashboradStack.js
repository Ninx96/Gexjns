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
import Fabrication from "./Production/Fabrication";
import DailyWashing from "./Production/DailyWashing";
import KajButton from "./Production/KajButton";
import Washing from "./Production/Washing";
import DhagaCutting from "./Production/DhagaCutting";
import Packaging from "./Production/Packaging";
import ChallanInvoice from "./Production/ChallanInvoice";
import IssueFactoryStore from "./Production/IssueFactoryStrore";
import CuttingMaster from "./Production/CuttingMaster";
import Godown from "./Production/Godown";
import Assortment from "./Production/Assortment";
import FactoryStore from "./Production/FactoryStore";
import GandhiNagar from "./Production/GandhiNagar";
import Shop from "./Production/Shop";
import ProductionHeader from "./Production/ProductionHeader";
import IssueGodown from "./Production/IssueGodown";
import ShopBillForm from "./Transactions/ShopBillForm";

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
        component={ShopBillForm}
        options={{
          headerTitle: "Test",
        }}
      />

      <Stack.Screen
        name="FabricStock"
        component={FabricStock}
        options={{
          headerTitle: "FabricStock",
        }}
      />
      <Stack.Screen
        name="CuttingMaster"
        component={CuttingMaster}
        options={{
          headerTitle: "CuttingMaster",
        }}
      />
      <Stack.Screen
        name="Godown"
        component={Godown}
        options={{
          headerTitle: "Godown",
        }}
      />
      <Stack.Screen
        name="Fabrication"
        component={Fabrication}
        options={{
          headerTitle: "Fabrication",
        }}
      />
      <Stack.Screen
        name="KajButton"
        component={KajButton}
        options={{
          headerTitle: "KajButton",
        }}
      />
      <Stack.Screen
        name="Washing"
        component={Washing}
        options={{
          headerTitle: "Washing",
        }}
      />
      <Stack.Screen
        name="DhagaCutting"
        component={DhagaCutting}
        options={{
          headerTitle: "DhagaCutting",
        }}
      />
      <Stack.Screen
        name="Packaging"
        component={Packaging}
        options={{
          headerTitle: "Packaging",
        }}
      />
      <Stack.Screen
        name="Assortment"
        component={Assortment}
        options={{
          headerTitle: "Assortment",
        }}
      />
      <Stack.Screen
        name="FactoryStore"
        component={FactoryStore}
        options={{
          headerTitle: "FactoryStore",
        }}
      />
      <Stack.Screen
        name="GandhiNagar"
        component={GandhiNagar}
        options={{
          headerTitle: "GandhiNagar",
        }}
      />
      <Stack.Screen
        name="Shop"
        component={Shop}
        options={{
          headerTitle: "Shop",
        }}
      />
      <Stack.Screen
        name="DailyWashing"
        component={DailyWashing}
        options={{
          headerTitle: "Daily Washing",
        }}
      />
      <Stack.Screen
        name="ChallanInvoice"
        component={ChallanInvoice}
        options={{
          headerTitle: "Challan Invoice",
        }}
      />
      <Stack.Screen
        name="IssueFactoryStore"
        component={IssueFactoryStore}
        options={{
          headerTitle: "Issue Factory Store",
        }}
      />
      <Stack.Screen
        name="IssueGodown"
        component={IssueGodown}
        options={{
          headerTitle: "Issue Godown",
        }}
      />
    </Stack.Navigator>
  );
}

export default DashboardStack;

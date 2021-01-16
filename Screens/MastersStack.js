import React, { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/FontAwesome5";

import Masters from "./Masters/MastersMenu";
import BrokerList from "./Masters/BrokerList";
import BrokerForm from "./Masters/BrokerForm";
import CompanyList from "./Masters/CompanyList";
import CompanyForm from "./Masters/CompanyForm";
import ContactList from "./Masters/ContactList";
import ContactForm from "./Masters/ContactForm";
import DiscountFareList from "./Masters/DiscountFareList";
import DiscountFareForm from "./Masters/DiscountFareForm";
import PartyForm from "./Masters/PartyForm";
import PartyList from "./Masters/PartyList";
import UserList from "./Masters/UserList";
import UserForm from "./Masters/UserForm";
import ProductList from "./Masters/ProductList";
import ProductForm from "./Masters/ProductForm";
import FabricList from "./Masters/FabricList";
import FabricForm from "./Masters/FabricForm";
import FactoryStroreLocationList from "./Masters/FactoryStroreLocationList";
import FactoryStoreLocationForm from "./Masters/FactoryStoreLocationForm";
import GandhiNgrLocationList from "./Masters/GandhiNgrLocationList";
import GandhiNgrLocationForm from "./Masters/GandhiNgrLocationForm";
import SizeMaster from "./Masters/SizeMaster";
import ColorMaster from "./Masters/ColorMaster";
import ItemDetailsMaster from "./Masters/ItemDetailsMaster";

export default function MastersStack(prop) {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="master"
        component={Masters}
        options={{
          headerLeft: () => (
            <Icon
              name="bars"
              size={25}
              style={{ marginLeft: 15 }}
              onPress={() => prop.navigation.openDrawer()}
            />
          ),
          headerTitle: "Masters",
        }}
      />
      <Stack.Screen
        name="userlist"
        component={UserList}
        options={{
          headerTitle: "User Master",
        }}
      />
      <Stack.Screen
        name="userform"
        component={UserForm}
        options={{
          headerTitle: "User Master",
        }}
      />

      <Stack.Screen
        name="brokerlist"
        component={BrokerList}
        options={{
          headerTitle: "Broker Master",
        }}
      />
      <Stack.Screen
        name="brokerform"
        component={BrokerForm}
        options={{
          headerTitle: "Broker Master",
        }}
      />

      <Stack.Screen
        name="companylist"
        component={CompanyList}
        options={{
          headerTitle: "Company Master",
        }}
      />
      <Stack.Screen
        name="companyform"
        component={CompanyForm}
        options={{
          headerTitle: "Company Master",
        }}
      />

      <Stack.Screen
        name="contactlist"
        component={ContactList}
        options={{
          headerTitle: "Contact Master",
        }}
      />
      <Stack.Screen
        name="contactform"
        component={ContactForm}
        options={{
          headerTitle: "Contact Master",
        }}
      />

      <Stack.Screen
        name="discountfarelist"
        component={DiscountFareList}
        options={{
          headerTitle: "Discount Fare",
        }}
      />
      <Stack.Screen
        name="discountfareform"
        component={DiscountFareForm}
        options={{
          headerTitle: "Discount Fare Master",
        }}
      />
      <Stack.Screen
        name="partylist"
        component={PartyList}
        options={{
          headerTitle: "Party Master",
        }}
      />

      <Stack.Screen
        name="partyform"
        component={PartyForm}
        options={{
          headerTitle: "Party Master",
        }}
      />

      <Stack.Screen
        name="productlist"
        component={ProductList}
        options={{
          headerTitle: "Product Master",
        }}
      />

      <Stack.Screen
        name="productform"
        component={ProductForm}
        options={{
          headerTitle: "Product Master",
        }}
      />

      <Stack.Screen
        name="fabriclist"
        component={FabricList}
        options={{
          headerTitle: "Fabric Master",
        }}
      />

      <Stack.Screen
        name="fabricform"
        component={FabricForm}
        options={{
          headerTitle: "Fabric Master",
        }}
      />

      <Stack.Screen
        name="factorystorelist"
        component={FactoryStroreLocationList}
        options={{
          headerTitle: "Factory Store Location",
        }}
      />

      <Stack.Screen
        name="factorystoreform"
        component={FactoryStoreLocationForm}
        options={{
          headerTitle: "Factory Store Location",
        }}
      />

      <Stack.Screen
        name="gandhingrlist"
        component={GandhiNgrLocationList}
        options={{
          headerTitle: "Gandhi Ngr Location",
        }}
      />

      <Stack.Screen
        name="gandhingrform"
        component={GandhiNgrLocationForm}
        options={{
          headerTitle: "Gandhi Ngr Location",
        }}
      />

      <Stack.Screen
        name="sizemaster"
        component={SizeMaster}
        options={{
          headerTitle: "Size Master",
        }}
      />

      <Stack.Screen
        name="colormaster"
        component={ColorMaster}
        options={{
          headerTitle: "Color Master",
        }}
      />

      <Stack.Screen
        name="itemdetailsmaster"
        component={ItemDetailsMaster}
        options={{
          headerTitle: "Item Details Master",
        }}
      />
    </Stack.Navigator>
  );
}

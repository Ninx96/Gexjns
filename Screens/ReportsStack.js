import React, { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/FontAwesome5";
import Reports from "./Reports/ReportsMenu";
import Tally from "./Reports/Tally";
import DC from "./Reports/DC";
import GR from "./Reports/GR";
import Gaddi from "./Reports/Gaddi";
import Sales from "./Reports/Sales";

export default function ReportsStack(prop) {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="reports"
        component={Reports}
        options={{
          headerLeft: () => (
            <Icon
              name="bars"
              size={25}
              style={{ marginLeft: 15 }}
              onPress={() => prop.navigation.openDrawer()}
            />
          ),
          headerTitle: "Reports",
        }}
      />
      <Stack.Screen
        name="tally"
        component={Tally}
        options={{
          headerTitle: "Tally Report",
        }}
      />
      <Stack.Screen
        name="dc"
        component={DC}
        options={{
          headerTitle: "DC Report",
        }}
      />
      <Stack.Screen
        name="gaddi"
        component={Gaddi}
        options={{
          headerTitle: "Gaddi Report",
        }}
      />
      <Stack.Screen
        name="gr"
        component={GR}
        options={{
          headerTitle: "GR Report",
        }}
      />
      <Stack.Screen
        name="sales"
        component={Sales}
        options={{
          headerTitle: "Sales Report",
        }}
      />
    </Stack.Navigator>
  );
}

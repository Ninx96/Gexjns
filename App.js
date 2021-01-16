import "react-native-gesture-handler";
import React, { useEffect } from "react";
import { SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar } from "react-native";
import {
  NavigationContainer,
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme,
} from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  Provider as PaperProvider,
  DefaultTheme as PaperDefaultTheme,
  DarkTheme as PaperDarkTheme,
  ActivityIndicator,
  configureFonts,
} from "react-native-paper";
import AsyncStorage from "@react-native-community/async-storage";

import { AuthContext } from "./Components/Context";

import DrawerContent from "./Screens/DrawerContent";
import LoginStack from "./Screens/LoginStack";
import DashboardStack from "./Screens/DashboradStack";
import ReportsStack from "./Screens/ReportsStack";
import MastersStack from "./Screens/MastersStack";

import AppLoading from "expo-app-loading";
import * as Font from "expo-font";

//const App: () => React$Node = () => {
const App = () => {
  const [isDarkTheme, setIsDarkTheme] = React.useState(false);
  const [fontsLoaded, setFontLoaded] = React.useState(false);

  const initialLoginState = {
    isLoading: true,
    userName: null,
    userToken: null,
  };

  const getFonts = () =>
    Font.loadAsync({
      "nunito-regular": require("./assets/fonts/Nunito-Regular.ttf"),
      "nunito-medium": require("./assets/fonts/Nunito-SemiBold.ttf"),
      "nunito-bold": require("./assets/fonts/Nunito-Bold.ttf"),
    });

  const fontConfig = {
    default: {
      regular: {
        fontFamily: "nunito-regular",
      },
      medium: {
        fontFamily: "nunito-medium",
      },
      bold: {
        fontFamily: "nunito-bold",
      },
    },
  };

  const CustomDefaultTheme = {
    ...NavigationDefaultTheme,
    ...PaperDefaultTheme,
    colors: {
      ...NavigationDefaultTheme.colors,
      ...PaperDefaultTheme.colors,
      background: "#ffffff",
      text: "#333333",
    },
    fonts: configureFonts(fontConfig),
  };

  const CustomDarkTheme = {
    ...NavigationDarkTheme,
    ...PaperDarkTheme,
    colors: {
      ...NavigationDarkTheme.colors,
      ...PaperDarkTheme.colors,
      background: "#333333",
      text: "#ffffff",
    },
    fonts: configureFonts(fontConfig),
  };

  const theme = isDarkTheme ? CustomDarkTheme : CustomDefaultTheme;

  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case "RETRIEVE_TOKEN":
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case "LOGIN":
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          isLoading: false,
        };
      case "LOGOUT":
        return {
          ...prevState,
          userName: null,
          userToken: null,
          isLoading: false,
        };
    }
  };

  const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);

  const authContext = React.useMemo(
    () => ({
      signIn: async (data) => {
        const userToken = data.user_id;
        const userName = data.user_name;
        const mobile = data.mobile;
        const email = data.email;

        try {
          await AsyncStorage.setItem("userToken", userToken);
          await AsyncStorage.setItem("userName", userName);
          await AsyncStorage.setItem("mobile", mobile);
          await AsyncStorage.setItem("email", email);
        } catch (e) {
          console.log(e);
        }
        dispatch({ type: "LOGIN", id: userName, token: userToken });
      },
      signOut: async () => {
        try {
          await AsyncStorage.removeItem("userToken");
        } catch (e) {
          console.log(e);
        }
        dispatch({ type: "LOGOUT" });
      },
      toggleTheme: () => {
        setIsDarkTheme((isDarkTheme) => !isDarkTheme);
      },
      userId: async () => {
        try {
          const user_id = await AsyncStorage.getItem("userToken");
          return user_id;
        } catch (e) {
          console.log(e);
        }
      },
      userName: async () => {
        try {
          const userName = await AsyncStorage.getItem("userName");
          return userName;
        } catch (e) {
          console.log(e);
        }
      },
    }),
    []
  );

  useEffect(() => {
    setTimeout(async () => {
      let userToken;
      userToken = null;
      try {
        userToken = await AsyncStorage.getItem("userToken");
      } catch (e) {
        console.log(e);
      }
      dispatch({ type: "RETRIEVE_TOKEN", token: userToken });
    }, 1000);
  }, []);

  const Drawer = createDrawerNavigator();

  if (fontsLoaded) {
    return (
      <PaperProvider theme={theme}>
        <AuthContext.Provider value={authContext}>
          <StatusBar hidden={false} barStyle={"default"} />
          <NavigationContainer theme={theme}>
            {loginState.userToken !== null ? (
              <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />}>
                <Drawer.Screen children={DashboardStack} name="Home" />
                <Drawer.Screen children={ReportsStack} name="Reports" />
                <Drawer.Screen children={MastersStack} name="Masters" />
              </Drawer.Navigator>
            ) : (
              <LoginStack />
            )}
          </NavigationContainer>
        </AuthContext.Provider>
      </PaperProvider>
    );
  } else {
    return (
      <AppLoading
        startAsync={getFonts}
        onError={console.warn}
        onFinish={() => setFontLoaded(true)}
      />
    );
  }
};

export default App;

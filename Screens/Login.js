import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, ScrollView, View, StatusBar, Alert, ImageBackground, KeyboardAvoidingView, Image } from 'react-native';
import { TextInput, Text, Button, Headline, ActivityIndicator, } from 'react-native-paper';
import { checkMobile, postData } from '../_Services/Api_Service';
import image from '../assets/login_back.jpg'
import logo from '../assets/favicon.png'
import font from '../fonts.js'
import { AuthContext } from '../Components/Context';

function Login({ navigation }) {
  const [param, setParam] = React.useState({
    user_name: "",
    password: "",
    otp: ""
  });

  const [showOtp, setOtp] = React.useState(false)
  const [loading, setLoading] = React.useState(false);
  const { signIn } = React.useContext(AuthContext);

  return (
    <ImageBackground source={image} style={styles.image}>
      <View style={{ flex: 1 }}>
        <View
          style={{
            marginTop: 'auto',
            backgroundColor: '#fff',
            marginBottom: '10%',
            borderRadius: 10,
            padding: 20,
            width: '90%',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
          <Image source={logo} style={{ width: 50, height: 50, marginLeft: 'auto', marginRight: 'auto', marginBottom: 10 }}>
          </Image>
          <Text style={{ fontFamily: font.bold, fontSize: 28, textAlign: 'center' }}>Gex Jeans</Text>
          <Text style={{ fontFamily: font.regular, textAlign: 'center', marginBottom: 10 }}>Login to your account</Text>
          <KeyboardAvoidingView>


            {!showOtp ? <>
              <TextInput
                label="Mobile"
                mode="outlined"
                placeholder={'Mobile'}
                keyboardType="numeric"
                onChangeText={(text) => {
                  setParam({
                    ...param,
                    user_name: text,
                  });
                }}

                style={{
                  marginBottom: 10,

                }}
              ></TextInput>
              <TextInput
                label="Password"
                mode="outlined"
                placeholder={'Password'}
                secureTextEntry={true}
                onChangeText={(text) => {
                  setParam({
                    ...param,
                    password: text,
                  });
                }}
                style={{
                  marginBottom: 10
                }}></TextInput>
            </>
              :
              <TextInput
                label="OTP"
                mode="outlined"
                placeholder={'OTP'}
                keyboardType={'numeric'}

                value={param.otp}
                onChangeText={(text) => {
                  setParam({
                    ...param,
                    otp: text,
                  });
                }} style={{
                  marginBottom: 10
                }}></TextInput>}


          </KeyboardAvoidingView>
          <Button
            mode="contained"
            loading={loading}
            onPress={() => {
              setLoading(true);
              if (!showOtp) {
                checkMobile(param)
                  .then((data) => {
                    if (data.valid) {
                      setOtp(true);
                    }
                    else {
                      Alert.alert(data.msg);
                    }
                  })
                  .then(() => {
                    setLoading(false);
                  });
              }
              else {
                postData("StockLogin/CheckOtp", param)
                  .then((data) => {
                    if (data.valid) {
                      var param = {
                        user_id: data.user_id,
                        user_name: data.full_name,
                        mobile: data.mobile,
                        email: data.email,
                      };
                      signIn(param);
                    }
                    else {
                      Alert.alert("Invalid UserName or Password");
                    }

                  })
                  .then(() => {
                    setLoading(false);
                  });
              }

            }}>
            {showOtp ? "Login" : "Send OTP"}
          </Button>
        </View>


      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column"
  },
  image: {
    flex: 1,
    // resizeMode: "cover",
    justifyContent: "center"
  },
});

export default Login;

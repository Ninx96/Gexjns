import React from 'react';
import { SafeAreaView, StyleSheet, ScrollView, View, StatusBar, } from 'react-native';
import { TextInput, Text, Button, Headline, ActivityIndicator, } from 'react-native-paper';
import { postData } from '../_Services/Api_Service';
import { AuthContext } from '../Components/Context';

function LoginOtp({ route, navigation }) {
  const { Mobile } = route.params;
  const { Password } = route.params;
  // const [otp, setotp] = React.useState('');
  const { signIn } = React.useContext(AuthContext);
  const [loading, setLoading] = React.useState(false);
  const [param, setParam] = React.useState({
    user_name: Mobile,
    password: Password,
    otp: ""
  });
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'lightblue',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'lightblue' }}>
      <Headline style={{ alignSelf: 'center' }}>Login-OTP</Headline>
      <View
        style={{
          margin: 5,
          paddingTop: 50,
          paddingBottom: 50,
        }}>
        <TextInput
          label="OTP"
          mode="outlined"
          placeholder={'OTP'}
          keyboardType={'numeric'}
          onChangeText={(text) => {
            setParam({
              ...param,
              otp: text,
            });
          }}></TextInput>
      </View>
      <Button
        mode="contained"
        onPress={() => {
          setLoading(true);
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
                alert(data.msg);
              }

            })
            .then(() => {
              setLoading(false);
            });
        }}>
        SUBMIT
      </Button>
    </View>
  );
}

export default LoginOtp;

import React from "react";
import {
  Text,
  TextInput,
  FAB,
  TouchableRipple,
  Divider,
  Headline,
  ActivityIndicator,
} from "react-native-paper";
import {
  View,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Alert,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { postData } from "../../_Services/Api_Service";
import { AuthContext } from "../../Components/Context";
import DropDownPicker from "react-native-dropdown-picker";
import Spinner from "react-native-loading-spinner-overlay";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";

export default function ProductForm({ route, navigation }) {
  const { tran_id } = route.params == undefined ? 0 : route.params;
  const { userId } = React.useContext(AuthContext);
  const [isloading, setloading] = React.useState(true);
  const [Image, setImage] = React.useState(require("../../assets/default.png"));
  const [param, setParam] = React.useState({
    product_id: tran_id == undefined ? 0 : tran_id,
    category: "",
    barcode: "",
    product_name: "",
    description: "",
    price: "",
    cross_gol: "",
    back_pocket: "",
    fittings: "",
    size: [],
    user_id: "",
    product_image: "",
  });

  const SizeList = [
    { label: "28*28", value: "28*28" },
    { label: "28*30", value: "28*30" },
    { label: "28*32", value: "28*32" },
    { label: "28*34", value: "28*34" },
    { label: "28*36", value: "28*36" },
    { label: "30*30", value: "30*30" },
    { label: "30*32", value: "30*32" },
    { label: "30*34", value: "30*34" },
    { label: "30*36", value: "30*36" },
    { label: "32*40", value: "32*40" },
    { label: "34*34", value: "34*34" },
  ];

  const CategoryList = [
    { label: "Kids", value: "Kids" },
    { label: "Jacket", value: "Jacket" },
    { label: "Mens", value: "Mens" },
  ];

  let dimensions = Dimensions.get("window");
  let imageWidth = Math.round((dimensions.width * 12) / 16);

  React.useEffect(() => {
    userId().then((data) => {
      param.user_id = data;
    });
    Preview();
  }, []);

  const Preview = () => {
    postData("Masters/PreviewProduct", param).then((data) => {
      //console.log(data);
      setParam(data);
      setloading(false);
    });
    //console.log(param);
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
      <SafeAreaView>
        <ScrollView>
          <View style={{ padding: 50 }}>
            <Headline style={{ alignSelf: "center", marginBottom: 6 }}>
              Fabric Details
            </Headline>

            <Text style={{ marginTop: 8 }}>Category</Text>
            <DropDownPicker
              itemStyle={{
                justifyContent: "flex-start",
              }}
              style={styles.dropdown}
              items={CategoryList}
              onChangeItem={(item) => {
                setParam({
                  ...param,
                  category: item.value,
                });
              }}
            />

            <TextInput
              style={styles.input}
              mode="outlined"
              label={"Barcode"}
              value={param.barcode}
              onChangeText={(text) => {
                setParam({
                  ...param,
                  barcode: text,
                });
              }}
            ></TextInput>

            <TextInput
              style={styles.input}
              mode="outlined"
              label={"Product Name"}
              value={param.product_name}
              onChangeText={(text) => {
                setParam({
                  ...param,
                  product_name: text,
                });
              }}
            ></TextInput>

            <Text style={{ marginTop: 8 }}>Size</Text>
            <DropDownPicker
              itemStyle={{
                justifyContent: "flex-start",
              }}
              style={styles.dropdown}
              items={SizeList}
              onChangeItem={(item) => {
                setParam({
                  ...param,
                  size: [{ size: item.value }],
                });
              }}
            />

            <TextInput
              style={styles.input}
              mode="outlined"
              label={"Price"}
              value={param.price}
              onChangeText={(text) => {
                setParam({
                  ...param,
                  price: text,
                });
              }}
            ></TextInput>

            <TextInput
              style={styles.input}
              mode="outlined"
              label={"Cross/GOL"}
              value={param.cross_gol}
              onChangeText={(text) => {
                setParam({
                  ...param,
                  cross_gol: text,
                });
              }}
            ></TextInput>

            <TextInput
              style={styles.input}
              mode="outlined"
              label={"Description"}
              value={param.description}
              onChangeText={(text) => {
                setParam({
                  ...param,
                  description: text,
                });
              }}
            ></TextInput>
          </View>

          {param.product_id != 0 && (
            <View style={{ padding: 30 }}>
              <Text style={{ margin: 8 }}>Product Image</Text>
              <View style={styles.container}>
                <Image
                  source={Image}
                  style={{ height: imageHeight, width: imageWidth }}
                />
                <View>
                  <Button
                    mode="text"
                    onPress={async () => {
                      try {
                        const Camera = await Permissions.getAsync(
                          Permissions.CAMERA
                        );
                        const camera_roll = await Permissions.getAsync(
                          Permissions.CAMERA_ROLL
                        );

                        let result = { cancelled: true };

                        if (!Camera.granted) {
                          Permissions.askAsync(Permissions.CAMERA);
                        } else if (!camera_roll.granted) {
                          Permissions.askAsync(Permissions.CAMERA_ROLL);
                        } else {
                          const options = {
                            mediaTypes: ImagePicker.MediaTypeOptions.Images,
                            quality: 0.2,
                            base64: true,
                          };
                          var filename = "test.jpg";

                          Alert.alert(
                            "Select Upload Option",
                            "Choose an Option To Continue",
                            [
                              {
                                text: "Camera",
                                onPress: async () => {
                                  let result = await ImagePicker.launchCameraAsync(
                                    options
                                  ).then((result) => {
                                    if (!result.cancelled) {
                                      setImage({
                                        uri: result.uri,
                                        image_data: result.base64,
                                        image_name: filename,
                                      });
                                    }
                                  });
                                },
                              },
                              {
                                text: "Gallery",
                                onPress: async () => {
                                  await ImagePicker.launchImageLibraryAsync(
                                    options
                                  ).then((result) => {
                                    if (!result.cancelled) {
                                      setImage({
                                        uri: result.uri,
                                        product_id: param.product_id,
                                        image_data: result.base64,
                                        image_name: filename,
                                      });
                                    }
                                  });
                                },
                              },
                            ]
                          );
                        }
                      } catch (err) {
                        console.warn(err);
                      }
                    }}
                  >
                    Choose Image
                  </Button>
                  <Button
                    mode="text"
                    onPress={() => {
                      getData(
                        "DashboardComplaint/PostProductImage",
                        Image
                      ).then((data) => {
                        console.log("Image1:" + data.type);
                        if (data.valid) {
                          setParam({
                            ...param,
                            product_image: Image.image_name,
                          });
                        } else {
                          Alert.alert("Error", data.msg);
                        }
                      });
                    }}
                    color={param.customer_pic == "" ? "" : "green"}
                  >
                    Upload
                  </Button>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
      <FAB
        style={styles.fabRight}
        icon="check"
        onPress={() => {
          postData("Masters/InsertFabric", param).then((data) => {
            if (data.valid) {
              Alert.alert("Form Save Succeessfully!!");
              navigation.goBack();
            } else {
              Alert.alert("Error", data.msg);
            }
          });
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

import React from "react";
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  Modal,
  Alert,
  FlatList,
} from "react-native";
import { FontAwesome, EvilIcons } from "@expo/vector-icons";
import { FAB, Searchbar, TouchableRipple } from "react-native-paper";
import { Table, Row } from "react-native-table-component";
import { postData } from "../../_Services/Api_Service";
import { AuthContext } from "../../Components/Context";
import font from "../../fonts.js";
import DatePicker from "react-native-datepicker";
import Spinner from "react-native-loading-spinner-overlay";
import ImageViewer from "react-native-image-zoom-viewer";

const ShopGRList = () => {
  const { userId } = React.useContext(AuthContext);
  const [visible, setVisible] = React.useState(false);
  const [gridData, setGrid] = React.useState([]);
  const [isloading, setloading] = React.useState(true);
  const [imgmodal, setImgModal] = React.useState(false);
  const [images, setImages] = React.useState([
    { url: "../../assets/upload.png" },
  ]);

  const [param, setParam] = React.useState({
    user_id: "",
    search: "",
    from_date: "",
    to_date: "",
  });
  const widthArr = [50, 100, 120, 100, 100, 100, 150, 150, 100, 150, 70, 150];

  const Refresh = () => {
    setloading(true);
    postData("Transaction/BrowseDayBookDetails", param).then((data) => {
      if (data.length === 0) {
        setLoadBtn(false);
      }
      //console.log(data);
      setGrid(data);
      setloading(false);
    });
  };

  React.useEffect(() => {
    userId().then((data) => {
      param.user_id = data;
      postData("StockDashboard/PreviewDateFilter", param).then((data) => {
        //console.log(data);
        param.from_date = data.from_date;
        param.to_date = data.to_date;
      });
    });
    navigation.addListener("focus", () => {
      setTimeout(() => {
        Refresh();
      }, 1000);
    });
  }, []);

  const Delete = (tran_id) => {
    let _param = {
      user_id: param.user_id,
      tran_id: tran_id,
    };
    setloading(true);
    postData("Transaction/DeleteDayBook", _param).then((data) => {
      Refresh();
      setloading(false);
    });
  };

  const Action = (tran_id) => {
    return (
      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        <FontAwesome
          name="edit"
          size={30}
          onPress={() => {
            navigation.navigate("DayBookForm", { tran_id: tran_id });
          }}
          color="green"
        />
        <FontAwesome
          name="trash"
          size={30}
          color="red"
          onPress={() => {
            Alert.alert(
              "Alert",
              "Are you sure ?",
              [
                {
                  text: "No",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel",
                },
                {
                  text: "Yes",
                  onPress: () => {
                    Delete(tran_id);
                  },
                },
              ],
              { cancelable: false }
            );
          }}
        />

        {/* <FontAwesome
            name="file"
            size={30}
            color="black"
            onPress={() => {
              navigation.navigate("rptdc", { tran_id: tran_id, party: party, dc_no: dc_no });
            }}
          /> */}
      </View>
    );
  };

  const img = (folder, file_path) => {
    return (
      <TouchableRipple
        onPress={async () => {
          setImages([
            {
              url: `https://musicstore.quickgst.in/Attachment_Img/${folder}/${file_path}`,
            },
          ]);
          setImgModal(true);
        }}
      >
        <Image
          source={{
            uri: `https://musicstore.quickgst.in/Attachment_Img/${folder}/${file_path}`,
          }}
          style={{ width: 120, height: 60 }}
        />
      </TouchableRipple>
    );
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
      <Modal
        visible={imgmodal}
        transparent={true}
        onRequestClose={() => {
          setImgModal(false);
        }}
      >
        <FontAwesome
          name="close"
          size={30}
          color="black"
          style={{ color: "white", position: "absolute", zIndex: 2, right: 10 }}
          color="#fff"
          onPress={() => {
            setImgModal(false);
          }}
        />
        <ImageViewer imageUrls={images} />
      </Modal>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Searchbar
          style={{ flex: 8 }}
          placeholder="Search"
          onIconPress={() => {
            Refresh();
          }}
          onChangeText={(text) => {
            param.search = text;
            postData("Transaction/BrowseShopBill", param).then((data) => {
              if (data.length === 0) {
                setLoadBtn(false);
              }
              //console.log(data);
              setGrid(data);
            });
          }}
        />
        <FontAwesome
          name="filter"
          size={40}
          color="#6200ee"
          onPress={() => {
            setVisible(!visible);
          }}
        />
      </View>

      {visible && (
        <View style={{ overflow: "scroll" }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
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
                Refresh(param);
              }}
            />
          </View>
        </View>
      )}
      <ScrollView horizontal={true}>
        <View>
          <Table borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}>
            <Row
              data={[
                "Sr No",
                "Date",
                "Party Name",
                "GR No.",
                "Gaddi",
                "Receive",
                "Amount",
                "Remarks",
                "Image1",
                "Image2",
                "Created By",
                "Action",
              ]}
              style={styles.head}
              textStyle={styles.text}
              widthArr={widthArr}
            />
          </Table>

          <FlatList
            data={gridData}
            getItemLayout={(data, index) => ({
              length: 55,
              offset: 55 * index,
              index,
            })}
            initialNumToRender={5}
            renderItem={({ item, index }) => (
              <Table borderStyle={{ borderWidth: 1, borderColor: "#c8e1ff" }}>
                <Row
                  key={index}
                  data={[
                    index + 1,
                    item.date,
                    item.party,
                    item.amount,
                    item.remarks,
                    img("Day_Book_DetailsImage", item.image_path),
                    img("Day_Book_DetailsImageTwo", item.image_path1),
                    item.created_by,
                    Action(item.tran_id),
                  ]}
                  style={styles.row}
                  textStyle={styles.text}
                  widthArr={widthArr}
                />
              </Table>
            )}
            keyExtractor={(item) => item.tran_id}
          />
        </View>
      </ScrollView>

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => {
          navigation.navigate("DayBookForm");
        }}
      />

      <Modal
        visible={imgmodal}
        transparent={true}
        onRequestClose={() => {
          setImgModal(false);
        }}
      >
        <FontAwesome
          name="close"
          size={30}
          color="black"
          style={{ color: "white", position: "absolute", zIndex: 2, right: 10 }}
          color="#fff"
          onPress={() => {
            setImgModal(false);
          }}
        />
        <ImageViewer imageUrls={images} />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 16,
    left: 0,
    bottom: 0,
    backgroundColor: "#6200ee",
  },
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: "#fff" },
  header: { height: 50, backgroundColor: "#537791" },
  text: { textAlign: "center", fontWeight: "100" },
  dataWrapper: { marginTop: -1 },
  row: { height: 55 },
  head: { height: 55, backgroundColor: "#f1f8ff" },
  text: { margin: 6 },
  listContent: {
    fontFamily: font.medium,
    fontSize: 14,
    marginRight: 10,
  },

  listContentBox: {
    display: "flex",
    marginVertical: 3,
  },
  spinnerTextStyle: {
    color: "#FFF",
  },
});

export default ShopGRList;

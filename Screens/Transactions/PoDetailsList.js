import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image, ScrollView, Modal, Alert, FlatList } from "react-native";
import { Table, Row } from "react-native-table-component";
import {
  FAB,
  Text,
  DataTable,
  Searchbar,
  TouchableRipple,
  Button,
  Dialog,
  Portal,
} from "react-native-paper";
import { postData } from "../../_Services/Api_Service";
import { AuthContext } from "../../Components/Context";
import { FontAwesome, EvilIcons } from "@expo/vector-icons";
import DropDownPicker from "react-native-dropdown-picker";
import DatePicker from "react-native-datepicker";
import Spinner from "react-native-loading-spinner-overlay";
import ImageViewer from "react-native-image-zoom-viewer";

function PoDetailsList({ navigation }) {
  const { userId } = React.useContext(AuthContext);

  const [visible, setVisible] = React.useState(false);
  const [gridData, setGrid] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [isloading, setloading] = React.useState(true);
  const [modal, setModal] = React.useState({ po_id: "", status: "", visible: false });
  const [imgmodal, setImgModal] = React.useState(false);
  const [images, setImages] = React.useState([{ url: "../../assets/upload.png" }]);
  const [statusList] = React.useState([
    { label: "Pending Payment", value: "Pending Payment" },
    { label: "Hold", value: "Hold" },
    { label: "Cancel", value: "Cancel" },
    { label: "Active", value: "Active" },
  ]);
  const [param, setParam] = React.useState({
    user_id: "",
    search: "",
    skip: "0",
    from_date: "",
    to_date: "",
  });

  const itemsPerPage = gridData.length > 10 ? 10 : gridData.length;
  const from = page * itemsPerPage;
  const to = (page + 1) * itemsPerPage;

  const widthArr = [50, 100, 200, 100, 100, 80, 120, 120, 120, 230];
  const img = (file_path) => {
    return (
      <TouchableRipple
        onPress={async () => {
          setImages([
            { url: `https://musicstore.quickgst.in/Attachment_Img/PO_DetailsImage/${file_path}` },
          ]);
          setImgModal(true);
        }}
      >
        <Image
          source={{
            uri: `https://musicstore.quickgst.in/Attachment_Img/PO_DetailsImage/${file_path}`,
          }}
          style={{ width: 120, height: 60 }}
        />
      </TouchableRipple>
    );
  };

  const Refresh = () => {
    postData("Transaction/BrowsePo", param).then((data) => {
      //console.log(data);
      setGrid(data);
      setloading(false);
    });
  };

  React.useEffect(() => {
    userId().then((data) => {
      param.user_id = data;
      postData("StockDashboard/PreviewDateFilter", param).then((data) => {
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

  const Action = (po_id, status) => {
    return (
      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        <FontAwesome
          name="edit"
          size={30}
          color="green"
          onPress={() => {
            navigation.navigate("podetailform", { po_id: po_id });
          }}
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
                    Delete(po_id);
                  },
                },
              ],
              { cancelable: false }
            );
          }}
        />
        <Button
          mode="contained"
          onPress={() => {
            setModal({ po_id: po_id, status: status, visible: true });
          }}
        >
          Status
        </Button>
        <FontAwesome
          name="file"
          size={30}
          color="black"
          onPress={() => {
            navigation.navigate("rptpo", { tran_id: po_id });
          }}
        />
      </View>
    );
  };
  const Delete = (po_id) => {
    let _param = {
      user_id: param.user_id,
      po_id: po_id,
    };
    setloading(true);
    postData("Transaction/DeletePo", _param).then((data) => {
      Refresh();
      setloading(false);
    });
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
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Searchbar
          style={{ flex: 10 }}
          placeholder="Search"
          onIconPress={() => {
            Refresh();
            setPage(0);
          }}
          onChangeText={(text) => {
            param.search = text;
            setParam({ ...param });
            Refresh();
            setPage(0);
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
                "S No",
                "Date",
                "Local Name",
                "Gaddi",
                "No. Of Parcel",
                "Balance Details",
                "Mobile",
                "Status",
                "Image",
                "Action",
              ]}
              style={styles.head}
              textStyle={styles.text}
              widthArr={widthArr}
            />
          </Table>
          {/* {gridData.map((item, index) => {
            return (
              <Row
                key={index}
                data={[
                  index + 1,
                  item.po_date,
                  item.party,
                  item.gaddi_name,
                  item.no_of_partial,
                  item.balance_details,
                  item.mobile,
                  item.status,
                  img(item.file_path),
                  Action(item.po_id, item.status),
                ]}
                style={styles.row}
                textStyle={styles.text}
                widthArr={widthArr}
              />
            );
          })} */}
          <FlatList
            data={gridData}
            getItemLayout={(data, index) => ({ length: 55, offset: 55 * index, index })}
            initialNumToRender={5}
            renderItem={({ item, index }) => (
              <Table borderStyle={{ borderWidth: 1, borderColor: "#c8e1ff" }}>
                <Row
                  key={index}
                  data={[
                    index + 1,
                    item.po_date,
                    item.party,
                    item.gaddi_name,
                    item.no_of_partial,
                    item.balance_details,
                    item.mobile,
                    item.status,
                    img(item.file_path),
                    Action(item.po_id, item.status),
                  ]}
                  style={styles.row}
                  textStyle={styles.text}
                  widthArr={widthArr}
                />
              </Table>
            )}
            keyExtractor={(item) => item.po_id}
          />
        </View>
      </ScrollView>

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => {
          navigation.navigate("podetailform");
        }}
      />
      <Portal>
        <Dialog visible={modal.visible} dismissable={true}>
          <Dialog.Title>Update Status</Dialog.Title>
          <Dialog.Content>
            <View style={{ height: 150, overflow: "scroll" }}>
              <DropDownPicker
                itemStyle={{
                  justifyContent: "flex-start",
                }}
                dropDownMaxHeight={120}
                placeholder="Select Status"
                style={styles.dropdown}
                items={statusList}
                defaultValue={modal.status}
                onChangeItem={(item) => {
                  setModal({
                    ...modal,
                    status: item.value,
                  });
                }}
              />
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              mode="contained"
              onPress={() => {
                if (modal.status == "") {
                  Alert.alert("Select Status");
                } else {
                  setloading(true);
                  postData("Transaction/UpdatePoStatus", modal).then((data) => {
                    if (data.valid) {
                      setModal({ ...modal, visible: false });
                      Refresh();
                    } else {
                      Alert.alert(data.msg);
                    }
                    setloading(false);
                  });
                }
              }}
            >
              Done
            </Button>
            <Button
              mode="contained"
              color="red"
              onPress={() => {
                setModal({ ...modal, visible: false });
              }}
            >
              Close
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

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
}

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
});

export default PoDetailsList;

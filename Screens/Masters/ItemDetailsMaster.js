import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image, ScrollView, Alert } from "react-native";
import { Table, Row } from "react-native-table-component";
import { FAB, Text, DataTable, Searchbar, ActivityIndicator, Button, Dialog, Portal, TextInput } from "react-native-paper";
import { postData } from "../../_Services/Api_Service";
import { AuthContext } from "../../Components/Context";
import { FontAwesome } from "@expo/vector-icons";
import Spinner from "react-native-loading-spinner-overlay";
function ItemDetailsMaster({ navigation }) {
    const { userId } = React.useContext(AuthContext);

    const [gridData, setGrid] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [isloading, setloading] = React.useState(true);
    const [modal, setModal] = React.useState({ item_id: "", item_name: "", user_id: "", visible: false });
    const [param, setParam] = React.useState({
        user_id: "",
        search: "",
        skip: "0",
    });

    const itemsPerPage = gridData.length > 10 ? 10 : gridData.length;

    const widthArr = [200, 150];

    const Refresh = () => {
        postData("Masters/BrowseItemDetails", param).then((data) => {
            setGrid(data);
            setloading(false);
        });
    };



    React.useEffect(() => {
        userId().then((data) => {
            param.user_id = data;
            modal.user_id = data;
        });

        setTimeout(() => {
            Refresh();
        }, 1000);
    }, []);

    const Action = (item_id, item_name) => {
        return (
            <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                <FontAwesome name="edit" size={30} color="green" onPress={() => { setModal({ ...modal, item_id: item_id, item_name: item_name, visible: true }); }} />
                <FontAwesome name="trash" size={24} color="red" onPress={() => { Delete(item_id); }} />
            </View>
        );
    };

    const Delete = (item_id) => {
        let _param = {
            item_id: item_id,
        };
        setloading(true);
        postData("Masters/DeleteItemDetails", _param).then((data) => {
            Refresh(param);
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
            <Searchbar
                placeholder="Search"
                onIconPress={() => {
                    Refresh();
                    setPage(0);
                }}
                onChangeText={(text) => {
                    setParam({
                        ...param,
                        search: text,
                    });
                }}
            />
            <ScrollView horizontal={true}>
                <Table borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}>
                    <Row
                        data={["Item Name", "Action",]}
                        style={styles.head}
                        textStyle={styles.text}
                        widthArr={widthArr}
                    />
                    {gridData.map((item, index) => {
                        return (
                            <Row
                                key={index}
                                data={[
                                    item.item_name,
                                    Action(item.item_id, item.item_name),
                                ]}
                                style={styles.row}
                                textStyle={styles.text}
                                widthArr={widthArr}
                            />
                        );
                    })}
                </Table>
            </ScrollView>
            <DataTable>
                <DataTable.Pagination
                    page={page}
                    numberOfPages={itemsPerPage < 10 ? page + 1 : page + 2}
                    onPageChange={(page) => {
                        setPage(page);
                        param.skip = page * 10;
                        Refresh();
                    }}
                />
            </DataTable>

            <FAB
                style={styles.fab}
                icon="plus"
                onPress={() => {
                    setModal({ ...modal, item_id: "0", item_name: "", visible: true });
                }}
            />
          

            <Portal>
                <Dialog visible={modal.visible} dismissable={true}>
                    <Dialog.Title>Item Details Master</Dialog.Title>
                    <Dialog.Content>
                        <TextInput
                            style={styles.input}
                            mode="outlined"
                            label={"Item Name"}                           
                            value={modal.item_name}
                            onChangeText={(text) => {
                                setModal({
                                    ...modal,
                                    item_name: text,
                                });
                            }}
                        ></TextInput>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button mode="contained" onPress={() => {
                            if (modal.item_name == "") {
                                Alert.alert("Fill Item Name");
                            }
                            else {
                                setloading(true);
                                postData("Masters/InsertItemDetails", modal).then((data) => {
                                    if (data.valid) {
                                        setModal({ ...modal, visible: false });
                                        Refresh();
                                    }
                                    else {
                                        Alert.alert(data.msg);
                                    }
                                    setloading(false);
                                });
                            }
                        }}>Done</Button>
                        <Button mode="contained" color="red" onPress={() => { setModal({ ...modal, visible: false }); }}>Close</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
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
    row: { height: 40 },
    head: { height: 40, backgroundColor: "#f1f8ff" },
    text: { margin: 6 },
    spinnerTextStyle: {
        color: "#FFF",
      },
});

export default ItemDetailsMaster;

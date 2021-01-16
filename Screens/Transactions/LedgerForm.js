import React, { Component, Fragment } from "react";
import { Text, TextInput, FAB, TouchableRipple, Divider, Headline, ActivityIndicator, Chip, Dialog, Portal, Button } from "react-native-paper";
import { View, ScrollView, StyleSheet, Image, SafeAreaView, Alert, PermissionsAndroid, Dimensions, Platform, } from "react-native";
import DatePicker from "react-native-datepicker";
import { postData } from "../../_Services/Api_Service";
import { AuthContext } from "../../Components/Context";
import SearchableDropdown from 'react-native-searchable-dropdown';
import Spinner from 'react-native-loading-spinner-overlay';
export default function LedgerForm({ route, navigation }) {
    const { ledger_id } = route.params;
    const { userId } = React.useContext(AuthContext);
    const [isloading, setloading] = React.useState(true);
    const [partyList, setPartyList] = React.useState([]);
    const [param, setParam] = React.useState({
        ledger_id: "",
        tran_id: "",
        date: "",
        party_name: "",
        party_id: "",
        advance: "",
        payable: "",
        remarks: "",
        user_id: "",
    });
    const [modal, setModal] = React.useState(false);
    React.useEffect(() => {
        userId().then((data) => {
            param.user_id = data;
            param.ledger_id = ledger_id;
            setParam({ ...param, user_id: data, ledger_id: ledger_id });
        });
    }, []);

    return (
        <Fragment>
            <View style={{ flex: 1 }}>
                <Spinner
                    visible={isloading}
                    textContent={'Loading..'}
                    textStyle={styles.spinnerTextStyle}
                    size={'large'}
                    color={'#6200ee'}
                    animation={'fade'}
                    textStyle={{ color: '#6200ee' }}
                />
                <Portal>
                    <Dialog
                        visible={modal}
                        onDismiss={() => {
                            setModal(false);
                        }}
                    >
                        <Dialog.Title>Select Party </Dialog.Title>
                        <Dialog.Content>
                            <SearchableDropdown
                                onItemSelect={(item) => {
                                    setParam({
                                        ...param,
                                        party_id: item.id,
                                        party_name: item.name
                                    });
                                }}
                                containerStyle={{ padding: 1 }}
                                itemStyle={{
                                    padding: 10,
                                    marginTop: 2,
                                    backgroundColor: "#fff",
                                    borderColor: "#000",
                                    borderWidth: 1,
                                    borderRadius: 5,
                                }}
                                itemTextStyle={{ color: "#222" }}
                                itemsContainerStyle={{ maxHeight: 140 }}
                                items={partyList}
                                defaultIndex={2}
                                resetValue={false}
                                textInputProps={{
                                    placeholder: "Search Party",
                                    underlineColorAndroid: "transparent",
                                    style: {
                                        padding: 13,
                                        borderWidth: 1,
                                        borderColor: "#7b7070",
                                        borderRadius: 5,
                                    },
                                    onTextChange: (text) => {
                                        postData("StockDropdown/SelectPartyName", { search: text }).then(
                                            (resp) => {
                                                setPartyList(resp);
                                            }
                                        );
                                    },
                                }}
                                listProps={{
                                    nestedScrollEnabled: true,
                                }}
                            />
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button
                                onPress={() => {
                                    setModal(false);
                                }}
                            >
                                Done
                            </Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
                <SafeAreaView>
                    <ScrollView>
                        <View style={{ padding: 50 }}>
                            <DatePicker
                                style={{ width: 260, marginTop: 4, marginBottom: 4 }}
                                date={param.date}
                                mode="date"
                                placeholder="Select date"
                                format="DD/MM/YYYY"
                                showIcon={false}
                                onDateChange={(date) => {
                                    setParam({
                                        ...param,
                                        date: date,
                                    });
                                }}
                                customStyles={{
                                    dateInput: {
                                        borderRadius: 5
                                    }
                                }}
                            />

                            <TouchableRipple
                                onPress={() => {
                                    setModal(true);
                                }}
                            >
                                <TextInput
                                    style={styles.input}
                                    mode="outlined"
                                    label={"Party Name"}
                                    value={param.party_name}
                                    editable={false}
                                ></TextInput>
                            </TouchableRipple>


                            <TextInput
                                style={styles.input}
                                mode="outlined"
                                label={"Advance"}
                                keyboardType="numeric"
                                value={param.advance}
                                onChangeText={(text) => {
                                    setParam({
                                        ...param,
                                        advance: text,
                                    });
                                }}
                            ></TextInput>

                            <TextInput
                                style={styles.input}
                                mode="outlined"
                                label={"Payable"}
                                keyboardType="numeric"
                                value={param.payable}
                                onChangeText={(text) => {
                                    setParam({
                                        ...param,
                                        payable: text,
                                    });
                                }}
                            ></TextInput>
                            <TextInput
                                style={styles.textArea}
                                multiline={true}
                                numberOfLines={5}
                                mode="outlined"
                                label={"Remarks"}
                                value={param.remarks}
                                onChangeText={(text) => {
                                    setParam({
                                        ...param,
                                        remarks: text,
                                    });
                                }}
                            ></TextInput>
                        </View>
                    </ScrollView>
                </SafeAreaView>
                <FAB
                    style={styles.fabRight}
                    icon="check"
                    onPress={() => {
                        if (param.ledger_id == "") {
                            alert("Please Select Ledger");
                        }
                        else {
                            setloading(true);
                            if (param.party_id == "") {
                                Alert.alert("Please Select Party");
                            }
                            else {
                                postData("Transaction/PostLedgerOpeningBalance", param).then((data) => {
                                    if (data.valid) {
                                        Alert.alert("Form Save Succeessfully!!");
                                        navigation.navigate("ledgerlist");
                                    } else {
                                        Alert.alert(data.msg);
                                    }
                                    setloading(false);
                                });
                            }
                        }
                    }}
                />
                <FAB
                    style={styles.fabLeft}
                    icon="close"
                    onPress={() => {
                        navigation.navigate("ledgerlist");
                    }}
                />
            </View>
        </Fragment>
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
        backgroundColor: '#6200ee',
    },
    fabRight: {
        position: "absolute",
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: '#6200ee',
    },
    dropdown: {
        height: 45,
        marginTop: 4,
        marginBottom: 4,
        //borderWidth: 2,
        borderColor: "grey",
    },
});

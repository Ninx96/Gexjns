import React from "react";
import Webview from "react-native-webview";
import PDFReader from "rn-pdf-reader-js";
import * as Sharing from "expo-sharing";
import { Button } from "react-native-paper";
import { View, Image } from "react-native";
import { Asset } from "expo-asset";

import * as Print from "expo-print";
import * as FileSystem from "expo-file-system";

export default function RptPackingSlip({ navigation, route }) {
  const { tran_id } = route.params;
  const [share, setShare] = React.useState(false);
  const [url, setURL] = React.useState("");

  React.useEffect(() => {
    Sharing.isAvailableAsync().then((result) => {
      if (result) {
        FileSystem.downloadAsync(
          `https://musicstore.quickgst.in/App_Rtp/RptPackingSlip.aspx?tran_id=${tran_id}`,
          FileSystem.cacheDirectory + `PackingSlip${tran_id}.pdf`
        )
          .then(async ({ uri }) => {
            setURL(uri);
          })
          .catch((error) => {
            console.error(error);
          });
      }
      setShare(result);
    });
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{ flexDirection: "row", justifyContent: "space-evenly", backgroundColor: "#585858" }}
      >
        {share && (
          <Button
            icon="share-variant"
            mode="contained"
            style={{ width: "40%" }}
            onPress={async () => {
              await Sharing.shareAsync(url);

              // const imageURI = Asset.fromURI(
              //   `https://musicstore.quickgst.in/App_Rtp/RptPackingSlip.aspx?tran_id=${tran_id}`
              // );
              // imageURI.downloadAsync().then(async () => {
              //   //console.log(imageURI);
              //   await Sharing.shareAsync(imageURI.localUri);
              // });
            }}
          >
            Share
          </Button>
        )}
        <Button
          icon="printer"
          style={{ width: "40%" }}
          mode="contained"
          onPress={() => {
            Print.printAsync({
              uri: `https://musicstore.quickgst.in/App_Rtp/RptPackingSlip.aspx?tran_id=${tran_id}`,
            });
          }}
        >
          Print
        </Button>
      </View>
      <PDFReader
        source={{
          uri: `https://musicstore.quickgst.in/App_Rtp/RptPackingSlip.aspx?tran_id=${tran_id}`,
        }}
        onLoadEnd={(e) => {
          // console.log(e);
          // setURL(e.nativeEvent.url);
        }}
      />
    </View>
  );
}

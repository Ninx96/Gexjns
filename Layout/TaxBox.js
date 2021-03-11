import React from "react";
import { View } from "react-native";
import { TextInput, ToggleButton } from "react-native-paper";

const TaxBox = ({ onValueChange, amount, style, placeholder, value }) => {
  const [type, setType] = React.useState("numeric");
  const [text, setText] = React.useState(value);

  React.useEffect(() => {
    if (type == "percent") {
      var discount = (parseFloat(text) * parseFloat(amount)) / 100;
      onValueChange(discount);
    } else {
      onValueChange(text);
    }
  }, [text, type]);

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        ...style,
      }}
    >
      <ToggleButton.Row
        value={type}
        style={{}}
        onValueChange={(value) => {
          setType(value);
        }}
      >
        <ToggleButton icon="percent" value="percent" />
        <ToggleButton icon="numeric" value="numeric" />
      </ToggleButton.Row>
      <TextInput
        value={text}
        placeholder={placeholder}
        style={{ width: "60%" }}
        keyboardType="number-pad"
        onChangeText={(value) => {
          setText(value);
        }}
      ></TextInput>
    </View>
  );
};

export default TaxBox;

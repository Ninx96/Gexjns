import React from "react";
import { Appbar } from "react-native-paper";

function Header(props) {
  return (
    <Appbar.Header>
      <Appbar.Content title={props.head}></Appbar.Content>
    </Appbar.Header>
  );
}

export default Header;

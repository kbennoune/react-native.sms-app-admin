"use strict";
import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  NavigatorIOS,
  TouchableOpacity
} from "react-native";

import { connect } from "react-redux";
import { Button, Icon, Overlay, Input } from "react-native-elements";

import styles from "../styles/styles";

class SetBusinessPage extends Component<{}> {
  render() {
    return (
      <View style={{ height: "100%", padding: 50 }}>
        <View>
          <Text>Welcome back, you need to choose a business to use.</Text>
        </View>
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {};
};

const mapStateToProps = ({ appData, app }) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(SetBusinessPage);

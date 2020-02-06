"use strict";
import React, { Component } from "react";

import {
  Platform,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableHighlight,
  Dimensions,
  TextInput,
  Modal,
  ActivityIndicator,
  NavigatorIOS
} from "react-native";

import { connect } from "react-redux";
import styles from "../styles/styles";

class TabContentHeader extends Component<{}> {
  render() {
    return (
      <View
        style={{
          justifyContent: "flex-start",
          flexDirection: "row",
          marginTop: 50
        }}
      >
        <ActivityIndicator
          animating={this.props.loadingData}
          style={styles.activityIndicator}
        />
        <Text style={styles.description}>{this.props.tabName}</Text>
        {this.props.children}
      </View>
    );
  }
}

const mapStateToProps = ({ app, appData }) => {
  return { loadingData: app.loadingData };
};

export default connect(mapStateToProps, {})(TabContentHeader);

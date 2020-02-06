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
  NavigatorIOS
} from "react-native";

import { connect } from "react-redux";
import { Button, Icon, Overlay } from "react-native-elements";

import styles from "../styles/styles";
import { colors } from "../styles/styles";

class MessageStarter extends Component<{}> {
  render() {
    return (
      <Button
        containerStyle={[
          styles.messageStarterButtonCtn,
          {
            shadowOffset: { width: 2, height: 1 },
            shadowRadius: 1,
            shadowOpacity: 0.4,
            shadowColor: colors.caput_mortuum
          }
        ]}
        buttonStyle={styles.messageStarterButton}
        icon={<Icon name="sms" size={25} color={colors.raffia} />}
        title=""
        onPress={this.props.startMessage}
      />
    );
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    startMessage: event => {
      dispatch({ type: "START_MESSAGE" });
    }
  };
};

const mapStateToProps = ({ app, appData }) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(MessageStarter);

import React, { Component } from "react";

import { connect } from "react-redux";

import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  View,
  TabBarIOS,
  Dimensions,
  Keyboard
} from "react-native";

import { Icon } from "react-native-elements";

import MainContent from "./MainContent";
import LoginPage from "./LoginPage";
import SetBusinessPage from "./SetBusinessPage";
import { colors } from "../styles/styles";

class Application extends Component<{}> {
  componentDidMount() {
    this.props.loadLocalData();
    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this.props.showKeyboard
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this.props.hideKeyboard
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  constructor(props) {
    super();

    Dimensions.addEventListener("change", props.setOrientation);
  }

  render() {
    const { networkUnavailable } = this.props;

    return (
      <View style={{ flex: 1, flexDirection: "column" }}>
        {networkUnavailable && this.renderNetworkError()}
        {this.renderContent()}
      </View>
    );
  }

  renderNetworkError() {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around",
          flexWrap: "nowrap",
          marginBottom: 4
        }}
      >
        <Icon
          containerStyle={{
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colors.raffia,
            width: 24,
            height: 24,
            borderRadius: 12
          }}
          iconStyle={{ color: colors.thunderbird }}
          size={18}
          name="wifi-off"
          type="material-community"
        />
        <Text
          style={{
            width: "70%",
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "center",
            flexDirection: "row",
            flexWrap: "wrap"
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontSize: 12,
              flex: 0,
              color: colors.cape_honey
            }}
          >
            The internet is inaccessible! Check your connection{" "}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: colors.deep_sky_blue,
              textDecorationLine: "underline"
            }}
            onPress={this.props.reloadApp}
          >
            and refresh.
          </Text>
        </Text>
      </View>
    );
  }

  renderContent() {
    const { loadingApp, authenticityToken, businessId } = this.props;

    if (loadingApp) {
      return (
        <View
          style={{
            height: "100%",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <ActivityIndicator size="large" color={colors.cape_honey} />
        </View>
      );
    } else if (!authenticityToken) {
      return <LoginPage />;
    } else if (!businessId) {
      return <SetBusinessPage />;
    } else {
      return <MainContent />;
    }
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    loadLocalData: () => {
      dispatch({ type: "LOAD_LOCAL_DATA" });
    },
    reloadApp: () => {
      dispatch({ type: "LOAD_LOCAL_DATA" });
    },
    setOrientation: ({ window, screen }) => {
      dispatch({ type: "CHANGE_DIMENSIONS", window, screen });
    },
    showKeyboard: event => {
      dispatch({ type: "SHOW_KEYBOARD" });
    },
    hideKeyboard: event => {
      dispatch({ type: "HIDE_KEYBOARD" });
    }
  };
};

const mapStateToProps = ({ app }) => {
  const { authenticityToken, businessId, loadingApp, networkUnavailable } = app;
  return { authenticityToken, businessId, loadingApp, networkUnavailable };
};

export default connect(mapStateToProps, mapDispatchToProps)(Application);

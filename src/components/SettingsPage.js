"use strict";
import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  NavigatorIOS,
  ActivityIndicator
} from "react-native";

import { connect } from "react-redux";
import TabContentHeader from "./TabContentHeader";
import { phoneFormat } from "../helpers/formatters.js";
import { Button, Icon, Overlay, Input, Divider } from "react-native-elements";

import styles from "../styles/styles";
import { colors } from "../styles/styles";
class SettingsPage extends Component<{}> {
  businessInfoSection() {
    const {
      currentBusiness,
      loadingAccountData,
      logout,
      changeBusiness,
      businesses
    } = this.props;
    if (loadingAccountData) {
      return <ActivityIndicator />;
    } else if (currentBusiness) {
      return (
        <View
          style={{
            padding: 15,
            flexDirection: "row",
            justifyContent: "space-between"
          }}
        >
          <View style={{ flexDirection: "column" }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                textDecorationLine: "none"
              }}
            >
              Business Info
            </Text>
            <Text>{currentBusiness.name}</Text>
          </View>
          <View style={{ flex: 0, justifyContent: "center" }}>
            {Object.values(businesses).size > 1 && (
              <Button
                buttonStyle={{ backgroundColor: "#3662aa" }}
                onPress={changeBusiness}
                title="Change"
              />
            )}
          </View>
        </View>
      );
    } else {
      return (
        <View
          style={{
            padding: 15,
            flexDirection: "row",
            justifyContent: "space-between"
          }}
        >
          <View style={{ marginRight: 15, flexDirection: "column", flex: -1 }}>
            <Text style={{ fontSize: 18 }}>
              There's been a problem loading your business info. Try logging out
              and back in.
            </Text>
          </View>
          <View style={{ flex: 0, justifyContent: "center" }}>
            <Button
              buttonStyle={{ backgroundColor: "#3662aa" }}
              onPress={logout}
              title="Logout"
            />
          </View>
        </View>
      );
    }
  }
  userInfoSection() {
    const { loadingAccountData, currentPerson, logout } = this.props;

    if (loadingAccountData) {
      return <ActivityIndicator />;
    } else if (currentPerson) {
      return (
        <View
          style={{
            padding: 15,
            flexDirection: "row",
            justifyContent: "space-between"
          }}
        >
          <View style={{ flexDirection: "column" }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                textDecorationLine: "none"
              }}
            >
              Account Info
            </Text>
            <Text>{currentPerson.name}</Text>
            <Text>{phoneFormat(currentPerson.mobile)}</Text>
          </View>
          <View style={{ justifyContent: "center" }}>
            <Button
              buttonStyle={{ backgroundColor: "#3662aa" }}
              onPress={logout}
              title="Logout"
            />
          </View>
        </View>
      );
    } else {
      return (
        <View
          style={{
            padding: 15,
            flexDirection: "row",
            justifyContent: "space-between"
          }}
        >
          <View style={{ marginRight: 15, flexDirection: "column", flex: -1 }}>
            <Text style={{ fontSize: 18 }}>
              There's been a problem loading your account info. Try logging out
              and back in.
            </Text>
          </View>
          <View style={{ flex: 0, justifyContent: "center" }}>
            <Button
              buttonStyle={{ backgroundColor: "#3662aa" }}
              onPress={logout}
              title="Logout"
            />
          </View>
        </View>
      );
    }
  }
  render() {
    return (
      <View style={{ backgroundColor: "white", height: "100%" }}>
        {this.userInfoSection()}
        {this.businessInfoSection()}
        <View style={{ padding: 10, flexDirection: "column" }}>
          {!this.props.authenticityToken && (
            <Button
              buttonStyle={{ backgroundColor: "#3662aa" }}
              onPress={this.props.login}
              title="Login"
            />
          )}
        </View>
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    login: event => dispatch({ type: "LOGIN" }),
    logout: event => dispatch({ type: "LOGOUT" }),
    changeBusiness: event => dispatch({ type: "CHANGE_BUSINESS" })
  };
};

const mapStateToProps = ({ appData, app }) => {
  const { authenticityToken, loadingAccountData, businessId } = app;
  const { currentPerson, businesses } = appData;

  const currentBusiness = businessId && businesses[businessId];
  return {
    authenticityToken,
    loadingAccountData,
    currentPerson,
    currentBusiness,
    businesses
  };
};

const areStatesEqual = (next, prev) => {
  // A better way to handle this would be to deal
  // with this is to do some kind of shallow comparison.
  //
  // For now this will work though
  if (next.app.selectedTab !== "settings") {
    return true;
  } else {
    next === prev;
  }
};
export default connect(mapStateToProps, mapDispatchToProps, null, {
  areStatesEqual
})(SettingsPage);

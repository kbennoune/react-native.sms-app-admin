"use strict";
import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  NavigatorIOS,
  TouchableOpacity
} from "react-native";

import { connect } from "react-redux";
import { Button, Icon, Overlay, Input } from "react-native-elements";

import AppHeader from "./subcomponents/AppHeader";

import styles from "../styles/styles";
import { colors } from "../styles/styles";
import FormInput from "./subcomponents/FormInput";
import debounce from "lodash/debounce";

class LoginPage extends Component<{}> {
  render() {
    const { errors } = this.props;

    return (
      <KeyboardAvoidingView
        behavior="position"
        style={{
          height: "100%",
          backgroundColor: colors.caput_mortuum,
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "center",
          flexWrap: "nowrap"
        }}
      >
        <View style={{ flex: 7, justifyContent: "center" }}>
          <View style={{ flex: 0, height: 46, lineHeight: 46 }}>
            <Text
              style={{
                flex: 0,
                color: "#FFFFFF",
                fontSize: 46,
                lineHeight: 46
              }}
            >
              Text Herd
            </Text>
          </View>

          <View
            style={{
              flex: 0,
              flex: 0,
              flexDirection: "row",
              justifyContent: "center",
              height: "auto"
            }}
          >
            <Text style={{ fontSize: 30, marginRight: -3, marginTop: 4 }}>
              🦓
            </Text>
            <Text style={{ fontSize: 30, marginRight: -2, marginTop: 8 }}>
              🦓
            </Text>
            <Text style={{ fontSize: 30, marginLeft: -4, marginTop: 0 }}>
              🦓
            </Text>
          </View>
        </View>

        {!this.props.mobile && (
          <View
            style={{
              flex: 4,
              width: "63%",
              flexDirection: "row",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              flexWrap: "wrap",
              marginBottom: "auto"
            }}
          >
            <FormInput
              label="Mobile Number"
              labelStyle={{ display: "none" }}
              errorStyle={{ backgroundColor: "green" }}
              placeholder="Mobile"
              value={this.props.formMobile}
              onChangeText={this.props.changeMobile}
              keyboardType="phone-pad"
              formIcon={{ name: "ios-phone-portrait", type: "ionicon" }}
            />
            <Button
              containerStyle={{ width: "100%" }}
              buttonStyle={{ backgroundColor: colors.carmine }}
              onPress={this.props.requestCode.bind(this, this.props.formMobile)}
              title="Send Login Code"
            />
            {!errors || !errors["mobile"] || errors["mobile"].length == 0 ? (
              <View style={{ paddingVertical: 10 }}>
                <Text style={{ color: colors.cape_honey }}>
                  Existing customers, add your phone number and we'll text a
                  signin code.
                </Text>
              </View>
            ) : (
              <View style={{ paddingVertical: 10 }}>
                <Text style={{ color: colors.orange_red }}>
                  {errors.mobile[0]}
                </Text>
              </View>
            )}
          </View>
        )}

        {this.props.mobile && !this.props.codeRequested && (
          <View
            style={{
              flex: 4,
              width: "63%",
              flexDirection: "row",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              flexWrap: "wrap",
              marginBottom: "auto"
            }}
          >
            <Button
              containerStyle={{ width: "100%" }}
              buttonStyle={{ backgroundColor: colors.carmine }}
              onPress={this.props.requestCode.bind(this, this.props.mobile)}
              title="Send Login Code"
            />
            <View style={{ paddingVertical: 10 }}>
              <Text style={{ color: colors.cape_honey }}>
                Request a new code to sign back in.
              </Text>
            </View>
          </View>
        )}

        {this.props.mobile && this.props.codeRequested && (
          <View
            style={{
              flex: 4,
              width: "63%",
              flexDirection: "row",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              flexWrap: "wrap",
              marginBottom: "auto"
            }}
          >
            <FormInput
              formIcon={{ name: "ios-key", type: "ionicon" }}
              keyboardType="phone-pad"
              autoCapitalize="none"
              placeholder="Code"
              value={this.props.formCode}
              onChangeText={this.props.changeCode}
            />
            <Button
              containerStyle={{ width: "100%" }}
              buttonStyle={{ backgroundColor: colors.carmine }}
              onPress={this.props.login.bind(
                this,
                this.props.mobile,
                this.props.formCode
              )}
              title="Login"
            />
            {!errors || !errors["code"] || errors["code"].length == 0 ? (
              <View style={{ paddingVertical: 10 }}>
                <Text style={{ color: colors.cape_honey, textAlign: "center" }}>
                  You should receive a 6 digit code at {this.props.mobile}
                </Text>
              </View>
            ) : (
              <View style={{ paddingVertical: 10 }}>
                <Text style={{ color: colors.orange_red }}>
                  {errors.code[0]}
                </Text>
              </View>
            )}
          </View>
        )}

        {!this.props.mobile && (
          <View
            style={{
              flex: 4,
              width: "63%",
              justifyContent: "flex-start",
              alignContent: "center",
              alignItems: "center"
            }}
          >
            <Button
              containerStyle={{ width: "100%" }}
              buttonStyle={{ backgroundColor: colors.dodger_blue }}
              title="Sign Up"
            />
            <View style={{ paddingVertical: 10 }}>
              <Text style={{ color: colors.light_cyan }}>
                Sign up and start texting now.
              </Text>
            </View>
          </View>
        )}

        {this.props.mobile && (
          <View
            style={{
              flex: 4,
              justifyContent: "flex-start",
              alignContent: "center",
              alignItems: "center"
            }}
          >
            <TouchableOpacity onPress={this.props.resetMobile}>
              <Text
                style={{
                  color: colors.orange_red,
                  textDecorationLine: "underline"
                }}
              >
                Reset Phone Number
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    );
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    requestCode: (mobile, event) => {
      dispatch({ type: "REQUEST_CODE", mobile });
    },
    login: (mobile, code, event) => {
      dispatch({ type: "LOGIN", mobile, code });
    },
    logout: event => dispatch({ type: "LOGOUT" }),
    changeCode: debounce(code => {
      dispatch({
        type: "CHANGE_FIELD",
        componentStateKey: "loginPerson",
        itemId: "new",
        field: "code",
        value: code
      });
    }, 300),
    changeMobile: number =>
      dispatch({
        type: "CHANGE_FIELD",
        componentStateKey: "loginPerson",
        itemId: "new",
        field: "mobile",
        value: number
      }),
    resetMobile: number => dispatch({ type: "RESET_MOBILE" })
  };
};

const mapStateToProps = ({ appData, app }) => {
  const { authenticityToken, loginPerson, mobile, codeRequested } = app;
  const {
    new: { code: formCode, mobile: formMobile, errors }
  } = { new: { code: null, mobile: null, errors: {} }, ...loginPerson };

  return {
    errors,
    authenticityToken,
    formMobile,
    formCode,
    mobile,
    codeRequested
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);

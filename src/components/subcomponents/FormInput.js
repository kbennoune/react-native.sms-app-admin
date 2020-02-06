"use strict";
import React, { PureComponent } from "react";
import { Platform, Text, View, TouchableHighlight } from "react-native";

import { Input, Icon } from "react-native-elements";

import styles from "../../styles/styles";
import { colors } from "../../styles/styles";
import { errorSentence } from "../../helpers/misc";
const errorColor = "#AA0000";

export default class FormInput extends PureComponent<{}> {
  iconColor() {
    const { focused } = this.props;

    if (this.hasErrors()) {
      return errorColor;
    } else if (focused) {
      return colors.thunderbird;
    } else {
      return colors.akaroa;
    }
  }

  hasErrors() {
    const { errorMessages } = { ...this.props };

    return (errorMessages || []).length > 0;
  }

  containerStyle() {
    const containerStyle = [
      {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "flex-end",
        margin: 0,
        width: null,
        flex: 0,
        flexGrow: 0,
        padding: 0,
        alignItems: "flex-start",
        paddingBottom: 16
      }
    ];
    const { focused } = this.props;

    if (this.hasErrors()) {
      return [...containerStyle, { paddingBottom: 0 }];
    } else {
      return [...containerStyle];
    }
  }

  inputContainerStyle() {
    const inputContainerStyle = [
      {
        paddingVertical: 2,
        backgroundColor: colors.raffia,
        borderWidth: 1,
        flex: 10,
        flexBasis: "76%",
        borderColor: colors.solitaire,
        borderWidth: 1
      }
    ];
    const { focused } = this.props;

    if (this.hasErrors()) {
      return [...inputContainerStyle, { borderColor: errorColor }];
    } else if (focused) {
      return [...inputContainerStyle, { borderColor: colors.thunderbird }];
    } else {
      return [...inputContainerStyle];
    }
  }

  render() {
    const containerStyle = this.containerStyle();
    const inputContainerStyle = this.inputContainerStyle();

    const iconContainerStyle = [{ marginLeft: 0, height: 18 }];
    const iconStyle = [{}];

    const { errorVerb, label: attribute } = {
      errorVerb: "should",
      ...this.props
    };
    const { name: iconName, type: iconType } = { ...this.props.formIcon };
    const iconColor = this.iconColor();
    iconStyle.push({ color: iconColor });
    const errorMessage =
      this.props.errorMessages &&
      errorSentence(attribute, this.props.errorMessages, errorVerb);

    const leftIcon = iconName && (
      <Icon
        name={iconName}
        type={iconType}
        size={18}
        containerStyle={iconContainerStyle}
        iconStyle={iconStyle}
        iconColor={iconColor}
      />
    );

    const input = (
      <Input
        underlineColorAndroid="transparent"
        labelStyle={{
          textAlign: "center",
          lineHeight: 30,
          zIndex: 10,
          flex: 3,
          flexBasis: "24%",
          flexShrink: 0,
          fontSize: 14,
          color: "#000000",
          fontWeight: "normal"
        }}
        inputStyle={{ marginLeft: 10, height: 24 }}
        containerStyle={containerStyle}
        inputContainerStyle={inputContainerStyle}
        leftIconContainerStyle={{ marginLeft: 5, height: 20 }}
        leftIcon={leftIcon}
        errorMessage={errorMessage}
        {...this.props}
        errorStyle={{
          textAlign: "right",
          flexShrink: 0,
          flexBasis: "76%",
          fontSize: 12,
          marginTop: 0,
          marginRight: 0,
          color: errorColor,
          ...this.props.errorStyle
        }}
      />
    );

    return input;
  }
}

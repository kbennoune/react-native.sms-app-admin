"use strict";
import React, { Component } from "react";
import { Platform, Text, View, TouchableHighlight } from "react-native";

import { Button, Icon, Card } from "react-native-elements";

import styles from "../../styles/styles";
import { colors } from "../../styles/styles";

export default class AppHeader extends Component<{}> {
  render() {
    const shadowColor = colors.medium_carmine;
    const { showLogo } = this.props;

    return (
      <View
        style={{
          zIndex: 10,
          paddingHorizontal: 12,
          paddingTop: 8,
          paddingBottom: 8,
          flex: 0,
          flexDirection: "row",
          justifyContent: "space-between",
          backgroundColor: colors.carmine
        }}
      >
        {showLogo && (
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "flex-start"
            }}
          >
            <View
              style={{
                alignItems: "center",
                flexDirection: "row",
                marginLeft: 8,
                marginRight: "auto"
              }}
            >
              <Text
                style={{ display: "none", bottom: 2, position: "absolute" }}
              >
                Text Herd
              </Text>

              <Text
                style={{
                  fontSize: 20,
                  marginRight: -3,
                  marginTop: -4,
                  shadowOffset: { width: -4, height: 8 },
                  shadowRadius: 2,
                  shadowOpacity: 0,
                  shadowColor: shadowColor
                }}
              >
                🦓
              </Text>
              <Text
                style={{
                  fontSize: 20,
                  marginRight: -2,
                  marginTop: -0,
                  shadowOffset: { width: -4, height: 8 },
                  shadowRadius: 2,
                  shadowOpacity: 0,
                  shadowColor: shadowColor
                }}
              >
                🦓
              </Text>
              <Text
                style={{
                  fontSize: 20,
                  marginLeft: -4,
                  marginTop: -8,
                  shadowOffset: { width: -4, height: 8 },
                  shadowRadius: 2,
                  shadowOpacity: 0,
                  shadowColor: shadowColor
                }}
              >
                🦓
              </Text>
            </View>
          </View>
        )}
        {this.props.children}
        {React.Children.count(this.props.children) == 0 && (
          <View style={{ flex: 1, marginLeft: "auto" }}></View>
        )}
      </View>
    );
  }
}

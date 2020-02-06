"use strict";
import React, { PureComponent } from "react";
import {
  Platform,
  Text,
  View,
  FlatList,
  TouchableHighlight
} from "react-native";

import { Button, Icon, Card } from "react-native-elements";

import styles from "../../styles/styles";
import { colors } from "../../styles/styles";

export default class SelectContactGroups extends PureComponent<{}> {
  iconProperties(item) {
    if (item.keptAsMember) {
      return {
        textColor: "#000000",
        iconName: "circle",
        iconType: "material-community",
        iconColor: colors.thunderbird,
        underlayColor: colors.solitaire,
        personIconColor: colors.thunderbird
      };
    } else if (item.markedForAddition) {
      return {
        iconColor: colors.cerulean_blue,
        iconName: "add-circle",
        iconType: "materialdesign",
        textColor: colors.cerulean_blue,
        underlayColor: colors.solitaire,
        personIconColor: colors.cerulean_blue
      };
    } else if (item.markedForDeletion) {
      return {
        iconColor: colors.rouge,
        textColor: colors.rouge,
        iconName: "remove-circle",
        iconType: "materialdesign",
        underlayColor: colors.thunderbird,
        personIconColor: colors.rouge
      };
    } else {
      return {
        textColor: "#000000",
        iconName: "circle-outline",
        iconType: "material-community",
        iconColor: colors.thunderbird,
        underlayColor: colors.thunderbird,
        personIconColor: colors.solitaire
      };
    }
  }

  render() {
    const { contactId, toggleGroup, availableTextGroups } = this.props;

    return (
      <FlatList
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="always"
        keyExtractor={(item, idx) => item.id.toString()}
        renderItem={({ item, index }) => {
          const {
            textColor,
            iconName,
            iconType,
            iconColor,
            underlayColor,
            personIconColor
          } = this.iconProperties(item);

          return (
            <TouchableHighlight
              underlayColor={underlayColor}
              onPress={toggleGroup.bind(this, item.id, contactId)}
              style={{}}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
              >
                <Icon
                  containerStyle={{ marginLeft: 8, alignSelf: "center" }}
                  iconStyle={{ color: iconColor }}
                  size={18}
                  name={iconName}
                  type={iconType}
                />
                <Text
                  style={{
                    alignSelf: "center",
                    flex: 0,
                    fontSize: 18,
                    color: textColor
                  }}
                >
                  {item.name}
                </Text>
                <Icon
                  containerStyle={{ marginRight: 8, alignSelf: "center" }}
                  iconStyle={{ color: personIconColor }}
                  size={28}
                  name="ios-people"
                  type="ionicon"
                />
              </View>
            </TouchableHighlight>
          );
        }}
        data={Object.values(availableTextGroups)}
        style={{
          backgroundColor: colors.raffia,
          flex: 0,
          borderWidth: 1,
          borderColor: colors.solitaire
        }}
      />
    );
  }
}

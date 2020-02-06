"use strict";
import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SectionList,
  TouchableHighlight,
  FlatList,
  Animated,
  Dimensions,
  Easing
} from "react-native";

import styles from "../../styles/styles";
import { colors } from "../../styles/styles";
import { phoneFormat } from "../../helpers/formatters.js";

import { connect } from "react-redux";
import { Button, Icon } from "react-native-elements";

class SelectableContactSearch extends Component<{}> {
  selectableListItem(onPress, { item }) {
    return (
      <TouchableHighlight
        underlayColor={item.selected ? "red" : "green"}
        onPress={onPress.bind(this, item)}
        style={[styles.selectRecipientsItem]}
      >
        <View style={{ flexDirection: "row" }}>
          <Text style={{ flex: 5 }}>
            {item.givenName} {item.familyName}
          </Text>
          <Text style={{ flex: 5, color: "green" }}>
            {phoneFormat(item.mobile)}
          </Text>
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    const { contactList, searching, toggleRecipient } = this.props;

    return (
      <View
        style={[
          {
            display: searching ? "flex" : "none",
            flexDirection: "column",
            flex: 1,
            paddingBottom: 40
          }
        ]}
      >
        <Icon
          containerStyle={{
            backgroundColor: colors.rouge,
            borderWidth: 0,
            borderRadius: 15,
            height: 30,
            width: 30,
            zIndex: 100,
            top: 4,
            right: 4,
            position: "absolute"
          }}
          name="ios-close"
          type="ionicon"
          size={28}
          underlayColor={colors.rouge}
          color={"#FFFFFF"}
          onPress={this.props.closeSearch}
        />
        <SectionList
          keyboardShouldPersistTaps="always"
          keyExtractor={(item, idx) => item.recordID}
          renderItem={this.selectableListItem.bind(this, toggleRecipient)}
          ItemSeparatorComponent={this.listItemSeparator}
          sections={contactList}
          renderSectionHeader={({ section }) => (
            <View
              style={[
                styles.selectRecipientsHeader,
                { flex: 0, paddingLeft: 0, justifyContent: "flex-start" }
              ]}
            >
              <View
                style={{
                  justifyContent: "center",
                  flex: 0,
                  borderRadius: 10,
                  width: 20,
                  height: 20,
                  backgroundColor: colors.thunderbird
                }}
              >
                <Text style={{ color: "white", flex: 0, textAlign: "center" }}>
                  {section.title}
                </Text>
              </View>
            </View>
          )}
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: colors.solitaire,
            backgroundColor: "white"
          }}
        />
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const { itemId, componentStateKey } = ownProps;
  return {
    toggleRecipient: (contact, event) => {
      dispatch({
        itemId: itemId,
        name: [contact.givenName, contact.familyName].filter(Boolean).join(" "),
        mobile: contact.mobile,
        componentStateKey,
        type: "USE_CONTACT"
      });
    }
  };
};

const mapStateToProps = ({ app, appData, deviceContacts }, ownProps) => {
  const alphaContactList = deviceContacts.reduce((acc, contact) => {
    const firstLetter = (
      contact.familyName[0] ||
      contact.givenName[0] ||
      ""
    ).toUpperCase();
    const phoneNumber =
      (contact.phoneNumbers || []).find(number => {
        String(number.label).match("mobile");
      }) ||
      (contact.phoneNumbers || [])[0] ||
      "";

    return {
      ...acc,
      [firstLetter]: [
        ...(acc[firstLetter] || []),
        { ...contact, mobile: phoneNumber.number }
      ]
    };
  }, {});

  const contactList = Object.keys(alphaContactList)
    .sort()
    .map(key => {
      return { title: key, data: alphaContactList[key] };
    });

  return {
    contactList
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectableContactSearch);

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
  FlatList
} from "react-native";

import { Button, Icon } from "react-native-elements";
import { Input, ListItem, Divider } from "react-native-elements";
import styles from "../../styles/styles";
import { colors } from "../../styles/styles";

import MultiSelect from "react-native-multiple-select";

import SelectableRecipientSearch from "./SelectableRecipientSearch";
import FormInput from "../subcomponents/FormInput";
import { errorSentence } from "../../helpers/misc";

class MessageOverlay extends Component<{}> {
  listItemSeparator() {
    return <Divider style={{ backgroundColor: "#AAA" }} />;
  }

  selectedRecipients() {
    return [
      ...this.props.selectedGroupIds.map(id => this.props.textGroups[id]),
      ...this.props.selectedPeopleIds.map(id => this.props.people[id])
    ];
  }

  renderRecipientElement() {
    return <View></View>;
  }

  afterToField() {}

  renderRecipientTags() {
    return this.selectedRecipients().map(recipient => {
      const onPress = this.props.toggleRecipient.bind(this, recipient);
      const iconName =
        recipient.collectionType == "textGroups" ? "ios-people" : "ios-person";
      const tagColor =
        recipient.collectionType == "textGroups"
          ? colors.rouge
          : colors.sea_green;
      return (
        <View
          key={`selected-${recipient.collectionType}-${recipient.id}`}
          style={{
            flexDirection: "row",
            flexShrink: 0,
            height: 24,
            alignContent: "flex-start",
            alignItems: "flex-start",
            backgroundColor: tagColor,
            marginHorizontal: 2,
            marginVertical: 4
          }}
        >
          <Icon
            size={20}
            containerStyle={{
              paddingLeft: 4,
              alignSelf: "stretch",
              flexDirection: "row"
            }}
            iconStyle={{ alignSelf: "center", color: "white" }}
            name={iconName}
            type="ionicon"
          />
          <View
            style={{
              marginLeft: 4,
              alignSelf: "stretch",
              flexDirection: "row"
            }}
          >
            <Text
              style={{
                alignSelf: "center",
                color: "white",
                fontSize: 16,
                lineHeight: 18
              }}
            >
              {recipient.name}
            </Text>
          </View>
          <Button
            buttonStyle={{ flex: 0, backgroundColor: tagColor }}
            titleStyle={{ padding: 4, fontSize: 12 }}
            onPress={onPress}
            title="X"
          />
        </View>
      );
    });
  }

  scrollToSearchInput() {
    this.searchRecipients &&
      this.searchRecipients.scrollToEnd({ animated: true });
  }

  focusOnSearchInput() {
    this.searchRecipientsInput &&
      this.searchRecipientsInput.input &&
      this.searchRecipientsInput.input.focus();
  }

  renderMessageElement() {}

  render() {
    const {
      errors,
      outgoingMessage,
      onMessageFocus,
      submitForm,
      buttonDisabled
    } = this.props;

    return (
      <View style={[styles.formCtn]}>
        <View style={styles.formHeaderCtn}>
          <Text style={styles.formHeader}>New Message</Text>
        </View>
        <TouchableOpacity
          activeOpacity={1}
          style={{
            paddingHorizontal: 8,
            paddingVertical: 8,
            flexDirection: "row",
            flex: 0,
            marginTop: 0,
            justifyContent: "flex-end"
          }}
        >
          {this.renderMessageElement()}
          <View
            style={{
              overflow: "visible",
              flexDirection: "column",
              justifyContent: "center",
              width: 0,
              flex: 0
            }}
          >
            <Button
              onPress={submitForm.bind(this, this.props)}
              buttonStyle={styles.textMessageSubmitBtn}
              style={styles.textMessageSubmit}
              icon={
                <Icon
                  name={"paper-plane"}
                  type="entypo"
                  color={buttonDisabled ? colors.forest_green : colors.raffia}
                  size={18}
                  containerStyle={{ padding: 4 }}
                />
              }
              title=""
              disabled={buttonDisabled}
              disabledStyle={{
                backgroundColor: "transparent",
                borderWidth: 1,
                borderColor: colors.forest_green
              }}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={1}
          style={{
            flex: 0,
            flexDirection: "column",
            paddingTop: 8,
            paddingBottom: 2,
            paddingHorizontal: 8,
            zIndex: 10
          }}
        >
          <View
            style={{
              maxHeight: 80,
              flex: 0,
              flexDirection: "row",
              paddingVertical: 0
            }}
          >
            <Text style={{ flex: 0, fontSize: 18, marginRight: 4 }}>To</Text>
            {this.renderRecipientElement()}
          </View>
          {errors.recipients && (
            <Text style={[styles.formError, { flexBasis: null }]}>
              {errorSentence("Recipients", errors.recipients)}
            </Text>
          )}
        </TouchableOpacity>
        {this.afterToField()}
      </View>
    );
  }
}

export default MessageOverlay;

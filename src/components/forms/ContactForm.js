"use strict";
import React, { Component } from "react";
import {
  Platform,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Keyboard
} from "react-native";

import { Button, Icon, Overlay, Input, CheckBox } from "react-native-elements";

import { connect } from "react-redux";

import { denormalizeModel } from "../../helpers/data";
import styles from "../../styles/styles";
import { colors } from "../../styles/styles";

import SelectableContactSearch from "../overlays/SelectableContactSearch";
import FormInput from "../subcomponents/FormInput";
import SelectContactGroups from "../subcomponents/SelectContactGroups";
import debounce from "lodash/debounce";

class ContactForm extends Component<{}> {
  render() {
    const { contact, errors, inFocus, keyboardVisible } = this.props;
    const { dismissKeyboard } = this.props;
    const searchContactsTextColor = this.props.searchDeviceContacts
      ? colors.crab_apple
      : colors.thunderbird;

    return (
      <TouchableOpacity
        activeOpacity={keyboardVisible ? 0.9 : 1.0}
        onPress={dismissKeyboard}
        style={[styles.formCtn]}
      >
        <View style={styles.formHeaderCtn}>
          <Text style={styles.formHeader}>Contact</Text>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            paddingVertical: 8,
            paddingHorizontal: 8
          }}
        >
          <View
            style={{
              flex: 0,
              flexDirection: "column",
              flexWrap: "nowrap",
              justifyContent: "flex-start",
              alignItems: "flex-start"
            }}
          >
            <FormInput
              value={contact.name}
              errorMessages={errors.name}
              label="Name"
              underlineColorAndroid="transparent"
              onChangeText={this.props.setInputState.bind(
                this,
                "name",
                this.props.overlayContactId
              )}
              formIcon={{ name: "ios-person", type: "ionicon" }}
              focused={"name" === inFocus}
              onFocus={this.props.focusInput.bind(
                this,
                "name",
                this.props.overlayContactId
              )}
              onBlur={this.props.blurInput.bind(
                this,
                "name",
                this.props.overlayContactId
              )}
            />

            <FormInput
              onChangeText={this.props.setInputState.bind(
                this,
                "mobile",
                this.props.overlayContactId
              )}
              label="Mobile"
              textContentType="telephoneNumber"
              value={contact.mobile}
              keyboardType={"phone-pad"}
              errorMessages={errors.mobile}
              formIcon={{ name: "ios-phone-portrait", type: "ionicon" }}
              focused={"mobile" === inFocus}
              onFocus={this.props.focusInput.bind(
                this,
                "mobile",
                this.props.overlayContactId
              )}
              onBlur={this.props.blurInput.bind(
                this,
                "mobile",
                this.props.overlayContactId
              )}
            />
            <View
              style={{
                display: this.props.searchDeviceContacts ? "none" : "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
                width: "100%",
                flex: 0
              }}
            >
              <CheckBox
                checkedIcon="address-book"
                uncheckedIcon="address-book-o"
                iconType="font-awesome"
                iconRight={true}
                uncheckedColor={colors.raffia}
                checkedColor={colors.chilean_fire}
                checked={this.props.searchDeviceContacts}
                title={"Search Contacts"}
                onPress={this.props.toggleDeviceContactSearch.bind(this, true)}
                containerStyle={[
                  {
                    justifyContent: "flex-end",
                    marginLeft: 0,
                    marginRight: 0,
                    margin: 0,
                    width: null,
                    flex: 0,
                    padding: 6,
                    marginTop: 0
                  },
                  {
                    backgroundColor: this.props.searchDeviceContacts
                      ? "#83a3d8"
                      : "#bdceea",
                    flexDirection: "row",
                    borderWidth: 0,
                    paddingRight: 10,
                    paddingLeft: 10
                  }
                ]}
                textStyle={{
                  flex: 0,
                  fontSize: 14,
                  marginLeft: 0,
                  marginRight: "auto",
                  color: searchContactsTextColor,
                  fontWeight: "normal",
                  marginRight: 10
                }}
              />
            </View>
            <View
              style={{
                zIndex: 10,
                height: 0,
                width: 0,
                backgroundColor: "red",
                flex: 0,
                overflow: "visible"
              }}
            ></View>
          </View>

          <View
            style={{
              display: this.props.searchDeviceContacts ? "flex" : "none",
              flexDirection: "column",
              justifyContent: "flex-start",
              width: "100%",
              flex: 1
            }}
          >
            <SelectableContactSearch
              itemId={this.props.overlayContactId}
              componentStateKey={this.props.componentStateKey}
              searching={this.props.searchDeviceContacts}
              closeSearch={this.props.toggleDeviceContactSearch.bind(
                this,
                false
              )}
            />

            <ActivityIndicator
              animating={!!this.props.loadingDeviceContacts}
              style={
                ([styles.activityIndicator],
                { zIndex: 11, right: 60, height: "100%", position: "absolute" })
              }
            />
          </View>

          <View
            style={{
              display: this.props.searchDeviceContacts ? "none" : "flex",
              flex: 0,
              flexDirection: "column",
              marginTop: 8
            }}
          >
            <View
              style={{
                alignSelf: "stretch",
                backgroundColor: "white",
                backgroundColor: "transparent"
              }}
            >
              <Text
                style={{
                  alignSelf: "flex-start",
                  flex: 0,
                  fontSize: 18,
                  marginRight: 4,
                  color: "#000000",
                  fontWeight: "normal"
                }}
              >
                Groups
              </Text>
            </View>

            <SelectContactGroups
              contactId={contact.id}
              availableTextGroups={this.props.availableTextGroups}
              toggleGroup={this.props.toggleGroup}
            />
          </View>

          <View
            style={{
              display: this.props.searchDeviceContacts ? "none" : "flex",
              flex: 0,
              flexDirection: "row",
              justifyContent: "flex-end",
              marginTop: 8
            }}
          >
            <Button
              buttonStyle={{ backgroundColor: colors.forest_green }}
              containerStyle={{ flex: 0 }}
              title="Save"
              onPress={this.props.submitForm.bind(this, this.props)}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const componentStateKey = `${ownProps.type || "edit"}Contact`;
  return {
    dismissKeyboard: event => {
      Keyboard.dismiss();
    },
    focusInput: (field, itemId) => {
      dispatch({ type: "FOCUS_INPUT", componentStateKey, field, itemId });
    },
    blurInput: (field, itemId) => {
      dispatch({ type: "BLUR_INPUT", componentStateKey, field, itemId });
    },
    toggleGroup: (textGroupId, contactId, event) => {
      dispatch({
        type: "TOGGLE_CONTACT_GROUP",
        contactId,
        textGroupId,
        componentStateKey
      });
    },
    toggleDeviceContactSearch: (toSearchDeviceContacts, event) => {
      dispatch({
        type: "TOGGLE_DEVICE_CONTACT_SEARCH",
        componentStateKey,
        toSearchDeviceContacts
      });
    },
    setInputState: debounce((field, itemId, text) => {
      dispatch({
        type: "CHANGE_FIELD",
        value: text,
        componentStateKey,
        field,
        itemId
      });
    }, 300),
    clearField: (field, event, itemId) => {
      dispatch({ type: "CLEAR_FIELD", componentStateKey, field, itemId });
    },
    submitForm: (formProps, event) => {
      const { availableTextGroups, contact } = formProps;
      const { id } = contact;

      const addedTextGroupIds = availableTextGroups
        .filter(({ markedForAddition }) => markedForAddition)
        .map(({ id }) => id);
      const deletedTextGroupIds = availableTextGroups
        .filter(({ markedForDeletion }) => markedForDeletion)
        .map(({ id }) => id);
      const attributes = ["name", "mobile"].reduce(
        (acc, key) => {
          if (contact[`${key}Changed`]) {
            return { ...acc, [key]: contact[key] };
          } else {
            return acc;
          }
        },
        { addedTextGroupIds, deletedTextGroupIds }
      );

      const type = id == "new" ? "CREATE_CONTACT" : "UPDATE_CONTACT";
      dispatch({ type, attributes, id });
    }
  };
};

const mapStateToProps = ({ appData, app, deviceContacts }, ownProps) => {
  const { loadingDeviceContacts, keyboardVisible } = app;
  const componentStateKey = `${ownProps.type || "edit"}Contact`;
  const { [componentStateKey]: componentState } = app;
  const { overlayContactId, searchDeviceContacts } = componentState;
  const { [overlayContactId]: contactComponentState } = { ...componentState };
  const { inFocus, errors } = { errors: {}, ...contactComponentState };
  const denormalizedModels = denormalizeModel(
    appData,
    "people",
    "personId",
    "textGroupPeople",
    "textGroups",
    "textGroupId"
  );
  const storedContact = denormalizedModels["people"][overlayContactId] || {};
  const editedContactData = ["name", "mobile"].reduce((acc, key) => {
    const { [key]: variable } = { ...contactComponentState };
    const { [key]: existingVariable } = storedContact;

    const variableChanged =
      !(typeof variable == "undefined" || variable == null) &&
      variable !== existingVariable;

    if (variableChanged) {
      return {
        ...acc,
        [key]: variable,
        [`${key}Changed`]: variable !== existingVariable
      };
    } else {
      return acc;
    }
  }, {});

  const contact = {
    id: "new",
    textGroups: {},
    ...storedContact,
    ...editedContactData
  };

  const textGroups = denormalizedModels["textGroups"];

  const { selectedGroups } = { selectedGroups: [], ...contactComponentState };
  const availableTextGroups = Object.values(textGroups).map(textGroup => {
    const isMember = contact.textGroups.hasOwnProperty(textGroup.id);
    const isSelected = selectedGroups.indexOf(textGroup.id.toString()) != -1;
    return Object.assign(
      {
        keptAsMember: isMember && !isSelected,
        markedForDeletion: isMember && isSelected,
        markedForAddition: !isMember && isSelected
      },
      textGroup
    );
  });

  return {
    inFocus,
    overlayContactId,
    contact,
    availableTextGroups,
    searchDeviceContacts,
    loadingDeviceContacts,
    deviceContacts,
    componentStateKey,
    errors,
    keyboardVisible
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ContactForm);

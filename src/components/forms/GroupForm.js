"use strict";
import React, { Component } from "react";
import {
  Platform,
  Text,
  View,
  FlatList,
  TouchableHighlight,
  TouchableOpacity,
  Keyboard
} from "react-native";

import {
  Button,
  Icon,
  Overlay,
  Input,
  CheckBox,
  Divider
} from "react-native-elements";

import { connect } from "react-redux";
import debounce from "lodash/debounce";

import { denormalizeModel } from "../../helpers/data";
import styles from "../../styles/styles";
import { colors } from "../../styles/styles";

import FormInput from "../subcomponents/FormInput";

class GroupForm extends Component<{}> {
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
    const {
      errors,
      inFocus,
      textGroup,
      overlayGroupId,
      currentChannelPermanence,
      setChannelPermanence,
      keyboardVisible,
      availableContacts
    } = this.props;
    const {
      dismissKeyboard,
      setInput,
      focusInput,
      blurInput,
      togglePermanentChannel,
      submitForm,
      toggleGroup
    } = this.props;
    const checkBoxPermanence =
      setChannelPermanence === null
        ? currentChannelPermanence
        : setChannelPermanence;

    return (
      <TouchableOpacity
        activeOpacity={keyboardVisible ? 0.9 : 1.0}
        onPress={dismissKeyboard}
        style={[styles.formCtn]}
      >
        <View style={styles.formHeaderCtn}>
          <Text style={styles.formHeader}>Group</Text>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            paddingVertical: 8,
            paddingHorizontal: 8
          }}
        >
          <FormInput
            label="Name"
            value={textGroup.name}
            onChangeText={setInput.bind(this, "name", overlayGroupId)}
            underlineColorAndroid="transparent"
            errorMessages={errors.name}
            formIcon={{ name: "ios-contacts", type: "ionicon" }}
            focused={"name" === inFocus}
            onFocus={focusInput.bind(this, "name", overlayGroupId)}
            onBlur={blurInput.bind(this, "name", overlayGroupId)}
          />

          <CheckBox
            title="Permanent Number"
            checked={checkBoxPermanence}
            right={false}
            iconRight={true}
            onIconPress={togglePermanentChannel.bind(
              this,
              overlayGroupId,
              currentChannelPermanence,
              setChannelPermanence
            )}
            checkedColor={colors.thunderbird}
            uncheckedColor={colors.solitaire}
            containerStyle={[
              {
                justifyContent: "space-between",
                marginLeft: 0,
                marginRight: 0,
                margin: 0,
                width: null,
                flex: 0,
                padding: 0,
                marginTop: 8
              },
              { backgroundColor: "transparent", borderWidth: 0 }
            ]}
            textStyle={{
              flex: 0,
              fontSize: 18,
              marginLeft: 0,
              marginRight: "auto",
              color: "#000000",
              fontWeight: "normal"
            }}
          />
          <View style={{ flex: 0, flexDirection: "column", marginTop: 8 }}>
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
                Members
              </Text>
            </View>
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
                    onPress={toggleGroup.bind(
                      this,
                      item.id.toString(),
                      overlayGroupId
                    )}
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
                        name="ios-person"
                        type="ionicon"
                      />
                    </View>
                  </TouchableHighlight>
                );
              }}
              data={Object.values(availableContacts)}
              style={{
                backgroundColor: colors.raffia,
                flex: 0,
                borderWidth: 1,
                borderColor: colors.solitaire
              }}
            />
          </View>
          <View
            style={{
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
              onPress={submitForm.bind(this, this.props)}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const mapDispatchToProps = (dispatch, ownProps, x) => {
  const componentStateKey = `${ownProps.type || "edit"}TextGroup`;

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
    toggleGroup: (contactId, textGroupId, event) => {
      dispatch({
        type: "TOGGLE_GROUP_CONTACT",
        textGroupId,
        contactId,
        componentStateKey
      });
    },
    togglePermanentChannel: (
      textGroupId,
      textGroupPermanence,
      formPermanence,
      event
    ) => {
      const setChannelPermanence =
        formPermanence === null ? !textGroupPermanence : null;

      dispatch({
        type: "SET_PERMANENT_CHANNEL",
        textGroupId,
        setChannelPermanence,
        componentStateKey
      });
    },
    setInput: debounce((field, groupId, text) => {
      dispatch({
        type: "CHANGE_FIELD",
        value: text,
        componentStateKey,
        field,
        itemId: groupId
      });
    }, 300),

    submitForm: (formProps, event) => {
      const {
        availableContacts,
        textGroup,
        setChannelPermanence: setPermanent
      } = formProps;
      const { name, id } = textGroup;

      const addedContactIds = availableContacts
        .filter(({ markedForAddition }) => markedForAddition)
        .map(({ id }) => id);
      const deletedContactIds = availableContacts
        .filter(({ markedForDeletion }) => markedForDeletion)
        .map(({ id }) => id);

      const attributes = {
        name,
        addedContactIds,
        deletedContactIds,
        setPermanent
      };
      const type = id == "new" ? "CREATE_TEXT_GROUP" : "UPDATE_TEXT_GROUP";
      dispatch({ type, attributes, id });
    }
  };
};

const mapStateToProps = ({ appData, app }, ownProps) => {
  const componentStateKey = `${ownProps.type || "edit"}TextGroup`;
  const { keyboardVisible } = app;
  const { [componentStateKey]: componentState } = app;
  const { overlayGroupId } = componentState;
  const { [overlayGroupId]: groupComponentState } = { ...componentState };
  const { inFocus, errors } = { errors: {}, ...groupComponentState };

  const dataWithUnpackedGroups = denormalizeModel(
    appData,
    "textGroups",
    "textGroupId",
    "textGroupPeople",
    "people",
    "personId"
  );
  const dataWithUnpackedChannels = denormalizeModel(
    dataWithUnpackedGroups,
    "textGroups",
    "textGroupId",
    "permanentChannelGroups",
    "channels",
    "threadId",
    "permanentChannels"
  );
  const { textGroups } = dataWithUnpackedChannels;
  // const textGroup = dataWithUnpackedChannels['textGroups'][ overlayGroupId ] || { people: {} }
  const existingTextGroup =
    dataWithUnpackedChannels["textGroups"][overlayGroupId] || {};

  const editedTextGroupData = ["name"].reduce((acc, key) => {
    const { [key]: variable } = { ...groupComponentState };
    const { [key]: existingVariable } = existingTextGroup;

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

  const textGroup = {
    id: "new",
    people: {},
    ...existingTextGroup,
    ...editedTextGroupData
  };
  const people = dataWithUnpackedChannels["people"];

  const { selectedContacts, setChannelPermanence } = {
    selectedContacts: [],
    setChannelPermanence: null,
    ...groupComponentState
  };
  const availableContacts = Object.values(people).map(contact => {
    const isMember = textGroup.people.hasOwnProperty(contact.id);
    const isSelected = selectedContacts.indexOf(contact.id.toString()) != -1;
    return Object.assign(
      {
        keptAsMember: isMember && !isSelected,
        markedForDeletion: isMember && isSelected,
        markedForAddition: !isMember && isSelected
      },
      contact
    );
  });

  const currentChannelPermanence =
    Object.keys(textGroup.permanentChannels || {}).length > 0;

  return {
    errors,
    inFocus,
    overlayGroupId,
    textGroup,
    availableContacts,
    currentChannelPermanence,
    setChannelPermanence
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupForm);

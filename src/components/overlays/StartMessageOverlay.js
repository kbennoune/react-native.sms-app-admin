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
  ScrollView
} from "react-native";

import { connect } from "react-redux";
import { Button, Icon } from "react-native-elements";
import { Input, ListItem, Divider } from "react-native-elements";
import styles from "../../styles/styles";
import { colors } from "../../styles/styles";

import MultiSelect from "react-native-multiple-select";

import FuzzySet from "fuzzyset.js";

import debounce from "lodash/debounce";

import SelectableRecipientSearch from "./SelectableRecipientSearch";
import FormInput from "../subcomponents/FormInput";
import { errorSentence } from "../../helpers/misc";

import MessageOverlay from "./MessageOverlay";

class StartMessageOverlay extends MessageOverlay<{}> {
  selectableTextGroups() {
    const {
      textGroups,
      searchString,
      groupNamesSet,
      selectedGroupIds
    } = this.props;

    const allSelectableGroups = Object.keys(textGroups).reduce((acc, id) => {
      if (selectedGroupIds.includes(id)) {
        acc.push(Object.assign({ selected: true }, textGroups[id]));
      } else {
        acc.push(Object.assign({}, textGroups[id]));
      }
      return acc;
    }, []);

    return allSelectableGroups.filter(
      this.searchSetForName(searchString, groupNamesSet)
    );
  }

  selectablePeople() {
    const {
      people,
      searchString,
      peopleNamesSet,
      selectedPeopleIds
    } = this.props;
    const allSelectablePeople = Object.keys(people).reduce((acc, id) => {
      if (selectedPeopleIds.includes(id)) {
        acc.push(Object.assign({ selected: true }, people[id]));
      } else {
        acc.push(Object.assign({}, people[id]));
      }
      return acc;
    }, []);

    return allSelectablePeople.filter(
      this.searchSetForName(searchString, peopleNamesSet)
    );
  }

  searchSetForName(searchString, searchSet) {
    if (!searchString) {
      return () => true;
    } else if (searchString.length < 3) {
      const regExp = new RegExp(searchString, "i");
      return ({ name }) => name.match(regExp);
    } else {
      const cutOff = searchString.length < 5 ? 0.15 : 0.33;
      const matches = searchSet.get(searchString, undefined, cutOff) || [];
      const matchingNames = matches.map(match => match[1]);
      return ({ name }) => matchingNames.includes(name);
    }
  }
  afterToField() {
    const {
      toggleRecipient,
      onMessageFocus,
      searching,
      keyboardVisible
    } = this.props;

    return (
      <SelectableRecipientSearch
        toggleRecipient={toggleRecipient}
        onMessageFocus={onMessageFocus}
        selectablePeople={this.selectablePeople()}
        selectableTextGroups={this.selectableTextGroups()}
        searching={searching}
        keyboardVisible={keyboardVisible}
      />
    );
  }

  renderMessageElement() {
    const {
      updateOutgoingMessage,
      outgoingMessage,
      errors,
      onMessageFocus
    } = this.props;

    return (
      <FormInput
        label="Message"
        labelStyle={{ display: "none" }}
        placeholder="Message"
        multiline
        onChangeText={updateOutgoingMessage}
        value={outgoingMessage}
        containerStyle={{
          paddingLeft: 22,
          marginRight: 0,
          paddingRight: 0,
          width: "100%"
        }}
        inputContainerStyle={{
          minHeight: 100,
          maxHeight: 240,
          paddingVertical: 4,
          paddingHorizontal: 5,
          borderRadius: 20,
          borderColor: colors.solitaire,
          borderWidth: 1,
          backgroundColor: colors.raffia
        }}
        inputStyle={{ paddingRight: 28, height: "100%" }}
        onFocus={onMessageFocus}
        errorMessages={errors.outgoingMessage}
        errorStyle={{ flexBasis: null }}
      />
    );
  }

  renderRecipientElement() {
    const {
      updateSearch,
      searchString,
      ifDeletingEmptyInput,
      focusSearch
    } = this.props;

    return (
      <View
        style={{
          flexDirection: "column",
          flexWrap: "wrap",
          flex: 1,
          alignItems: "stretch",
          alignContent: "flex-end",
          borderColor: colors.solitaire,
          backgroundColor: colors.raffia,
          borderWidth: 1
        }}
      >
        <ScrollView
          contentContainerStyle={{
            flexDirection: "row",
            flexWrap: "wrap",
            backgroundColor: colors.raffia
          }}
          horizontal={false}
          snapToAlignment={"end"}
          snapToInterval={20}
          decelerateRate="fast"
          ref={elt => (this.searchRecipients = elt)}
          onTouchEnd={evt => {
            this.focusOnSearchInput();
          }}
          keyboardShouldPersistTaps={"handled"}
        >
          {this.renderRecipientTags()}
          <Input
            multiline={false}
            onChangeText={updateSearch}
            value={searchString}
            onKeyPress={ifDeletingEmptyInput.bind(
              this,
              this,
              this.selectedRecipients().slice(-1)[0],
              this.props.deleteRecipient
            )}
            underlineColorAndroid="transparent"
            inputStyle={{
              marginLeft: 4,
              height: 24,
              backgroundColor: colors.raffia
            }}
            containerStyle={{
              margin: 0,
              minWidth: 60,
              flex: 1,
              padding: 0,
              height: 24,
              width: "130%",
              marginVertical: 4
            }}
            inputContainerStyle={{
              padding: 0,
              borderWidth: 0,
              borderBottomWidth: 0,
              flex: 1
            }}
            onFocus={focusSearch}
            ref={elt => (this.searchRecipientsInput = elt)}
          ></Input>
        </ScrollView>
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    updateOutgoingMessage: debounce(value => {
      const componentStateKey = "newMessage";
      const field = "outgoingMessage";
      const itemId = "new";

      dispatch({
        type: "CHANGE_FIELD",
        value,
        componentStateKey,
        field,
        itemId
      });
    }, 300),
    submitForm: (formProps, event) => {
      const {
        selectedGroupIds: groupIds,
        selectedPeopleIds: peopleIds,
        outgoingMessage
      } = formProps;
      const componentStateKey = "newMessage";
      const itemId = "new";
      dispatch({
        type: "CREATE_TEXT_MESSAGE_SUBMIT",
        groupIds,
        peopleIds,
        outgoingMessage,
        componentStateKey,
        itemId
      });
    },
    focusSearch: event => {
      dispatch({ type: "FOCUS_SEARCH" });
    },
    blurSearch: event => {
      dispatch({ type: "BLUR_SEARCH" });
    },
    onMessageFocus: event => {
      dispatch({ type: "CLOSE_SEARCH" });
    },
    toggleRecipient: (recipient, event) => {
      const componentStateKey = "newMessage";
      const itemId = "new";
      if (recipient.collectionType === "textGroups") {
        dispatch({
          ...recipient,
          type: "TOGGLE_MESSAGE_GROUP",
          componentStateKey,
          itemId
        });
      } else {
        dispatch({
          ...recipient,
          type: "TOGGLE_MESSAGE_PERSON",
          componentStateKey,
          itemId
        });
      }
    },
    ifDeletingEmptyInput: (elt, recipient, func, evt) => {
      if (
        (elt.props.searchString === "" ||
          elt.props.searchString === null ||
          elt.props.searchString === undefined) &&
        evt.nativeEvent.key === "Backspace"
      ) {
        if (recipient) {
          debounce(func.bind(this, recipient), 50)(evt);
        }
      }
    },
    deleteRecipient: (recipient, evt) => {
      if (recipient.collectionType === "textGroups") {
        dispatch({ recipient, type: "REMOVE_MESSAGE_GROUP" });
      } else {
        dispatch({ recipient, type: "REMOVE_MESSAGE_PERSON" });
      }
    },
    updateSearch: debounce(
      (search, event) => {
        dispatch({ search, type: "UPDATE_RECIPIENT_SEARCH" });
      },
      250,
      {}
    )
  };
};

const mapStateToProps = ({ app, appData }, ownProps) => {
  const { keyboardVisible } = app;
  const { new: messageObj, searchString, searching } = {
    new: {},
    ...app.newMessage
  };

  const { outgoingMessage, errors, selectedPeopleIds, selectedGroupIds } = {
    errors: {},
    selectedPeopleIds: [],
    selectedGroupIds: [],
    ...messageObj
  };
  const { people, textGroups } = appData;

  const peopleNames = Object.values(people).map(({ name }) => name);
  const groupNames = Object.values(textGroups).map(({ name }) => name);
  const peopleNamesSet =
    peopleNames === ownProps.peopleNames
      ? ownProps.peopleNamesSet
      : FuzzySet(peopleNames);
  const groupNamesSet =
    peopleNames === ownProps.groupNames
      ? ownProps.groupNamesSet
      : FuzzySet(groupNames);
  const buttonEnabled =
    outgoingMessage &&
    outgoingMessage.trim() &&
    ((selectedPeopleIds && selectedPeopleIds.length > 0) ||
      (selectedGroupIds && selectedGroupIds.length > 0));
  const buttonDisabled = !buttonEnabled;

  return {
    errors,
    buttonDisabled,
    outgoingMessage,
    searching,
    searchString,
    selectedPeopleIds,
    selectedGroupIds,
    textGroups,
    people,
    peopleNamesSet,
    groupNamesSet,
    peopleNames,
    groupNames,
    keyboardVisible
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StartMessageOverlay);

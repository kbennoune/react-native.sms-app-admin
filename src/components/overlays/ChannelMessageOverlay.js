"use strict";

import React, { Component } from "react";

import { Platform, StyleSheet, View, Text } from "react-native";

import { connect } from "react-redux";
import MessageOverlay from "./MessageOverlay";
import debounce from "lodash/debounce";
import buildMessageThreads from "../../helpers/buildMessageThreads";
import { toSentence } from "../../helpers/misc";
import styles from "../../styles/styles";
import { colors } from "../../styles/styles";
import FormInput from "../subcomponents/FormInput";

class ChannelMessageOverlay extends MessageOverlay<{}> {
  renderRecipientElement() {
    const { threadId, threadDescription } = this.props;
    return (
      <View
        style={{
          margin: 0,
          minWidth: 60,
          flex: 1,
          flexWrap: "wrap",
          flexDirection: "row",
          paddingVertical: 4,
          paddingHorizontal: 5,
          width: "130%",
          backgroundColor: colors.raffia,
          borderWidth: 1,
          borderColor: colors.solitaire
        }}
      >
        <Text
          style={{
            color: colors.bakers_chocolate,
            flex: 1,
            marginLeft: 4,
            lineHeight: 20,
            fontSize: 20
          }}
        >
          {threadDescription}
        </Text>
      </View>
    );
  }
  renderMessageElement() {
    const {
      updateOutgoingMessage,
      outgoingMessage,
      errors,
      onMessageFocus,
      threadId
    } = this.props;

    return (
      <FormInput
        label="Message"
        labelStyle={{ display: "none" }}
        placeholder="Message"
        multiline
        onChangeText={updateOutgoingMessage.bind(this, threadId)}
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
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    updateOutgoingMessage: debounce((threadId, value) => {
      const componentStateKey = "newResponse";
      const field = "outgoingMessage";
      const itemId = threadId;
      dispatch({
        type: "CHANGE_FIELD",
        value,
        componentStateKey,
        field,
        itemId
      });
    }, 300),
    submitForm: (formProps, event) => {
      const { outgoingMessage, threadId } = formProps;
      const componentStateKey = "newResponse";
      const itemId = threadId;
      dispatch({
        type: "CREATE_TEXT_MESSAGE_SUBMIT",
        threadId,
        outgoingMessage,
        componentStateKey,
        itemId
      });
    }
  };
};

const mapStateToProps = ({ app, appData }, ownProps) => {
  const {
    channels,
    messages,
    people: dataPeople,
    textGroups: dataTextGroups,
    textGroupPeople: dataTextGroupPeople
  } = appData;
  const { currentPerson } = app;

  const { overlayThreadId: threadId } = app.newResponse;
  const { [threadId]: messageObj } = { [threadId]: {}, ...app.newResponse };

  const { threads, activeThread: thread } = buildMessageThreads(
    channels,
    messages,
    dataPeople,
    dataTextGroups,
    dataTextGroupPeople,
    threadId,
    currentPerson
  );

  const { people: threadParticipants } = thread;

  const { outgoingMessage, errors } = { errors: {}, ...messageObj };
  const buttonEnabled = outgoingMessage && outgoingMessage.trim();
  const buttonDisabled = !buttonEnabled;

  const threadDescription = toSentence(threadParticipants, "name");

  return {
    errors,
    threadId,
    threadDescription,
    buttonDisabled,
    outgoingMessage
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChannelMessageOverlay);

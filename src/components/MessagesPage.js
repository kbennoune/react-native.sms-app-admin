"use strict";
import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableHighlight,
  NavigatorIOS
} from "react-native";

import { connect } from "react-redux";
import { Button, Icon, Overlay, Input } from "react-native-elements";

import TabContentHeader from "./TabContentHeader";

import { denormalizeModel } from "../helpers/data";

import styles from "../styles/styles";
import { colors } from "../styles/styles";

import Swipeable from "react-native-swipeable";

import ActiveMessageThread from "./ActiveMessageThread";

import { toTimeDisplay } from "../helpers/time";
import buildMessageThreads from "../helpers/buildMessageThreads";

class MessagesPage extends Component<{}> {
  toSentence(items, key) {
    return items.reduce((acc, item, idx, _items) => {
      const listedElt = key ? item[key] : item;
      const listed =
        listedElt == null
          ? ""
          : String(listedElt).replace(/^\w/, c => c.toUpperCase());

      if (idx == 0 || acc === "") {
        return listed;
      } else if (idx + 1 === _items.length) {
        return [acc, "&", listed].join(" ");
      } else {
        return [`${acc},`, listed].join(" ");
      }
    }, "");
  }

  participantList() {
    const { activeThread } = this.props;
    const { people: activeThreadPeople, topic: ActiveThreadTopic } = {
      people: [],
      ...activeThread
    };
    if (activeThread) {
      if (ActiveThreadTopic == "root") {
        return "Main Channel";
      } else if (activeThreadPeople && activeThreadPeople.length > 0) {
        const userList = this.toSentence(activeThreadPeople, "name");

        return `${userList} are in this converation.`;
      } else {
        return "There is no one in this conversation.";
      }
    } else {
      return "There is no one in this conversation.";
    }
  }

  channelDescriptionText(item) {
    if (item.topic == "root") {
      return "Main Channel";
    } else {
      return this.toSentence(item.displayNames);
    }
  }

  render() {
    const {
      activeThread,
      activeThreadId,
      respondToActiveChannel,
      threads,
      selectActiveThread,
      currentPersonId,
      activeThreadMessages
    } = this.props;

    return (
      <View
        style={{
          backgroundColor: "#FFFFFF",
          height: "100%",
          overflow: "hidden",
          flexDirection: "column"
        }}
      >
        <View
          style={{
            flexDirection: "row",
            flex: 0,
            width: "100%",
            height: "100%"
          }}
        >
          <FlatList
            data={threads}
            automaticallyAdjustContentInsets={false}
            style={{
              backgroundColor: colors.solitaire,
              overflow: "visible",
              height: "100%",
              flexBasis: 3,
              flexShrink: 0,
              flexGrow: 3,
              flexDirection: "column"
            }}
            ListHeaderComponent={() => {
              return <View style={styles.listBoundary}></View>;
            }}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            keyExtractor={(item, index) => `${item.id}`}
            renderItem={({ item }) => {
              const isActiveThread = activeThread.id == item.id;
              const backgroundColor = colors.solitaire;
              const textColor = isActiveThread
                ? colors.seal_brown
                : colors.metallic_copper;
              const secondaryTextColor = isActiveThread
                ? colors.seal_brown
                : colors.metallic_copper;
              const iconColor = isActiveThread ? textColor : "transparent";
              const infoIconColor = isActiveThread
                ? colors.thunderbird
                : colors.thunderbird;
              return (
                <TouchableHighlight
                  underlayColor={colors.solitaire}
                  onPress={selectActiveThread.bind(this, item.id)}
                >
                  <View
                    style={[
                      styles.listItemContent,
                      {
                        overflow: "visible",
                        backgroundColor: backgroundColor,
                        paddingLeft: 0
                      }
                    ]}
                  >
                    <View
                      style={{
                        flex: 6,
                        padding: 8,
                        paddingRight: 6,
                        paddingLeft: 14,
                        margin: 2,
                        paddingBottom: 0
                      }}
                    >
                      <Text
                        style={{
                          color: textColor,
                          fontSize: 14,
                          fontWeight: "bold",
                          paddingLeft: 0
                        }}
                      >
                        {this.channelDescriptionText(item)}
                      </Text>
                      {item.lastMessageTime && (
                        <Text
                          style={{
                            color: textColor,
                            fontSize: 12,
                            paddingLeft: 0
                          }}
                        >
                          {toTimeDisplay(item.lastMessageTime)}
                        </Text>
                      )}

                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "flex-start",
                          marginTop: 6,
                          width: "150%"
                        }}
                      >
                        {item.phoneNumber && (
                          <View
                            style={{ flex: 0, paddingLeft: 0, marginRight: 10 }}
                          >
                            <Icon
                              name="cellphone-wireless"
                              size={16}
                              type="material-community"
                              color="black"
                            />
                          </View>
                        )}
                        <View style={{ flex: 0, overflow: "visible" }}>
                          <Text
                            numberOfLines={1}
                            style={{
                              flex: 0,
                              overflow: "visible",
                              color: secondaryTextColor,
                              fontSize: 12
                            }}
                          >
                            {item.messages.length} Messages
                          </Text>
                        </View>
                      </View>
                      <View
                        style={{
                          height: 24,
                          flexDirection: "row",
                          justifyContent: "flex-start",
                          alignItems: "center"
                        }}
                      >
                        {item.topic === "root" && (
                          <Icon
                            name="robot"
                            type="material-community"
                            containerStyle={{ marginRight: 4 }}
                            iconStyle={{ color: infoIconColor }}
                            size={14}
                          />
                        )}
                        {item.topic !== "root" && item.isParticipant && (
                          <Icon
                            name="comment-account-outline"
                            type="material-community"
                            containerStyle={{ marginRight: 4 }}
                            iconStyle={{ color: infoIconColor }}
                            size={14}
                          />
                        )}
                        {item.topic !== "root" && item.isActive && (
                          <Icon
                            name="chat"
                            type="entypo"
                            containerStyle={{ marginRight: 4 }}
                            iconStyle={{ color: infoIconColor }}
                            size={14}
                          />
                        )}
                      </View>
                    </View>

                    <Icon
                      name="chevron-right"
                      type="entypo"
                      size={20}
                      color={iconColor}
                      containerStyle={{
                        top: 0,
                        right: 0,
                        height: "100%",
                        position: "absolute",
                        overflow: "visible",
                        flexDirection: "row",
                        alignItems: "center"
                      }}
                    />
                  </View>
                </TouchableHighlight>
              );
            }}
          />
          <View
            style={{
              flexDirection: "column",
              flexBasis: 5,
              flexShrink: 0,
              flexGrow: 5
            }}
          >
            <ActiveMessageThread
              currentPersonId={currentPersonId}
              activeThread={activeThread}
              respondToActiveChannel={respondToActiveChannel}
            />
          </View>
        </View>
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    selectActiveThread: (activeThreadId, event) => {
      dispatch({ type: "SET_ACTIVE_THREAD", activeThreadId });
    },
    respondToActiveChannel: (threadId, event) => {
      dispatch({ type: "RESPOND_TO_CHANNEL", threadId });
    }
  };
};

const mapStateToProps = ({ appData, app }) => {
  const {
    channels,
    messages,
    people: dataPeople,
    textGroups: dataTextGroups,
    textGroupPeople: dataTextGroupPeople
  } = appData;
  const { currentPerson, threadsTab } = app;
  const { id: currentPersonId } = { ...currentPerson };

  const { activeThreadId: activeThreadIdFromState } = threadsTab;
  const { threads, activeThread } = buildMessageThreads(
    channels,
    messages,
    dataPeople,
    dataTextGroups,
    dataTextGroupPeople,
    activeThreadIdFromState,
    currentPerson
  );

  const activeThreadMessages = activeThread ? activeThread.messages : [];

  const activeThreadId = activeThread
    ? activeThread.id
    : activeThreadIdFromState;

  return {
    threads,
    activeThreadId,
    activeThread,
    activeThreadMessages,
    currentPersonId
  };
};

const areStatesEqual = (next, prev) => {
  // A better way to handle this would be to deal
  // with this is to do some kind of shallow comparison.
  //
  // For now this will work though
  if (next.app.selectedTab !== "messages") {
    return true;
  } else {
    next === prev;
  }
};
export default connect(mapStateToProps, mapDispatchToProps, null, {
  areStatesEqual
})(MessagesPage);

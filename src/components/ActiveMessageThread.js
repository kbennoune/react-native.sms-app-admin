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

import { Icon } from "react-native-elements";

import styles, { colors } from "../styles/styles";

import { toTimeDisplay } from "../helpers/time";

class ActiveMessageThread extends Component<{}> {
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

  render() {
    const { activeThread } = this.props;
    const { respondToActiveChannel } = this.props;

    const { messages: activeThreadMessages, id: activeThreadId } = {
      messages: [],
      ...activeThread
    };
    return (
      <FlatList
        ref={ref => (this.flatList = ref)}
        inverted={true}
        style={{ paddingBottom: 0, flexGrow: 0 }}
        contentContainerStyle={{}}
        data={activeThreadMessages}
        ListHeaderComponent={
          <View style={{ marginTop: 20, paddingLeft: 2, width: "100%" }}>
            <View
              style={{
                paddingHorizontal: 6,
                paddingVertical: 6,
                paddingBottom: 8,
                alignSelf: "center",
                flexDirection: "row",
                flexWrap: "wrap"
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.off_black,
                    fontWeight: "bold"
                  }}
                >
                  {this.participantList()}
                </Text>
              </View>
              {activeThread &&
                activeThread.topic !== "root" &&
                activeThread.isParticipant &&
                activeThread.isActive && (
                  <Icon
                    name="reply"
                    type="entypo"
                    size={30}
                    color={colors.raffia}
                    containerStyle={{
                      padding: 2,
                      flex: 0,
                      backgroundColor: colors.caput_mortuum,
                      borderRadius: 5,
                      alignSelf: "flex-end"
                    }}
                    onPress={respondToActiveChannel.bind(this, activeThreadId)}
                  />
                )}
            </View>
          </View>
        }
        renderItem={({ item }) => {
          const textMessageTextStyles = [styles.textMessageText];
          const textMessageTailStyles = [styles.textMessageTail];
          const textMessageParagraphStyles = [styles.textMessageParagraph];
          const textMessageBubbleStyles = [styles.textMessageBubble];
          const textMessageHeadingStyles = [styles.textMessageHeading];

          if (item.senderId == this.props.currentPersonId) {
            textMessageTextStyles.push(styles.textMessageTextCurrentPerson);
            textMessageTailStyles.unshift(styles.textMessageTextCurrentPerson);
            textMessageTailStyles.push(styles.rightTextMessageTail);
            textMessageParagraphStyles.unshift(
              styles.textMessageParagraphCurrentPerson
            );
            textMessageBubbleStyles.push(styles.rightTextMessageBubble);
            textMessageHeadingStyles.push(styles.rightTextMessageHeading);
          } else if (item.senderId) {
            textMessageTextStyles.push(styles.textMessageTextPerson);
            textMessageTailStyles.unshift(styles.textMessageTextPerson);
            textMessageTailStyles.push(styles.leftTextMessageTail);
            textMessageParagraphStyles.unshift(
              styles.textMessageParagraphPerson
            );
            textMessageBubbleStyles.push(styles.leftTextMessageBubble);
            textMessageHeadingStyles.push(styles.leftTextMessageHeading);
          } else {
            textMessageTextStyles.push(styles.textMessageTextSystem);
            textMessageTailStyles.unshift(styles.textMessageTextSystem);
            textMessageTailStyles.push(styles.leftTextMessageTail);
            textMessageParagraphStyles.unshift(
              styles.textMessageParagraphSystem
            );
            textMessageBubbleStyles.push(styles.leftTextMessageBubble);
            textMessageHeadingStyles.push(styles.leftTextMessageHeading);
          }
          return (
            <View underlayColor="#000" style={[styles.textMessageReceive]}>
              <View style={textMessageBubbleStyles}>
                <View style={textMessageTailStyles}></View>
                <View style={textMessageTextStyles}>
                  <Text style={textMessageParagraphStyles}>
                    {item.messageText}
                  </Text>
                </View>
                <View style={textMessageTailStyles}></View>
                <View style={textMessageHeadingStyles}>
                  <View
                    style={{
                      flexDirection: "row",
                      flexDirection:
                        item.senderId == this.props.currentPersonId
                          ? "row-reverse"
                          : "row"
                    }}
                  >
                    <Text style={styles.textMessageHeadingName}>
                      {item.fromPerson.name}
                    </Text>
                  </View>
                  <Text style={styles.textMessageHeadingTime}>
                    {toTimeDisplay(item.messageTime)}
                  </Text>
                </View>
              </View>
            </View>
          );
        }}
        keyExtractor={({ id }) => `${id}`}
        contentContainerStyle={[styles.ActiveMessageThreadContainer]}
      />
    );
  }
}

export default ActiveMessageThread;

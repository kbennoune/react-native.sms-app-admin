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
  Easing,
  Keyboard
} from "react-native";

import styles, { colors } from "../../styles/styles";
import { connect } from "react-redux";
import { Button, Icon } from "react-native-elements";

class SelectableRecipientSearch extends Component<{}> {
  selectableListItem(onPress, { item }) {
    const { [item.collectionType]: section } = {
      textGroups: {
        title: "Groups",
        icon: { name: "ios-people", type: "ionicon" },
        textColor: "#FFF",
        backgroundColor: colors.sea_green,
        data: this.props.selectableTextGroups
      },
      people: {
        title: "People",
        icon: { name: "ios-person", type: "ionicon" },
        textColor: "#FFF",
        backgroundColor: colors.rouge,
        data: this.props.selectablePeople
      }
    };

    return (
      <TouchableHighlight
        underlayColor={item.selected ? "red" : "green"}
        onPress={onPress.bind(this, item)}
        style={styles.selectRecipientsItem}
      >
        <View style={{ flexDirection: "row" }}>
          <Icon
            iconStyle={{
              paddingLeft: 2,
              aspectRatio: 1,
              flex: 0,
              justifyContent: "center"
            }}
            containerStyle={{
              borderRadius: 20,
              padding: 2,
              marginLeft: 8,
              backgroundColor: section.backgroundColor
            }}
            size={16}
            color={section.textColor}
            name={section.icon.name}
            type={section.icon.type}
          />
          <Text style={{ marginLeft: 8, flex: 5 }}>{item.name}</Text>
          <Icon
            containerStyle={{
              flex: 0,
              display: item.selected ? "flex" : "none"
            }}
            iconStyle={{ color: "green" }}
            size={12}
            name="check-circle"
            type="font-awesome"
          />
        </View>
      </TouchableHighlight>
    );
  }

  recipientListSections() {
    return [
      {
        title: "Groups",
        icon: { name: "ios-people", type: "ionicon" },
        textColor: "#FFF",
        backgroundColor: colors.sea_green,
        data: this.props.selectableTextGroups
      },
      {
        title: "People",
        icon: { name: "ios-person", type: "ionicon" },
        textColor: "#FFF",
        backgroundColor: colors.rouge,
        data: this.props.selectablePeople
      }
    ];
  }

  render() {
    return (
      <View
        style={[
          {
            paddingHorizontal: 8,
            paddingBottom: 60,
            display: this.props.searching ? "flex" : "none",
            backgroundColor: "#FFF",
            flexDirection: "row",
            flex: 1
          }
        ]}
      >
        {this.props.keyboardVisible ? (
          <View style={{ width: 23 }} />
        ) : (
          <Icon
            containerStyle={{
              marginTop: 0,
              aspectRatio: 1,
              width: 23,
              backgroundColor: colors.solitaire,
              borderWidth: 1,
              borderColor: colors.solitaire
            }}
            name="ios-close"
            type="ionicon"
            size={28}
            iconStyle={{ lineHeight: 26 }}
            underlayColor={colors.maroon}
            color={colors.maroon}
            onPress={this.props.closeSearch}
          />
        )}
        <SectionList
          keyboardShouldPersistTaps="always"
          keyExtractor={(item, idx) => item.id.toString()}
          renderItem={this.selectableListItem.bind(
            this,
            this.props.toggleRecipient
          )}
          ItemSeparatorComponent={this.listItemSeparator}
          sections={this.recipientListSections()}
          style={{ flex: 1, borderWidth: 1, borderColor: colors.solitaire }}
          onScrollBeginDrag={() => {
            Keyboard.dismiss();
          }}
        />
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {};
};

const mapStateToProps = ({ app, appData }, ownProps) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectableRecipientSearch);

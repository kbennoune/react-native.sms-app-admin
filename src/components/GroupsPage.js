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

import ListedItem from "./subcomponents/ListedItem";

import styles from "../styles/styles";
import { colors } from "../styles/styles";
import Swipeable from "react-native-swipeable";

class GroupsPage extends Component<{}> {
  itemCard({ item }) {
    const deletingItem = item.id === this.props.deletingGroupId;

    const deleteAction = deletingItem ? "confirm" : "initial";
    const deleteGroup = this.props.deleteGroup.bind(this, item, deleteAction);
    const editGroup = this.props.editGroup.bind(this, item);
    const deleteWarning =
      "Click again if you really want to delete this Group.";
    const cancelDelete = this.props.cancelDelete;

    return (
      <ListedItem
        deletingItem={deletingItem}
        deleteWarning={deleteWarning}
        cancelDelete={cancelDelete}
        deleteItem={deleteGroup}
        editItem={editGroup}
      >
        <View style={{ flex: 0, flexDirection: "row" }}>
          <Text style={{ color: colors.off_black, fontSize: 20 }}>
            {item.name}
          </Text>
          {Object.keys(item.permanentChannels || {}).length > 0 && (
            <View
              style={{ flex: 0, paddingLeft: 10, justifyContent: "center" }}
            >
              <Icon
                name="cellphone-wireless"
                size={16}
                type="material-community"
                color="black"
              />
            </View>
          )}
        </View>
        <Text style={{ color: colors.off_black }}>
          {Object.keys(item.people).length} People
        </Text>
      </ListedItem>
    );
  }
  addGroupCard() {
    return (
      <TouchableHighlight
        style={[
          {
            borderRadius: 5,
            shadowColor: "rgba(0,0,0, .2)",
            shadowOffset: { height: 0, width: 0 },
            shadowOpacity: 1,
            shadowRadius: 1,
            margin: 15,
            marginTop: 10,
            marginBottom: 0
          },
          styles.listedCardHeaderCtn
        ]}
        underlayColor="rgba(14,33,45, 0.2)"
        onPress={this.props.addGroup}
      >
        <View style={[{ padding: 5 }, styles.listedCardHeaderWrp]}>
          <Icon
            name="group-add"
            size={20}
            color={colors.off_black}
            containerStyle={{ marginRight: 10 }}
          />
          <Text style={{ fontSize: 16, color: colors.off_black }}>Add</Text>
        </View>
      </TouchableHighlight>
    );
  }
  render() {
    return (
      <View style={{ backgroundColor: "#FFFFFF" }}>
        <FlatList
          style={{ height: "100%" }}
          ListFooterComponent={this.addGroupCard.bind(this)}
          ListHeaderComponent={this.addGroupCard.bind(this)}
          keyExtractor={(item, index) => `${item.id}`}
          data={Object.values(this.props.textGroups)}
          renderItem={this.itemCard.bind(this)}
        />
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    addGroup: event => {
      dispatch({ type: "ADD_GROUP" });
    },
    editGroup: (group, event) => {
      dispatch({ type: "EDIT_GROUP", groupId: group.id });
    },
    deleteGroup: (group, event) => {
      dispatch({ type: "DELETE_GROUP", groupId: group.id });
    },
    deleteGroup: (group, type, event) => {
      if (type == "confirm") {
        dispatch({ type: "DELETE_GROUP", groupId: group.id });
      } else {
        dispatch({ type: "START_DELETE_GROUP", groupId: group.id });
      }
    },
    cancelDelete: (group, event) => {
      dispatch({ type: "CANCEL_DELETE_GROUP" });
    }
  };
};

// Halfway done with making it useful for any models
const mapStateToProps = ({ appData, app }) => {
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

  const { deletingGroupId } = { deletingGroupId: null, ...app.groupsPage };
  return {
    textGroups: dataWithUnpackedChannels["textGroups"],
    deletingGroupId
  };
};

const areStatesEqual = (next, prev) => {
  // A better way to handle this would be to deal
  // with this is to do some kind of shallow comparison.
  //
  // For now this will work though
  if (next.app.selectedTab !== "groups") {
    return true;
  } else {
    next === prev;
  }
};
export default connect(mapStateToProps, mapDispatchToProps, null, {
  areStatesEqual
})(GroupsPage);

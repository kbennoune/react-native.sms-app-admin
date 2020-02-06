"use strict";
import React, { Component } from "react";
import {
  Platform,
  Text,
  View,
  FlatList,
  TouchableHighlight,
  Dimensions,
  TextInput,
  Modal,
  ActivityIndicator,
  NavigatorIOS
} from "react-native";

import { Button, Icon, Overlay, Input, Card } from "react-native-elements";

import { connect } from "react-redux";
import Swipeable from "react-native-swipeable";

import TabContentHeader from "./TabContentHeader";

import ListedItem from "./subcomponents/ListedItem";

import { denormalizeModel } from "../helpers/data";
import styles from "../styles/styles";
import { colors } from "../styles/styles";

class ContactsPage extends Component<{}> {
  contactItemButtons(item) {
    return (
      <Button
        key={`call-contact-${item.id}`}
        containerStyle={{ marginLeft: 0, flex: 0 }}
        buttonStyle={{
          backgroundColor: "#38D954",
          width: 40,
          height: 40,
          borderRadius: 4
        }}
        titleStyle={{ flex: 1, position: "absolute", fontSize: 1 }}
        icon={
          <Icon
            name="phone"
            type="entypo"
            size={28}
            color="white"
            iconStyle={{ transform: [{ rotate: "90deg" }] }}
          />
        }
        title=""
        onPress={this.props.callContact.bind(this, item)}
      />
    );
  }
  itemCard({ item }) {
    const deletingItem = item.id === this.props.deletingContactId;
    const deleteAction = deletingItem ? "confirm" : "initial";
    const deleteContact = this.props.deleteContact.bind(
      this,
      item,
      deleteAction
    );
    const editContact = this.props.editContact.bind(this, item);
    const deleteWarning =
      "Click again if you really want to delete this Contact.";
    const cancelDelete = this.props.cancelDelete;

    return (
      <ListedItem
        additionalButtons={
          !item.currentPerson && [this.contactItemButtons(item)]
        }
        deletingItem={deletingItem}
        deleteWarning={deleteWarning}
        cancelDelete={cancelDelete}
        deleteItem={!item.currentPerson && deleteContact}
        editItem={editContact}
      >
        <Text style={{ color: colors.off_black, fontSize: 20 }}>
          {item.name}
        </Text>
        <Text style={{ color: colors.off_black }}>
          {Object.keys(item.textGroups).length} Groups
        </Text>
      </ListedItem>
    );
  }
  addContactCard() {
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
        onPress={this.props.addContact}
      >
        <View style={[{ padding: 5 }, styles.listedCardHeaderWrp]}>
          <Icon
            name="person-add"
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
          ListFooterComponent={this.addContactCard.bind(this)}
          ListHeaderComponent={this.addContactCard.bind(this)}
          keyExtractor={(item, index) => `${item.id}`}
          data={Object.values(this.props.people).sort(
            (
              { currentPerson: cp1, id: id1 },
              { currentPerson: cp2, id: id2 }
            ) => [cp1, id1] < [cp2, id2]
          )}
          renderItem={this.itemCard.bind(this)}
        />
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    callContact: (contact, event) => {
      const { mobile, name: contactName } = contact;

      dispatch({ type: "CALL_CONTACT", mobile, contactName });
    },
    addContact: event => {
      dispatch({ type: "ADD_CONTACT" });
    },
    editContact: (contact, event) => {
      dispatch({ type: "EDIT_CONTACT", contactId: contact.id });
    },
    deleteContact: (contact, type, event) => {
      if (type == "confirm") {
        dispatch({ type: "DELETE_CONTACT", contactId: contact.id });
      } else {
        dispatch({ type: "START_DELETE_CONTACT", contactId: contact.id });
      }
    },
    cancelDelete: (contact, event) => {
      dispatch({ type: "CANCEL_DELETE_CONTACT" });
    }
  };
};

const mapStateToProps = ({ app, appData }) => {
  const unpackedPeopleData = denormalizeModel(
    appData,
    "people",
    "personId",
    "textGroupPeople",
    "textGroups",
    "textGroupId"
  );
  const { people: unpackedPeople } = unpackedPeopleData;
  const { deletingContactId } = {
    deletingContactId: null,
    ...app.contactsPage
  };
  const { id: currentPersonId } = { ...app.currentPerson };
  const people = unpackedPeople[currentPersonId]
    ? {
        ...unpackedPeople,
        [currentPersonId]: {
          ...unpackedPeople[currentPersonId],
          currentPerson: true
        }
      }
    : unpackedPeople;

  return { people, deletingContactId };
};

const areStatesEqual = (next, prev) => {
  // A better way to handle this would be to deal
  // with this is to do some kind of shallow comparison.
  //
  // For now this will work though
  if (next.app.selectedTab !== "contacts") {
    return true;
  } else {
    next === prev;
  }
};
export default connect(mapStateToProps, mapDispatchToProps, null, {
  areStatesEqual
})(ContactsPage);

"use strict";
import React, { Component } from "react";
import { Platform, Text, View, TouchableHighlight } from "react-native";

import { Button, Icon, Card } from "react-native-elements";

import styles from "../../styles/styles";
import { colors } from "../../styles/styles";

export default class ListedItem extends Component<{}> {
  confirmDelete() {
    const { deleteWarning, cancelDelete } = this.props;

    return (
      <View
        style={{
          zIndex: 10,
          left: -10,
          bottom: 70,
          alignSelf: "center",
          position: "absolute",
          alignItems: "center",
          flexDirection: "row",
          width: 200,
          shadowOffset: { width: 0, height: 1 },
          shadowRadius: 2,
          shadowOpacity: 0.8,
          shadowColor: colors.medium_carmine
        }}
      >
        <View
          style={[
            {
              borderTopColor: colors.carmine,
              position: "absolute",
              bottom: -26,
              left: 18
            },
            styles.downwardTriangle
          ]}
        ></View>
        <View
          style={{
            padding: 10,
            backgroundColor: colors.carmine,
            borderRadius: 10
          }}
        >
          <Text style={{ flex: 0, color: "#FFFFFF" }}>{deleteWarning}</Text>
          <TouchableHighlight
            onPress={cancelDelete}
            style={{ alignSelf: "flex-end" }}
          >
            <Text
              style={{
                color: colors.tahiti_gold,
                textDecorationLine: "underline"
              }}
            >
              Cancel
            </Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
  render() {
    const { children, deleteItem, editItem, deletingItem } = this.props;

    return (
      <Card
        containerStyle={styles.listedCardCtn}
        wrapperStyle={[styles.listedCardWrp]}
      >
        {deletingItem && this.confirmDelete()}
        {deleteItem && (
          <Button
            containerStyle={{
              zIndex: 10,
              left: 0,
              alignSelf: "center",
              position: "absolute",
              alignItems: "center",
              flexDirection: "row",
              height: "100%",
              flex: 0
            }}
            buttonStyle={{
              backgroundColor: this.props.deletingItem
                ? colors.old_rose
                : "transparent",
              borderWidth: 1,
              borderColor: colors.old_rose,
              width: 34,
              height: 34,
              borderRadius: 18
            }}
            titleStyle={{ flex: 1, fontSize: 1 }}
            icon={
              <Icon
                name="remove"
                type="font-awesome"
                size={18}
                color={
                  this.props.deletingItem ? colors.raffia : colors.old_rose
                }
              />
            }
            title=""
            onPress={deleteItem}
          />
        )}
        <View style={{ flex: 3, paddingLeft: 40, marginRight: 4 }}>
          {children}
        </View>
        <View style={{ flex: 0, flexDirection: "row", marginRight: 0 }}>
          {this.props.additionalButtons}
          <Button
            containerStyle={{ marginLeft: 6, flex: 0 }}
            buttonStyle={{
              backgroundColor: colors.bakers_chocolate,
              width: 40,
              height: 40,
              borderRadius: 4
            }}
            titleStyle={{ flex: 1, position: "absolute", fontSize: 1 }}
            icon={
              <Icon
                name="edit"
                type="entypo"
                size={22}
                color="white"
                iconStyle={{ transform: [{ rotate: "270deg" }] }}
              />
            }
            title=""
            onPress={editItem}
          />
        </View>
      </Card>
    );
  }
}

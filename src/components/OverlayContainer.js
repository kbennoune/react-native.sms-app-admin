"use strict";
import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SectionList
} from "react-native";

import { connect } from "react-redux";
import { Button, Icon, Overlay } from "react-native-elements";
import { Input, ListItem } from "react-native-elements";

import styles from "../styles/styles";
import { colors } from "../styles/styles";

import ChannelMessageOverlay from "./overlays/ChannelMessageOverlay";
import StartMessageOverlay from "./overlays/StartMessageOverlay";
import ContactForm from "./forms/ContactForm";
import GroupForm from "./forms/GroupForm";

class OverlayContainer extends Component<{}> {
  closeButton() {
    return (
      <Icon
        containerStyle={{
          borderColor: colors.maroon,
          borderWidth: 1,
          borderRadius: 15,
          height: 30,
          width: 30,
          zIndex: 100,
          top: 4,
          left: 4,
          position: "absolute"
        }}
        name="ios-close"
        type="ionicon"
        size={28}
        underlayColor={colors.maroon}
        color={colors.maroon}
        onPress={this.props.hideOverlay}
      />
    );
  }
  render() {
    const CloseButton = this.closeButton.bind(this);
    // Need to clone the children and set the isVisible prop
    //https://mxstbr.blog/2017/02/react-children-deepdive/
    return (
      <View style={{ zIndex: 50, position: "absolute", flex: 1 }}>
        <Overlay
          isVisible={"start_message" === this.props.activeOverlay}
          onBackdropPress={this.props.hideOverlay}
          containerStyle={{
            flexDirection: "column",
            justifyContent: "flex-start"
          }}
          fullScreen={true}
          overlayStyle={styles.overlayContent}
        >
          <CloseButton />
          <StartMessageOverlay />
        </Overlay>
        <Overlay
          isVisible={"channel_message" === this.props.activeOverlay}
          onBackdropPress={this.props.hideOverlay}
          containerStyle={{
            flexDirection: "column",
            justifyContent: "flex-start"
          }}
          fullScreen={true}
          overlayStyle={styles.overlayContent}
        >
          <CloseButton />
          <ChannelMessageOverlay />
        </Overlay>
        <Overlay
          isVisible={"add_contact" === this.props.activeOverlay}
          onBackdropPress={this.props.hideOverlay}
          containerStyle={{
            flexDirection: "column",
            justifyContent: "flex-start"
          }}
          fullScreen={true}
          overlayStyle={styles.overlayContent}
        >
          <CloseButton />
          <ContactForm type="add" />
        </Overlay>
        <Overlay
          isVisible={"edit_contact" === this.props.activeOverlay}
          onBackdropPress={this.props.hideOverlay}
          containerStyle={{
            flexDirection: "column",
            justifyContent: "flex-start"
          }}
          fullScreen={true}
          overlayStyle={styles.overlayContent}
        >
          <CloseButton />
          <ContactForm type="edit" />
        </Overlay>
        <Overlay
          isVisible={"add_group" === this.props.activeOverlay}
          onBackdropPress={this.props.hideOverlay}
          containerStyle={{
            flexDirection: "column",
            justifyContent: "flex-start"
          }}
          fullScreen={true}
          overlayStyle={styles.overlayContent}
        >
          <CloseButton />
          <GroupForm type="add" />
        </Overlay>
        <Overlay
          isVisible={"edit_group" === this.props.activeOverlay}
          onBackdropPress={this.props.hideOverlay}
          containerStyle={{
            flexDirection: "column",
            justifyContent: "flex-start"
          }}
          fullScreen={true}
          overlayStyle={styles.overlayContent}
        >
          <CloseButton />
          <GroupForm type="edit" />
        </Overlay>
        {React.Children.map(this.props.children, (child, i) => {
          const isVisible =
            child.props.overlayName === this.props.activeOverlay;
          return React.cloneElement(child, {
            isVisible: isVisible,
            onBackdropPress: this.props.hideOverlay
          });
        })}
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    hideOverlay: event => {
      dispatch({ type: "HIDE_OVERLAY" });
    }
  };
};

const mapStateToProps = ({ appData, app }) => {
  return {
    activeOverlay: app.activeOverlay,
    overlayGroupId: app.overlayGroupId,
    overlayContactId: app.overlayContactId
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OverlayContainer);

import React, { Component } from "react";

import { connect } from "react-redux";

import { Platform, StyleSheet, Text, View } from "react-native";

import { Icon } from "react-native-elements";

import { TabView, TabBar } from "react-native-tab-view";

import ContactsPage from "./ContactsPage";
import GroupsPage from "./GroupsPage";
import MessagesPage from "./MessagesPage";
import SettingsPage from "./SettingsPage";
import LoginPage from "./LoginPage";

import OverlayContainer from "./OverlayContainer";
import MessageStarter from "./MessageStarter";

import AppHeader from "./subcomponents/AppHeader";
import styles from "../styles/styles";
import { colors } from "../styles/styles";

// https://www.phoca.cz/color/62aa36
// http://phoca.cz/color/aa7e36

class MainContent extends Component<{}> {
  componentDidMount() {
    this.props.loadAppData();
  }

  render() {
    const { selectedTab, screenDimensions } = this.props;
    const narrowScreen = screenDimensions.width < 400;
    const shortScreen = screenDimensions.height < 600;

    const routes = [
      {
        key: "messages",
        title: "Messages",
        icon: (
          <Icon
            name="ios-chatboxes"
            size={24}
            type="ionicon"
            color={colors.frangipani}
          />
        )
      },
      {
        key: "contacts",
        title: "Contacts",
        icon: (
          <Icon
            name="ios-contact"
            size={24}
            type="ionicon"
            color={colors.frangipani}
          />
        )
      },
      {
        key: "groups",
        title: "Groups",
        icon: (
          <Icon
            name="ios-contacts"
            size={24}
            type="ionicon"
            color={colors.frangipani}
          />
        )
      },
      {
        key: "settings",
        title: "Settings",
        icon: (
          <Icon
            name="ios-settings"
            size={24}
            type="ionicon"
            color={colors.frangipani}
          />
        )
      }
    ].map(route => {
      if (narrowScreen || shortScreen) {
        return { ...route, title: null };
      } else {
        return route;
      }
    });

    const index = routes.findIndex(route => route.key == selectedTab);
    const navigationState = { index, routes };

    const scenes = {
      messages: <MessagesPage />,
      contacts: <ContactsPage />,
      groups: <GroupsPage />,
      settings: <SettingsPage />
    };

    const _renderScene = ({ route }) => {
      return scenes[route.key];
    };

    return (
      <View style={{ flex: 1, flexDirection: "column" }}>
        <AppHeader showLogo={false}>
          <View
            style={{
              overflow: "visible",
              flexBasis: 80,
              flex: 0,
              flexGrow: 1,
              paddingHorizontal: 6,
              shadowOffset: { width: 1, height: 1 },
              shadowRadius: 1,
              shadowOpacity: 0.4,
              shadowColor: colors.carmine,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text
              numberOfLines={2}
              style={{
                flex: 0,
                textAlign: "left",
                color: colors.malibu,
                fontWeight: "bold",
                fontSize: 18,
                overflow: "hidden",
                flexWrap: "wrap",
                shadowOffset: { width: 0, height: 0 },
                shadowRadius: 1,
                shadowOpacity: 1,
                shadowColor: colors.caput_mortuum
              }}
            >
              {this.props.businessName}
            </Text>
          </View>
          <MessageStarter />
        </AppHeader>

        <TabView
          useNativeDriver
          navigationState={navigationState}
          renderScene={_renderScene}
          swipeEnabled={false}
          onIndexChange={this.props.onItemPress.bind(this, routes)}
          renderTabBar={props => (
            <TabBar
              {...props}
              renderIcon={({ route: { icon } }) => icon}
              tabStyle={{ padding: 4 }}
              labelStyle={{
                fontSize: 12,
                color: colors.cape_honey,
                marginHorizontal: 5,
                marginTop: 0
              }}
              style={{
                borderTopWidth: 1,
                borderColor: colors.thunderbird,
                flex: 0,
                backgroundColor: colors.carmine,
                shadowOffset: { width: 0, height: 2 },
                shadowRadius: 4,
                shadowOpacity: 0.8,
                shadowColor: colors.medium_carmine
              }}
              indicatorStyle={{ backgroundColor: colors.cape_honey, height: 2 }}
            />
          )}
        />
        <OverlayContainer />
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    loadAppData: () => {
      dispatch({ type: "LOAD_INITIAL_DATA" });
    },

    onItemPress: (routes, index) => {
      const { key: tab } = routes[index];
      let type;

      if (tab == "messages") {
        type = "SET_TAB_TO_THREADS";
      } else {
        type = "SET_TAB";
      }

      dispatch({ type, tab });
    }
  };
};

const displayName = baseName => {
  const shortenName = rawName => {
    const maxLength = 20;

    if (!rawName) {
      return "";
    } else if (rawName.length <= maxLength) {
      return rawName;
    } else if (rawName.split(/\s+/).length > 1) {
      return shortenName(
        rawName
          .split(/\s+/)
          .slice(0, -1)
          .join(" ")
      );
    } else {
      return displayName.slice(maxLength);
    }
  };

  const shortenedName = shortenName(baseName);
  if (!shortenedName) {
    return "...";
  } else if (shortenedName !== baseName) {
    return `${shortenedName}…`;
  } else {
    return shortenedName;
  }
};

const mapStateToProps = ({ dimensions: { screen }, app, appData }) => {
  const { width, height } = screen;
  const screenDimensions = { width, height };
  const { selectedTab, businessId } = app;
  const { name: rawBusinessName } = { ...appData.businesses[businessId] };
  const businessName = displayName(rawBusinessName); //'USA California Beef Noodle Kings Restaurant' )
  return { screenDimensions, selectedTab, businessName };
};

export default connect(mapStateToProps, mapDispatchToProps)(MainContent);

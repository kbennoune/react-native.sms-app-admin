"use strict";

import React, { Component } from "react";
import {
  Platform,
  SafeAreaView,
  StatusBar,
  View,
  Text,
  Dimensions
} from "react-native";

import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { logger } from "redux-logger";

import { connect } from "react-redux";

import Application from "./Application";
import { setInitialState } from "../reducers";

import reducers from "../reducers";

import dataService from "../middleware/dataService";
import formValidations from "../middleware/formValidations";
import deviceActions from "../middleware/deviceActions";

const instructions = Platform.select({
  ios: "Press Cmd+R to reload,\n" + "Cmd+D or shake for dev menu",
  android:
    "Double tap R on your keyboard to reload,\n" +
    "Shake or press menu button for dev menu"
});

import styles from "../styles/styles";
import { colors } from "../styles/styles";

// import WhyDidYouUpdate from 'why-did-you-update'
// WhyDidYouUpdate(React, { include: /^./, exclude: /^YellowBox|^TouchableText|^Safe/ })

type Props = {};

export default class App extends Component<{}> {
  constructor(props) {
    super();
    const window = Dimensions.get("window");
    const screen = Dimensions.get("screen");
    const dimensions = { window, screen };
    const initialState = { ...setInitialState({ dimensions }) };

    this.store = createStore(
      reducers,
      initialState,
      applyMiddleware(dataService, formValidations, deviceActions)
    );
  }

  render() {
    return (
      <Provider store={this.store}>
        <SafeAreaView
          style={{
            flexDirection: "column",
            flex: 1,
            backgroundColor: colors.caput_mortuum,
            justifyContent: "flex-start"
          }}
        >
          <StatusBar translucent barStyle="light-content" />

          <Application />
        </SafeAreaView>
      </Provider>
    );
  }
}

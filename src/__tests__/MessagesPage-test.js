// __tests__/Intro-test.js
import React from "react";
import MessagesPage from "../components/MessagesPage";
import renderer from "react-test-renderer";
import { Provider } from "react-redux";
import { createStore } from "redux";

const emptyMessageState = {
  app: { currentPerson: { id: "1" }, threadsTab: {} },
  appData: {
    channels: {},
    messages: { "333": {} }
  }
};

const singleMessageState = {
  app: { currentPerson: { id: "1" }, threadsTab: {} },
  appData: {
    channels: {
      "1234": {
        id: "1234",
        topic: "chat",
        textGroupIds: [],
        personIds: ["444"]
      }
    },
    messages: { "333": { id: "333", messageTime: new Date() } },
    people: { "444": { id: "444", name: "A name" } }
  }
};

const unitReducer = (state, action) => state;
const wrap = (elt, reducer, state) => {
  const store = createStore(reducer, state);
  return <Provider store={store}>{elt}</Provider>;
};

test("renders blank messages correctly", () => {
  const tree = renderer
    .create(wrap(<MessagesPage />, unitReducer, emptyMessageState))
    .toJSON();

  expect(tree).toMatchSnapshot();
});

test("renders a channel with a message correctly", () => {
  const tree = renderer
    .create(wrap(<MessagesPage />, unitReducer, singleMessageState))
    .toJSON();

  expect(tree).toMatchSnapshot();
});

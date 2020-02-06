"use strict";
import {
  login,
  sendLoginCode,
  createContact,
  updateContact,
  deleteContact,
  createTextGroup,
  updateTextGroup,
  deleteTextGroup,
  fetchPeopleAndGroups,
  fetchChannels,
  fetchAccountInfo,
  createMessage
} from "../api/actions";
import Contacts from "react-native-contacts";

import { AsyncStorage } from "react-native";

const dataService = store => next => action => {
  switch (action.type) {
    case "REQUEST_CODE": {
      sendLoginCode(store, next, action);

      break;
    }
    case "CREATE_TEXT_MESSAGE": {
      createMessage(store, next, action);

      break;
    }
    case "CREATE_CONTACT": {
      createContact(store, next, action);
      break;
    }
    case "UPDATE_CONTACT": {
      updateContact(store, next, action);
      break;
    }
    case "CREATE_TEXT_GROUP": {
      createTextGroup(store, next, action);
      break;
    }
    case "UPDATE_TEXT_GROUP": {
      updateTextGroup(store, next, action);
      break;
    }
    case "LOGIN":
      login(store, next, action);
      break;
    case "LOGOUT":
      next(action);

      store.dispatch({ type: "LOGGED_OUT" });
      break;
    case "DELETE_CONTACT":
      deleteContact(store, next, action);

      break;
    case "DELETE_GROUP":
      deleteTextGroup(store, next, action);
      break;
    case "TOGGLE_DEVICE_CONTACT_SEARCH":
      next(action);

      if (action.toSearchDeviceContacts) {
        next({ type: "LOADING_DEVICE_CONTACTS" });
        Contacts.getAll((err, contacts) => {
          next({
            type: "LOADED_DEVICE_CONTACTS",
            trigger: action,
            dataReceived: contacts
          });
        });
      }
      break;
    case "LOGGED_OUT": {
      AsyncStorage.removeItem("@authenticityToken");
      AsyncStorage.removeItem("@businessId");

      next(action);
      break;
    }
    case "LOGGED_IN": {
      if (action.dataReceived.token) {
        AsyncStorage.setItem("@authenticityToken", action.dataReceived.token);
      }

      if (action.dataReceived.businessId) {
        AsyncStorage.setItem("@businessId", action.dataReceived.businessId);
      }

      next(action);

      fetchAccountInfo(store, next, action);
      break;
    }
    case "LOAD_LOCAL_DATA": {
      next({ type: "LOADING_LOCAL_DATA" });

      AsyncStorage.getItem("@authenticityToken")
        .then(token => {
          if (token) {
            store.dispatch({ type: "AUTHENTICATION_RESTORED", token });
          }
        })
        .then(
          AsyncStorage.getItem("@businessId")
            .then(businessId => {
              if (businessId) {
                store.dispatch({ type: "SET_CURRENT_BUSINESS", businessId });
              }
            })
            .then(() => {
              next({ ...action, type: "LOADED_LOCAL_DATA" });
            })
        );

      break;
    }
    case "LOAD_INITIAL_DATA": {
      fetchPeopleAndGroups(store, next, action);
      fetchChannels(store, next, action);

      break;
    }
    case "EDIT_GROUP":
    case "SET_TAB": {
      const {
        app: { loadingAccountData }
      } = store.getState();
      next(action);

      if (loadingAccountData) {
        fetchAccountInfo(store, next, action);
      }

      fetchPeopleAndGroups(store, next, action);
      break;
    }
    case "SET_TAB_TO_THREADS": {
      const {
        app: { loadingAccountData }
      } = store.getState();

      next(action);

      if (loadingAccountData) {
        fetchAccountInfo(store, next, action);
      }

      fetchChannels(store, next, action);
      break;
    }
    case "AUTHENTICATION_RESTORED": {
      next(action);

      fetchAccountInfo(store, next, action);
      break;
    }
    default:
      next(action);

      break;
  }
};

export default dataService;

export const setInitialState = additionalState => {
  const dimensions = {};
  const deviceContacts = [];
  const app = {
    selectedTab: "messages",
    activeOverlay: null,
    loginPerson: {},
    editContact: {},
    editTextGroup: {},
    addTextGroup: {},
    addContact: {},
    newMessage: {},
    threadsTab: {}
  };
  const appData = {
    businesses: {},
    people: {},
    textGroups: {},
    channels: {},
    messages: {}
  };

  return { deviceContacts, app, appData, dimensions, ...additionalState };
};

const newSearchString = (
  index,
  existingSearchString,
  selectedIds,
  actionId
) => {
  if (index === -1) {
    selectedIds.push(actionId);
    return null;
  } else {
    selectedIds.splice(index, 1);
    return existingSearchString;
  }
};

const mergeAppData = (appData, dataReceived) => {
  const keys = Object.keys(dataReceived);

  const mergedData = keys.reduce((acc, key) => {
    return {
      ...acc,
      [key]: { ...(appData[key] || {}), ...(dataReceived[key] || {}) }
    };
  }, appData);

  return mergedData;
};

const reducers = (state, action) => {
  switch (action.type) {
    case "NETWORK_ERROR": {
      return {
        ...state,
        app: {
          ...state.app,
          loadingData: false,
          loadingApp: false,
          networkUnavailable: true
        }
      };
    }
    case "CHANGE_DIMENSIONS": {
      const { window, screen } = action;
      const dimensions = { window, screen };
      return { ...state, dimensions };
    }
    case "LOGGED_IN": {
      const { token: authenticityToken, businessId } = action.dataReceived;
      loginPerson = {
        ...state.app["loginPerson"],
        new: { ...state.app["loginPerson"]["new"], code: null }
      };

      return {
        ...state,
        app: {
          ...state.app,
          loginPerson,
          authenticityToken,
          businessId,
          codeRequested: false
        }
      };
    }
    case "LOGGED_OUT": {
      return {
        ...state,
        app: { ...state.app, authenticityToken: null, businessId: null }
      };
    }
    case "REQUESTED_CODE": {
      const { mobile } = action;
      return { ...state, app: { ...state.app, mobile, codeRequested: true } };
    }
    case "RESET_MOBILE": {
      return { ...state, app: { ...state.app, mobile: null } };
    }
    case "AUTHENTICATION_RESTORED": {
      return {
        ...state,
        app: { ...state.app, authenticityToken: action.token }
      };
    }
    case "SET_CURRENT_BUSINESS": {
      return { ...state, app: { ...state.app, businessId: action.businessId } };
    }
    case "TOGGLE_CONTACT_GROUP": {
      const { contactId, textGroupId, componentStateKey } = action;
      const editContactForId = state.app[componentStateKey][contactId];
      const existingSelectedGroups =
        (editContactForId && editContactForId.selectedGroups) || [];
      const indexOfExistingGroup = existingSelectedGroups.indexOf(textGroupId);

      const selectedGroups =
        indexOfExistingGroup == -1
          ? [...existingSelectedGroups, textGroupId]
          : [
              ...existingSelectedGroups.slice(0, indexOfExistingGroup),
              ...existingSelectedGroups.slice(indexOfExistingGroup + 1)
            ];
      const editContact = {
        ...state.app[componentStateKey],
        [contactId]: {
          ...state.app[componentStateKey][contactId],
          selectedGroups
        }
      };

      return {
        ...state,
        app: { ...state.app, [componentStateKey]: editContact }
      };
    }
    case "TOGGLE_GROUP_CONTACT": {
      const { contactId, textGroupId, componentStateKey } = action;
      const editGroupForId = state.app[componentStateKey][textGroupId];
      const existingSelectedContacts =
        (editGroupForId && editGroupForId.selectedContacts) || [];
      const indexOfExistingContact = existingSelectedContacts.indexOf(
        contactId
      );

      const selectedContacts =
        indexOfExistingContact == -1
          ? [...existingSelectedContacts, contactId]
          : [
              ...existingSelectedContacts.slice(0, indexOfExistingContact),
              ...existingSelectedContacts.slice(indexOfExistingContact + 1)
            ];

      const editGroup = {
        ...state.app[componentStateKey],
        [textGroupId]: {
          ...state.app[componentStateKey][textGroupId],
          selectedContacts
        }
      };

      return {
        ...state,
        app: { ...state.app, [componentStateKey]: editGroup }
      };
    }
    case "SET_PERMANENT_CHANNEL": {
      const { textGroupId, setChannelPermanence, componentStateKey } = action;

      const groupFormState = {
        ...state.app[componentStateKey],
        [textGroupId]: {
          ...state.app[componentStateKey][textGroupId],
          setChannelPermanence
        }
      };
      return {
        ...state,
        app: { ...state.app, [componentStateKey]: groupFormState }
      };
    }
    case "SET_ACTIVE_THREAD": {
      const { activeThreadId } = action;
      const app = {
        ...state.app,
        threadsTab: { ...state.app.threadsTab, activeThreadId }
      };

      return { ...state, app };
    }
    case "ACCOUNT_DATA_RECEIVED": {
      const loadingKey = "loadingAccountData";
      const { currentPerson } = action.dataReceived;

      return {
        ...state,
        app: {
          ...state.app,
          networkUnavailable: false,
          [loadingKey]: false,
          currentPerson
        },
        appData: { ...state.appData, ...action.dataReceived }
      };
    }
    case "ACCOUNT_DATA_LOADING": {
      const loadingKey = "loadingAccountData";

      return { ...state, app: { ...state.app, [loadingKey]: true } };
    }
    case "DATA_RECEIVED": {
      const loadingKey = "loadingData";
      return {
        ...state,
        app: { ...state.app, networkUnavailable: false, [loadingKey]: false },
        appData: mergeAppData(state.appData, action.dataReceived)
      };
    }
    case "DATA_LOADING": {
      const loadingKey = "loadingData";

      return { ...state, app: { ...state.app, [loadingKey]: true } };
    }
    case "SET_TAB":
      return { ...state, app: { ...state.app, selectedTab: action.tab } };
    case "SET_TAB_TO_THREADS": {
      return { ...state, app: { ...state.app, selectedTab: action.tab } };
    }
    case "TOGGLE_DEVICE_CONTACT_SEARCH": {
      const { componentStateKey, toSearchDeviceContacts } = action;

      return {
        ...state,
        app: {
          ...state.app,
          [componentStateKey]: {
            ...state.app[componentStateKey],
            searchDeviceContacts: toSearchDeviceContacts
          }
        }
      };
    }
    case "LOADING_DEVICE_CONTACTS":
      return { ...state, app: { ...state.app, loadingDeviceContacts: true } };
    case "LOADED_DEVICE_CONTACTS":
      return {
        ...state,
        app: { ...state.app, loadingDeviceContacts: false },
        deviceContacts: action.dataReceived
      };
    case "UNAUTHORIZED_RESPONSE":
      return {
        ...state,
        app: { ...state.app, authenticityToken: null, loadingData: false }
      };
    case "NOT_FOUND_RESPONSE":
      return { ...state, app: { ...state.app, loadingData: false } };
    case "ADD_CONTACT":
      return {
        ...state,
        app: {
          ...state.app,
          activeOverlay: "add_contact",
          addContact: { overlayContactId: "new", ...state.app.addContact }
        }
      };
    case "EDIT_CONTACT": {
      const searchDeviceContacts = false;
      const overlayContactId = action.contactId.toString();
      return {
        ...state,
        app: {
          ...state.app,
          activeOverlay: "edit_contact",
          editContact: {
            ...state.app.editContact,
            searchDeviceContacts,
            overlayContactId
          }
        }
      };
    }
    case "HIDE_OVERLAY":
      return { ...state, app: { ...state.app, activeOverlay: null } };
    case "START_MESSAGE":
      return {
        ...state,
        app: { ...state.app, activeOverlay: "start_message" }
      };
    case "RESPOND_TO_CHANNEL": {
      const { threadId: overlayThreadId } = action;

      return {
        ...state,
        app: {
          ...state.app,
          activeOverlay: "channel_message",
          newResponse: { overlayThreadId, [overlayThreadId]: {} }
        }
      };
    }
    case "EDIT_GROUP":
      return {
        ...state,
        app: {
          ...state.app,
          activeOverlay: "edit_group",
          editTextGroup: {
            ...state.app.editTextGroup,
            overlayGroupId: action.groupId.toString()
          }
        }
      };
    case "ADD_GROUP":
      return {
        ...state,
        app: {
          ...state.app,
          activeOverlay: "add_group",
          addTextGroup: { overlayGroupId: "new", ...state.app.addGroup }
        }
      };
    case "TOGGLE_MESSAGE_PERSON": {
      const { itemId, componentStateKey } = action;
      const {
        [componentStateKey]: { [itemId]: formObj }
      } = { [componentStateKey]: {}, ...state.app };
      const { selectedPeopleIds } = { selectedPeopleIds: [], ...formObj };

      const actionId = action.id.toString();
      const index = selectedPeopleIds.indexOf(actionId);

      const searchString = newSearchString(
        index,
        state.app.newMessage.searchString,
        selectedPeopleIds,
        actionId
      );

      return {
        ...state,
        app: {
          ...state.app,
          newMessage: {
            ...state.app.newMessage,
            searchString,
            new: { ...state.app.newMessage.new, selectedPeopleIds }
          }
        }
      };
    }
    case "TOGGLE_MESSAGE_GROUP": {
      const { itemId, componentStateKey } = action;
      const {
        [componentStateKey]: { [itemId]: formObj }
      } = { [componentStateKey]: {}, ...state.app };
      const { selectedGroupIds } = { selectedGroupIds: [], ...formObj };
      const actionId = action.id.toString();
      const index = selectedGroupIds.indexOf(actionId);
      const searchString = newSearchString(
        index,
        state.app.newMessage.searchString,
        selectedGroupIds,
        actionId
      );

      return {
        ...state,
        app: {
          ...state.app,
          newMessage: {
            ...state.app.newMessage,
            searchString,
            new: { ...state.app.newMessage.new, selectedGroupIds }
          }
        }
      };
    }
    case "REMOVE_MESSAGE_GROUP": {
      const selectedGroupIds = (
        state.app.newMessage.selectedGroupIds || []
      ).slice();
      const actionId = action.recipient.id.toString();
      const index = selectedGroupIds.indexOf(actionId);

      selectedGroupIds.splice(index, 1);
      return {
        ...state,
        app: {
          ...state.app,
          newMessage: {
            ...state.app.newMessage,
            new: { ...state.app.newMessage, selectedGroupIds }
          }
        }
      };
    }
    case "REMOVE_MESSAGE_PERSON": {
      const selectedPeopleIds = (
        state.app.newMessage.selectedPeopleIds || []
      ).slice();
      const actionId = action.recipient.id.toString();
      const index = selectedPeopleIds.indexOf(actionId);

      selectedPeopleIds.splice(index, 1);
      return {
        ...state,
        app: {
          ...state.app,
          newMessage: {
            ...state.app.newMessage,
            new: { ...state.app.newMessage.new, selectedPeopleIds }
          }
        }
      };
    }
    case "CREATED_TEXT_MESSAGE": {
      const { dataReceived } = action;
      const appData = Object.keys(dataReceived).reduce((acc, key) => {
        return { ...acc, [key]: { ...(acc[key] || {}), ...dataReceived[key] } };
      }, state.appData);

      const app = { ...state.app, activeOverlay: null, newMessage: {} };

      return { ...state, app, appData };
    }
    case "CREAT_TEXT_MESSAGE_FAILED": {
    }
    case "UPDATE_RECIPIENT_SEARCH": {
      return {
        ...state,
        app: {
          ...state.app,
          newMessage: {
            ...state.app.newMessage,
            searchString: action.search,
            searching: true
          }
        }
      };
    }
    case "BLUR_SEARCH":
      return {
        ...state,
        app: {
          ...state.app,
          newMessage: { ...state.app.newMessage, searching: false }
        }
      };
    case "FOCUS_SEARCH":
      return {
        ...state,
        app: {
          ...state.app,
          newMessage: { ...state.app.newMessage, searching: true }
        }
      };
    case "CLOSE_SEARCH": {
      return {
        ...state,
        app: {
          ...state.app,
          newMessage: { ...state.app.newMessage, searching: false }
        }
      };
    }
    case "CREATING_TEXT_GROUP": {
      return state;
    }
    case "UPDATING_TEXT_GROUP": {
      return state;
    }
    case "REQUEST_CODE_FAILED": {
      const { mobile, errorMessage } = action;

      const {
        loginPerson: { new: existingNewLoginPerson }
      } = state.app;
      const { errors: existingErrors } = existingNewLoginPerson;
      const { mobile: mobileErrors } = { mobile: [], ...existingErrors };
      const errors = { ...existingErrors, mobile: [errorMessage] };

      const loginPerson = { new: { ...existingNewLoginPerson, errors } };

      return { ...state, app: { ...state.app, loginPerson } };
    }
    case "LOGIN_FAILED": {
      const { mobile, errorMessage } = action;

      const {
        loginPerson: { new: existingNewLoginPerson }
      } = state.app;
      const { errors: existingErrors } = existingNewLoginPerson;
      const { code: codeErrors } = { code: [], ...existingErrors };
      const errors = { ...existingErrors, code: [errorMessage] };

      const loginPerson = { new: { ...existingNewLoginPerson, errors } };

      return { ...state, app: { ...state.app, loginPerson } };
    }
    case "CREATED_TEXT_GROUP": {
      const { dataReceived } = action;
      const appData = Object.keys(dataReceived).reduce((acc, key) => {
        return { ...acc, [key]: { ...(acc[key] || {}), ...dataReceived[key] } };
      }, state.appData);

      const app = { ...state.app, activeOverlay: null, addTextGroup: {} };
      return { ...state, app, appData };
    }
    case "UPDATED_TEXT_GROUP": {
      const { dataReceived } = action;
      const appData = Object.keys(dataReceived).reduce((acc, key) => {
        return { ...acc, [key]: { ...(acc[key] || {}), ...dataReceived[key] } };
      }, state.appData);

      const app = { ...state.app, activeOverlay: null, editTextGroup: {} };
      return { ...state, app, appData };
    }
    case "CREATE_TEXT_GROUP_FAILED": {
      return state;
    }
    case "UPDATE_TEXT_GROUP_FAILED": {
      return state;
    }
    case "START_DELETE_GROUP": {
      const { groupId: deletingGroupId } = action;
      const { mergedGroupsPage } = { ...{ groupsPage: {}, ...state.app } };
      const groupsPage = { ...mergedGroupsPage, deletingGroupId };

      return { ...state, app: { ...state.app, groupsPage } };
    }
    case "CANCEL_DELETE_GROUP": {
      const { groupsPage: oldGroupsPage } = state.app;
      const { deletingGroupId: removed, ...groupsPage } = oldGroupsPage;

      return { ...state, app: { ...state.app, groupsPage } };
    }

    case "DELETED_GROUP":
      const {
        [`${action.groupId}`]: deletedGroup,
        ...remainingGroups
      } = state.appData.textGroups;
      const newGroupState = {
        ...state,
        app: { ...state.app, loadingData: false },
        appData: { ...state.appData, textGroups: remainingGroups }
      };

      return newGroupState;
    case "DELETING_GROUP": {
      const { groupsPage: oldGroupsPage } = state.app;
      const { deletingGroupId: removed, ...groupsPage } = oldGroupsPage;

      return { ...state, app: { ...state.app, loadingData: true, groupsPage } };
    }
    case "CREATING_CONTACT": {
      return state;
    }
    case "UPDATING_CONTACT": {
      return state;
    }
    case "CREATED_CONTACT": {
      const { dataReceived } = action;
      const appData = Object.keys(dataReceived).reduce((acc, key) => {
        return { ...acc, [key]: { ...(acc[key] || {}), ...dataReceived[key] } };
      }, state.appData);

      const app = { ...state.app, activeOverlay: null, addContact: {} };
      return { ...state, app, appData };
    }
    case "UPDATED_CONTACT": {
      const { dataReceived } = action;
      const appData = Object.keys(dataReceived).reduce((acc, key) => {
        return { ...acc, [key]: { ...(acc[key] || {}), ...dataReceived[key] } };
      }, state.appData);

      const app = { ...state.app, activeOverlay: null, editContact: {} };
      return { ...state, app, appData };
    }
    case "REMOVED_CONTACT_TEXT_GROUPS": {
      const { contactIds, textGroupIds } = action;

      textGroupPeople = Object.keys(state.appData.textGroupPeople).reduce(
        (acc, key) => {
          textGroupPerson = state.appData.textGroupPeople[key];

          if (
            (contactIds || []).includes(textGroupPerson.personId) &&
            (textGroupIds || []).includes(textGroupPerson.textGroupId)
          ) {
            return acc;
          } else {
            return { ...acc, [key]: textGroupPerson };
          }
        },
        {}
      );

      return { ...state, appData: { ...state.appData, textGroupPeople } };
    }
    case "CREATE_CONTACT_FAILED": {
      return state;
    }
    case "UPDATE_CONTACT_FAILED": {
      return state;
    }
    case "START_DELETE_CONTACT": {
      const { contactId: deletingContactId } = action;
      const { mergedContactsPage } = { ...{ contactsPage: {}, ...state.app } };
      const contactsPage = { ...mergedContactsPage, deletingContactId };

      return { ...state, app: { ...state.app, contactsPage } };
    }
    case "CANCEL_DELETE_CONTACT": {
      const { contactsPage: oldContactsPage } = state.app;
      const { deletingContactId: removed, ...contactsPage } = oldContactsPage;

      return { ...state, app: { ...state.app, contactsPage } };
    }
    case "DELETED_CONTACT": {
      const {
        [`${action.contactId}`]: deletedPeople,
        ...remainingPeople
      } = state.appData.people;

      return {
        ...state,
        app: { ...state.app, loadingData: false },
        appData: { ...state.appData, people: remainingPeople }
      };
    }
    case "DELETING_CONTACT": {
      const { contactsPage: oldContactsPage } = state.app;
      const { deletingContactId: removed, ...contactsPage } = oldContactsPage;

      return {
        ...state,
        app: { ...state.app, loadingData: true, contactsPage }
      };
    }
    case "USE_CONTACT": {
      const { name, mobile, componentStateKey, itemId } = action;
      const searchDeviceContacts = false;

      return {
        ...state,
        app: {
          ...state.app,
          [componentStateKey]: {
            ...state.app[componentStateKey],
            searchDeviceContacts,
            [itemId]: { ...state.app[componentStateKey][itemId], name, mobile }
          }
        }
      };
    }
    case "CHANGE_FIELD": {
      const { field, value, componentStateKey, itemId } = action;

      return {
        ...state,
        app: {
          ...state.app,
          [componentStateKey]: {
            ...state.app[componentStateKey],
            [itemId]: {
              ...state.app[componentStateKey][itemId],
              [field]: value
            }
          }
        }
      };
    }
    case "FOCUS_INPUT": {
      const { componentStateKey, field, itemId } = action;
      const inFocus = field;

      return {
        ...state,
        app: {
          ...state.app,
          [componentStateKey]: {
            ...state.app[componentStateKey],
            [itemId]: { ...state.app[componentStateKey][itemId], inFocus }
          }
        }
      };
    }
    case "BLUR_INPUT": {
      const { componentStateKey, field, itemId } = action;
      const {
        [componentStateKey]: {
          [itemId]: { inFocus: currentInFocus }
        }
      } = state.app;

      const inFocus = currentInFocus === field ? null : currentInFocus;

      return {
        ...state,
        app: {
          ...state.app,
          [componentStateKey]: {
            ...state.app[componentStateKey],
            [itemId]: { ...state.app[componentStateKey][itemId], inFocus }
          }
        }
      };
    }
    case "CLEAR_FIELD":
      const { componentStateKey, field, itemId } = action;

      return {
        ...state,
        app: {
          ...state.app,
          [componentStateKey]: {
            ...state.app[componentStateKey],
            [itemId]: { ...state.app[componentStateKey][itemId], [field]: null }
          }
        }
      };
    case "APPLY_FIELD_ERRORS": {
      const { componentStateKey, field, itemId, fieldErrors } = action;
      const newState = {
        ...state,
        app: {
          ...state.app,
          [componentStateKey]: {
            ...state.app[componentStateKey],
            [itemId]: {
              ...state.app[componentStateKey][itemId],
              errors: {
                ...state.app[componentStateKey][itemId].errors,
                [field]: fieldErrors
              }
            }
          }
        }
      };

      return newState;
    }
    case "APPLY_FORM_ERRORS": {
      const { componentStateKey, formErrors, itemId } = action;

      const {
        [componentStateKey]: { [itemId]: formObj }
      } = { [componentStateKey]: {}, ...state.app };
      const { errors: existingErrors } = { errors: {}, ...formObj };

      const errors = formErrors;
      const newState = {
        ...state,
        app: {
          ...state.app,
          [componentStateKey]: {
            ...state.app[componentStateKey],
            [itemId]: { ...state.app[componentStateKey][itemId], errors }
          }
        }
      };

      return newState;
    }
    case "SHOW_KEYBOARD":
      return { ...state, app: { ...state.app, keyboardVisible: true } };
    case "HIDE_KEYBOARD":
      return { ...state, app: { ...state.app, keyboardVisible: false } };
    case "LOADING_LOCAL_DATA":
      return {
        ...state,
        app: { ...state.app, loadingApp: true, networkUnavailable: false }
      };
    case "LOADED_LOCAL_DATA":
      return { ...state, app: { ...state.app, loadingApp: false } };
    default:
      return state;
  }
};

export default reducers;

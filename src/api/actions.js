import { camelizeKeys, demcalize, decamelizeKeys } from "humps";
import Config from "react-native-config";
import { sendLoginCodeError, loginError } from "./errors";

function apiUrl(endpoint, businessId = null) {
  const host = Config.API_HOST;
  const scheme = Config.API_SCHEME;
  relUrl = businessId ? [businessId, endpoint].join("/") : endpoint;

  return `${scheme}://${host}/api/${relUrl}`;
}

function authHeaders(authenticityToken) {
  return new Headers({ Authorization: `Bearer ${authenticityToken}` });
}

function apiGet(request, store, next, action) {
  const {
    app: { authenticityToken }
  } = store.getState();
  const headers = new Headers(request.headers);

  for (let [headerKey, headerValue] of authHeaders(
    authenticityToken
  ).entries()) {
    headers.append(headerKey, headerValue);
  }

  const newRequest = new Request(request, { headers });

  return wrappedApiFetch(newRequest, store.dispatch);
}

function wrappedApiFetch(request, dispatch) {
  return fetch(request)
    .catch(err => {
      if (err.message.match(/[Nn]etwork/)) {
        dispatch({ type: "NETWORK_ERROR" });
      }
      throw err;
    })
    .then(response => {
      if (response.status == 401) {
        dispatch({ type: "UNAUTHORIZED_RESPONSE" });

        throw new Error("unauthorized");
      }
      return response;
    })
    .then(response => {
      if (response.status == 404) {
        dispatch({ type: "NOT_FOUND_RESPONSE" });

        throw new Error("not found");
      }

      return response;
    });
}

function apiDelete(url, store) {
  const {
    app: { authenticityToken, businessId }
  } = store.getState();

  const headers = authHeaders(authenticityToken);

  const request = new Request(url, { method: "DELETE", headers });

  return wrappedApiFetch(request, store.dispatch);
}

function apiPost(url, store, data, method = "POST") {
  const postData = decamelizeKeys(data);

  const {
    app: { authenticityToken }
  } = store.getState();
  const headers = authHeaders(authenticityToken);
  headers.append("Content-Type", "application/json");

  const body = JSON.stringify(postData);
  const request = new Request(url, { body, method, headers });
  return wrappedApiFetch(request, store.dispatch);
}

function stringifyIds(data) {
  if (data instanceof Object) {
    const newData = Object.keys(data).reduce((acc, key) => {
      const valueIsNumericId =
        typeof data[key] == "number" && (key == "id" || key.match(/Id$/));

      return {
        ...acc,
        [key]: valueIsNumericId ? data[key].toString() : data[key]
      };
    }, {});

    return newData;
  } else {
    return data;
  }
}

function unpackData(data) {
  const camelizedData = camelizeKeys(data);

  const unpackedData = Object.keys(camelizedData).reduce((acc, key) => {
    if (camelizedData[key] instanceof Array) {
      dataHash = camelizedData[key].reduce((modelAcc, data) => {
        const newData = stringifyIds(data);

        return {
          ...modelAcc,
          [newData["id"]]: { ...newData, collectionType: key }
        };
      }, {});

      return { ...acc, [key.toString()]: dataHash };
    } else {
      const subHash = stringifyIds({ [key.toString()]: camelizedData[key] });
      return { ...acc, ...subHash };
    }
  }, {});

  return unpackedData;
}

function packData(data) {
  switch (Object.prototype.toString.call(data)) {
    case "[object Number]":
    case "[object String]": {
      return data;
    }
    default:
      return JSON.stringify(data);
  }
}

export function login(store, next, action) {
  next({ type: "LOGGING_IN" });
  const { mobile, code } = action;

  const loginData = new FormData();
  loginData.append("mobile", mobile);
  loginData.append("code", code);
  const loginRequest = new Request(apiUrl(`sessions`), {
    body: loginData,
    method: "POST"
  });
  fetch(loginRequest).then(response => {
    if (response.ok) {
      response.json().then(data => {
        store.dispatch({ type: "LOGGED_IN", dataReceived: unpackData(data) });
      });
    } else {
      response.json().then(data => {
        const dataReceived = unpackData(data);
        const errorMessage = loginError(response, dataReceived);

        store.dispatch({ type: "LOGIN_FAILED", dataReceived, errorMessage });
      });
    }
  });
}

export function sendLoginCode(store, next, action) {
  next({ type: "REQUESTING_CODE" });
  const { mobile } = action;
  apiPost(apiUrl("request_authentication"), store, { mobile }).then(
    response => {
      if (response.ok) {
        store.dispatch({ type: "REQUESTED_CODE", mobile });
      } else {
        const errorMessage = sendLoginCodeError(mobile);

        store.dispatch({ type: "REQUEST_CODE_FAILED", mobile, errorMessage });
      }
    }
  );
}

export function createMessage(store, next, action) {
  next({ type: "CREATING_TEXT_MESSAGE" });

  const {
    threadId: channelId,
    groupIds: textGroupIds,
    peopleIds,
    outgoingMessage: messageText
  } = action;

  const {
    app: { businessId }
  } = store.getState();
  const url = apiUrl("messages", businessId);
  const postData = channelId
    ? { channelId, messageText }
    : { textGroupIds, peopleIds, messageText };
  apiPost(url, store, postData).then(response => {
    if (response.ok) {
      response.json().then(data => {
        const dataReceived = unpackData(data);
        store.dispatch({ type: "CREATED_TEXT_MESSAGE", dataReceived });
      });
    } else {
      response.json().then(data => {
        store.dispatch({
          type: "CREATE_TEXT_MESSAGE_FAILED",
          dataReceived: data
        });
      });
    }
  });
}

export function createTextGroup(store, next, action) {
  next({ type: "CREATING_TEXT_GROUP" });
  const { attributes } = action;
  const { name, addedContactIds, deletedContactIds, setPermanent } = attributes;

  const {
    app: { businessId }
  } = store.getState();
  const url = apiUrl("groups", businessId);

  apiPost(url, store, {
    name,
    addedContactIds,
    deletedContactIds,
    setPermanent
  }).then(response => {
    if (response.ok) {
      response.json().then(data => {
        const dataReceived = unpackData(data);
        store.dispatch({ type: "CREATED_TEXT_GROUP", dataReceived });
      });
    } else {
      response.json().then(data => {
        store.dispatch({
          type: "CREATE_TEXT_GROUP_FAILED",
          dataReceived: data
        });
      });
    }
  });
}

export function updateTextGroup(store, next, action) {
  const { id } = action;
  next({ type: "UPDATING_TEXT_GROUP", textGroupId: id });

  const { attributes } = action;
  const { name, addedContactIds, deletedContactIds, setPermanent } = attributes;

  const {
    app: { businessId }
  } = store.getState();
  const url = apiUrl(`groups/${id}`, businessId);

  apiPost(
    url,
    store,
    { name, addedContactIds, deletedContactIds, setPermanent },
    "PUT"
  ).then(response => {
    if (response.ok) {
      // REMOVE JOIN RECORDS ON SUCCESS
      next({
        type: "REMOVED_CONTACT_TEXT_GROUPS",
        textGroupIds: [id],
        contactIds: deletedContactIds
      });

      response.json().then(data => {
        const dataReceived = unpackData(data);
        store.dispatch({ type: "UPDATED_TEXT_GROUP", dataReceived, id });
      });
    } else {
      response.json().then(data => {
        store.dispatch({
          type: "UPDATE_TEXT_GROUP_FAILED",
          id,
          dataReceived: data
        });
      });
    }
  });
}

export function deleteTextGroup(store, next, action) {
  const { groupId } = action;
  next({ type: "DELETING_GROUP", groupId });

  const {
    app: { businessId }
  } = store.getState();
  const url = apiUrl(`groups/${groupId}`, businessId);

  apiDelete(url, store).then(response => {
    if (response.ok) {
      next({ type: "DELETED_GROUP", groupId });
    }
  });
}

export function createContact(store, next, action) {
  next({ type: "CREATING_CONTACT" });
  const { attributes } = action;
  const { name, mobile, addedTextGroupIds, deletedTextGroupIds } = attributes;

  const {
    app: { businessId }
  } = store.getState();
  const url = apiUrl("people", businessId);

  apiPost(url, store, {
    name,
    mobile,
    addedTextGroupIds,
    deletedTextGroupIds
  }).then(response => {
    if (response.ok) {
      response.json().then(data => {
        const dataReceived = unpackData(data);
        store.dispatch({ type: "CREATED_CONTACT", dataReceived });
      });
    } else {
      response.json().then(data => {
        store.dispatch({ type: "CREATE_CONTACT_FAILED", dataReceived: data });
      });
    }
  });
}

export function updateContact(store, next, action) {
  const { id } = action;

  const { attributes } = action;
  const { name, mobile, addedTextGroupIds, deletedTextGroupIds } = attributes;

  next({ type: "UPDATING_CONTACT", contactId: id });

  const {
    app: { businessId }
  } = store.getState();
  const url = apiUrl(`people/${id}`, businessId);

  apiPost(
    url,
    store,
    { name, mobile, addedTextGroupIds, deletedTextGroupIds },
    "PUT"
  ).then(response => {
    if (response.ok) {
      // REMOVE JOIN RECORDS ON SUCCESS
      next({
        type: "REMOVED_CONTACT_TEXT_GROUPS",
        contactIds: [id],
        textGroupIds: deletedTextGroupIds
      });

      response.json().then(data => {
        const dataReceived = unpackData(data);
        store.dispatch({ type: "UPDATED_CONTACT", dataReceived, id });
      });
    } else {
      response.json().then(data => {
        store.dispatch({
          type: "UPDATE_CONTACT_FAILED",
          id,
          dataReceived: data
        });
      });
    }
  });
}

export function deleteContact(store, next, action) {
  const { contactId } = action;

  next({ type: "DELETING_CONTACT", contactId });

  const {
    app: { businessId }
  } = store.getState();
  const url = apiUrl(`people/${contactId}`, businessId);

  apiDelete(url, store)
    .then(response => {
      if (response.ok) {
        next({ type: "DELETED_CONTACT", contactId });
      } else {
        alert("!!!BLERGH");
      }
    })
    .catch(err => {
      console.log(err);
    });
}

export function fetchAccountInfo(store, next, action) {
  next({ type: "ACCOUNT_DATA_LOADING" });

  const request = new Request(apiUrl(`current_person`));

  apiGet(request, store, next, action)
    .then(response => {
      response.json().then(data => {
        const dataReceived = unpackData(data);
        next({ type: "ACCOUNT_DATA_RECEIVED", trigger: action, dataReceived });
      });
    })
    .catch(() => {});
}

export function fetchChannels(store, next, action) {
  next({ type: "DATA_LOADING", trigger: action });

  const {
    app: { businessId },
    appData: { cacheInfo }
  } = store.getState();

  const { channelsUpdatedAt } = { ...cacheInfo };

  params = [];
  if (channelsUpdatedAt) {
    params.push(`last_updated_at=${channelsUpdatedAt}`);
  }
  url = [apiUrl(`${businessId}/channels`), params.join("&")]
    .filter(part => part)
    .join("?");

  const request = new Request(url);

  apiGet(request, store, next, action)
    .then(response => {
      response.json().then(data => {
        const dataReceived = unpackData(data);
        next({ type: "DATA_RECEIVED", trigger: action, dataReceived });
      });
    })
    .catch(() => {});
}

export function fetchChannel(store, next, action) {
  next({ type: "DATA_LOADING", trigger: action });

  const { id } = action;
  const {
    app: { businessId },
    appData: { cacheInfo }
  } = store.getState();
  const {
    channels: { [id]: channelUpdatedAt }
  } = { channels: [], ...cacheInfo };

  params = [];
  if (channelUpdatedAt) {
    params.push(`last_updated_at=${channelUpdatedAt}`);
  }
  url = [apiUrl(`${businessId}/channels/${id}`), params.join("&")]
    .filter(part => part)
    .join("?");

  const request = new Request(url);

  apiGet(request, store, next, action)
    .then(response => {
      response.json().then(data => {
        const dataReceived = unpackData(data);
        next({ type: "DATA_RECEIVED", trigger: action, dataReceived });
      });
    })
    .catch(() => {});
}

export function fetchPeopleAndGroups(store, next, action) {
  next({ type: "DATA_LOADING", trigger: action });
  const {
    app: { businessId },
    appData: { cacheInfo }
  } = store.getState();
  const { peopleUpdatedAt } = { ...cacheInfo };

  params = [];
  if (peopleUpdatedAt) {
    params.push(`last_updated_at=${peopleUpdatedAt}`);
  }
  url = [apiUrl(`${businessId}/people`), params.join("&")]
    .filter(part => part)
    .join("?");

  const request = new Request(url);

  apiGet(request, store, next, action)
    .then(response => {
      response.json().then(data => {
        const dataReceived = unpackData(data);
        next({ type: "DATA_RECEIVED", trigger: action, dataReceived });
      });
    })
    .catch(() => {});
}

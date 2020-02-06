import { phoneFormat } from "../helpers/formatters";

export function sendLoginCodeError(mobile) {
  return `We don't have a record of service for ${phoneFormat(mobile)}.`;
}

export function loginError(response, unpackedData) {
  if (response.status == 401) {
    return "Looks like that code is incorrect. Please check it and try again.";
  } else {
    return "There was an error";
  }
}

const textMessageValidation = ({
  threadId,
  groupIds,
  peopleIds,
  outgoingMessage
}) => {
  const errors = {};

  if (!outgoingMessage || outgoingMessage.trim() == "") {
    errors["outgoingMessage"] = ["not be blank"];
  }

  if (
    !threadId &&
    (!groupIds || groupIds.length === 0) &&
    (!peopleIds || peopleIds.length === 0)
  ) {
    errors["recipients"] = ["not be empty"];
  }

  return errors;
};

const groupValidations = (field, { complete }) => {
  switch (field) {
    case "name": {
      return ({ value, itemId, field }) => {
        const errors = [];

        if (complete) {
          if (!`${value}`.replace(/\s/gi)) {
            errors.push("not be blank");
          }
        }

        return errors;
      };
    }
  }
};

const contactValidations = (field, { complete }) => {
  switch (field) {
    case "name": {
      return ({ value, itemId, field }) => {
        const errors = [];

        if (complete) {
          if (!`${value}`.replace(/\s/gi)) {
            errors.push("not be blank");
          }
        }

        return errors;
      };
    }
    case "mobile": {
      const validation = ({ value, itemId, field }) => {
        const errors = [];

        if (value.replace(/[\D]/gi, "").length > 11 && value[0] == "1") {
          errors.push("have 11 or fewer digits");
        }

        if (value.replace(/[\D]/gi, "").length > 10 && value[0] != "1") {
          errors.push("have 10 or fewer digits");
        }

        if (!value.match(/^[\d-\(\)\.]*$/)) {
          errors.push("only contain digits and parenthesis");
        }

        if (complete) {
          if (value[0] == "1" && value.replace(/[\D]/gi, "").length < 11) {
            errors.push("have 11 digits");
          }

          if (value[0] != "1" && value.replace(/[\D]/gi, "").length < 11) {
            errors.push("have 10 digits");
          }
        }

        return errors;
      };

      return validation;
    }
  }
};

const getValidations = componentStateKey => {
  if (componentStateKey.match(/Contact/)) {
    return contactValidations;
  } else if (componentStateKey.match(/Group/)) {
    return groupValidations;
  } else {
    return () => {};
  }
};

const runValidation = (fieldValidation, store, next, action) => {
  const fieldErrors = fieldValidation(action);
  if (fieldErrors.length > 0) {
    next({ ...action, type: "APPLY_FIELD_ERRORS", fieldErrors });
  } else {
    next({ ...action, type: "APPLY_FIELD_ERRORS", fieldErrors: null });
  }
};

const formValidations = store => next => action => {
  const { dispatch } = store;
  switch (action.type) {
    case "CREATE_TEXT_MESSAGE_SUBMIT": {
      next(action);
      fieldValidations = textMessageValidation;
      formErrors = fieldValidations(action);

      if (Object.keys(formErrors).length == 0) {
        dispatch({ ...action, type: "CREATE_TEXT_MESSAGE" });
      } else {
        next({ ...action, type: "APPLY_FORM_ERRORS", formErrors });
      }
      break;
    }
    case "CHANGE_FIELD": {
      next(action);

      const { field, value, itemId, componentStateKey } = action;
      const fieldValidation = getValidations(componentStateKey)(field, {
        complete: false
      });
      if (fieldValidation) {
        runValidation(fieldValidation, store, next, action);
      }
      break;
    }
    case "BLUR_INPUT": {
      next(action);

      const { field, itemId, componentStateKey } = action;
      const {
        app: {
          [componentStateKey]: { [itemId]: formState }
        }
      } = { [componentStateKey]: { [itemId]: null }, ...store.getState() };

      if (formState.hasOwnProperty(field)) {
        const { [field]: value } = formState;
        const fieldValidation = getValidations(componentStateKey)(field, {
          complete: true
        });
        if (fieldValidation) {
          runValidation(fieldValidation, store, next, { ...action, value });
        }
      }
      break;
    }
    default:
      next(action);
      break;
  }
};

export default formValidations;

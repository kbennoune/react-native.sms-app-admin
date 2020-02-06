"use strict";

import call from "react-native-phone-call";

const deviceActions = store => next => action => {
  switch (action.type) {
    case "CALL_CONTACT": {
      const { mobile: number } = action;
      const prompt = false;
      const callOpts = { number, prompt };
      next(action);

      call(callOpts).catch(console.error);

      break;
    }
    default: {
      next(action);

      break;
    }
  }
};

export default deviceActions;

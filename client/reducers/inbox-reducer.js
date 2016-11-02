import { GET_MESSAGES, SHOW_MESSAGE_THREAD } from '../actions/inbox-actions';

const initialState = { messageId: null, messages: null, err: null, loading: false, modalShowing: false};

export const inboxReducer = (state=initialState, action) => {
  switch(action.type) {
    case `${GET_MESSAGES}_PENDING`:
      return initialState;
    case `${GET_MESSAGES}_FULFILLED`:
      return { messages: action.payload, err: false, loading: true, modalShowing: state.modalShowing};
    case `${GET_MESSAGES}_REJECTED`:
      return { messages: null, err: action.payload, loading: false, modalShowing: false};
    case SHOW_MESSAGE_THREAD:
      return Object.assign({}, state, {messageId: action.messageId, modalShowing: true});
    default:
      return state;
  }
};

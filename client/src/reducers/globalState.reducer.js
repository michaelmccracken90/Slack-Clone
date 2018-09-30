import constants from "../constants";

const initialState = {
  isSideBarOpen: false,
  rightSideBarView: "team"
};

export default (state = initialState, action) => {
  const newState = { ...state };
  switch (action.type) {
    case constants.TOGGLE_SIDE_BAR:
      newState.isSideBarOpen = !newState.isSideBarOpen;
      return newState;

    case constants.SWITCH_RIGHT_SIDE_BAR_VIEW:
      newState.rightSideBarView = action.payload;
      return newState;

    case constants.LOGOUT_USER:
      return initialState;

    default:
      return state;
  }
};

/* state selectors */
const getIsSideBarOpen = state => state.globalStateReducer.isSideBarOpen;

const getRightSideBarView = state => state.globalStateReducer.isSideBarOpen;

export { getIsSideBarOpen, getRightSideBarView };
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import { globalStateAction } from "@/actions";
import { channelSelector, globalStateSelector } from "@/reducers/selectors";
import MainHeader from "./MainHeader.jsx";

const stateToProps = state => ({
  isSidebarOpen: globalStateSelector.getIsSidebarOpen(state),
  currentChannelMemberList: channelSelector.getCurrentChannelMemberList(state),
  currentChannel: channelSelector.getCurrentChannel(state),
  messageGroupName: channelSelector.getMessageGroupName(state),
  messageGroupMemberList: channelSelector.getMessageGroupMemberList(state)
});

const dispatchToProps = dispatch => ({
  toggleRightSidebar: () => {
    dispatch(globalStateAction.toggleRightSidebar());
  },
  switchRightSidebarView: selectedView => {
    dispatch(globalStateAction.switchRightSidebarView(selectedView));
  }
});

export default withRouter(
  connect(
    stateToProps,
    dispatchToProps
  )(MainHeader)
);
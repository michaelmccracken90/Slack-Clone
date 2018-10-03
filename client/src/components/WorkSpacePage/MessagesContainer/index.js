import React from "react";
import ReactDOM from "react-dom";
import { Comment, MessageList } from "semantic-ui-react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import "./index.scss";
import Message from "./Message";
import { messageAction, globalStateAction, channelAction } from "@/actions";
import {
  messageSelector,
  teamSelector,
  channelSelector
} from "@/reducers/selectors";

class MessagesContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isMessageFetched: false,
      currentTeamParams: 0,
      allowToFetchMore: true,
      currentMessageLength: 0,
      currentChannelParams: 0
    };
  }

  componentDidMount() {
    const { receiveSocketMessage, messageList } = this.props;
    receiveSocketMessage();
    this.setState({
      currentMessageList: messageList.length
    });
    this.scrollerDiv.addEventListener("scroll", () => this.handleScroll());
  }

  componentDidUpdate() {
    const {
      fetchGetChannelAssociatedList,
      currentChannel,
      currentTeam
    } = this.props;
    /* fetch channel message list if currentchannel and currentTeam exist, set isMessageFetched to true */
    if (this.isCurrentDataFetched() && !this.state.isMessageFetched) {
      fetchGetChannelAssociatedList(currentChannel.id);
      this.setState({ isMessageFetched: true });
    }

    /* refetch channel message again if channel has changed */
    if (this.isCurrentDataFetched()) {
      const { currentChannelParams, currentTeamParams } = this.state;
      if (
        currentChannelParams !== currentChannel.id ||
        currentTeamParams !== currentTeam.id
      ) {
        this.setState({
          currentChannelParams: currentChannel.id,
          currentTeamParams: currentTeam.id,
          isMessageFetched: false
        });
      }
    }
  }

  isCurrentDataFetched = () => {
    const { currentChannel, currentTeam } = this.props;
    if (
      Object.keys(currentChannel).length > 0 &&
      Object.keys(currentTeam).length > 0
    ) {
      return true;
    }
    return false;
  };

  handleScroll = () => {
    const { allowToFetchMore } = this.state;
    if (this.scrollerDiv.scrollTop === 0 && allowToFetchMore) {
      this.setState({
        allowToFetchMore: false
      });
      setTimeout(() => {
        this.loadmore();
      }, 500);
      setTimeout(() => {
        this.setState({
          allowToFetchMore: true
        });
      }, 1000);
    }
  };

  loadmore = () => {
    const { messageList, fetchMoreMessage, currentChannel } = this.props;
    fetchMoreMessage({
      channelId: currentChannel.id,
      offset: messageList.length
    });
  };

  render() {
    const {
      messageList,
      isSidebarOpen,

      switchRightSidebarView,
      switchTargetUser
    } = this.props;
    return (
      <div
        className={`messages-container messages-container--sidebar-${isSidebarOpen}`}
        ref={scrollerDiv => {
          this.scrollerDiv = scrollerDiv;
        }}
      >
        {" "}
        <Comment.Group>
          {messageList.map((message, i) => (
            <Message
              key={`${message.id}-${i}`}
              switchRightSidebarView={switchRightSidebarView}
              message={message}
              switchTargetUser={switchTargetUser}
            />
          ))}
        </Comment.Group>
      </div>
    );
  }
}
MessagesContainer.propTypes = {
  currentChannel: PropTypes.object.isRequired,
  currentTeam: PropTypes.object.isRequired,
  messageList: PropTypes.array.isRequired,

  fetchGetChannelAssociatedList: PropTypes.func.isRequired,
  fetchMoreMessage: PropTypes.func.isRequired,
  receiveSocketMessage: PropTypes.func.isRequired,
  switchTargetUser: PropTypes.func.isRequired,
  switchRightSidebarView: PropTypes.func.isRequired
};

const stateToProps = state => ({
  messageList: messageSelector.getMessageList(state),
  currentTeam: teamSelector.getCurrentTeam(state),
  currentChannel: channelSelector.getCurrentChannel(state)
});

const dispatchToProps = dispatch => ({
  fetchGetChannelAssociatedList: channelId => {
    dispatch(channelAction.fetchGetChannelAssociatedList(channelId));
  },
  fetchMoreMessage: currentMessageData => {
    dispatch(messageAction.fetchMoreMessage(currentMessageData));
  },
  receiveSocketMessage: () => {
    dispatch(messageAction.receiveSocketMessage());
  },
  switchTargetUser: targetUserId => {
    dispatch(globalStateAction.switchTargetUser(targetUserId));
  },
  switchRightSidebarView: selectedView => {
    dispatch(globalStateAction.switchRightSidebarView(selectedView));
  }
});

export default connect(
  stateToProps,
  dispatchToProps
)(MessagesContainer);

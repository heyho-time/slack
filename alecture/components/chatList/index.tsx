// import Chat from '@components/Chat';
import Chat from '@components/chat';
import { ChatZone, Section, StickyHeader } from '@components/chatList/styles';
import { IDM, IChat } from '@typings/db';
import React, { useCallback, forwardRef, RefObject, MutableRefObject, VFC } from 'react';
// import { Scrollbars } from 'react-custom-scrollbars';

interface Props {
  chatData: IDM[] | undefined;
}
const ChatList: VFC<Props> = ({ chatData }) => {
  return (
    <ChatZone>
      <div>
        {chatData?.map((chat) => (
          <Chat key={chat.id} data={chat} />
        ))}
      </div>
    </ChatZone>
  );
};

export default ChatList;

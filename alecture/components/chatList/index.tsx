// import Chat from '@components/Chat';
import Chat from '@components/chat';
import { ChatZone, Section, StickyHeader } from '@components/chatList/styles';
import { IDM } from '@typings/db';
import React, { useCallback, forwardRef } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

interface Props {
  chatSections: { [key: string]: IDM[] };
  setSize: (f: (size: number) => number) => Promise<IDM[][] | undefined>;
  isEmpty: boolean;
  isReachingEnd: boolean;
}
const ChatList = forwardRef<Scrollbars, Props>(({ chatSections, setSize, isEmpty, isReachingEnd }, ref) => {
  const onScroll = useCallback((values: any) => {
    if (values.scrollTop === 0 && !isReachingEnd) {
      // console.log('top top top');
      setSize((prevSize) => prevSize + 1).then(() => {});
    }
  }, []);

  return (
    <ChatZone>
      <Scrollbars autoHide ref={ref} onScrollFrame={onScroll}>
        {Object.entries(chatSections).map(([date, chats]) => {
          return (
            <Section className={`section-${date}`} key={date}>
              <StickyHeader>
                <button>{date}</button>
              </StickyHeader>
              {chats.map((chat: IDM) => (
                <Chat key={chat.id} data={chat} />
              ))}
            </Section>
          );
        })}
        {/* 객체를 배열로 바꿔.  */}
        {/* {chatSections?.map((chat) => (
          <Chat key={chat.id} data={chat} />
        ))} */}
      </Scrollbars>
    </ChatZone>
  );
});

export default ChatList;

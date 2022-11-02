import React, { useCallback } from 'react';
import Workspace from '@layouts/workspace';
import { Container, Header } from './styles';
import ChatList from '@components/chatList';
import ChatBox from '@components/chatBox';
import useInput from '@hooks/useInput';

const Channel = () => {
  const [chat, onChangeChat, setChat] = useInput('');
  const onSubmitForm = useCallback((e: any) => {
    e.preventDefault();
    setChat('');
  }, []);

  return (
    <Workspace>
      <Container>
        <Header>채널 !</Header>
        <ChatList />
        <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />
      </Container>
    </Workspace>
  );
};

export default Channel;

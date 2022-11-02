import React, { useCallback } from 'react';
import Workspace from '@layouts/workspace';
import { Container, Header } from './styles';
import gravatar from 'gravatar';
import { useParams, useRouteLoaderData } from 'react-router-dom';
import useSWR, { mutate } from 'swr';
import fetcher from '@utils/fetcher';
import ChatBox from '@components/chatBox';
import ChatList from '@components/chatList';
import useInput from '@hooks/useInput';
import axios from 'axios';
import { IDM } from '@typings/db';

const DirectMessage = () => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const { data: userData } = useSWR(`/api/workspaces/${workspace}/users/${id}`, fetcher);
  const { data: myData } = useSWR(`/api/users`, fetcher);
  const [chat, onChangeChat, setChat] = useInput('');

  const { data: chatData, mutate } = useSWR<IDM[]>(
    (index: any) => `/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=1`,
    fetcher,
  );

  const onSubmitForm = useCallback(
    (e: any) => {
      e.preventDefault();
      console.log(chat, 'c');
      if (chat?.trim()) {
        axios
          .post(`/api/workspaces/${workspace}/dms/${id}/chats`, {
            content: chat,
          })
          .then(() => {
            mutate();
            setChat('');
          })
          .catch(console.error);
      }
    },
    [chat, chatData],
  );

  if (!userData || !myData) {
    return <div>로딩중</div>;
  }

  return (
    <Workspace>
      <Container>
        <Header>
          <img src={gravatar.url(userData.email, { s: '24px', d: 'retro' })} alt={userData.nickname} />
          <span>{userData.nickname}</span>
        </Header>
        <ChatList />
        <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />
      </Container>
    </Workspace>
  );
};

export default DirectMessage;

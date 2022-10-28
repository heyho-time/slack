import React from 'react';
import Workspace from '@layouts/workspace';
import { Container, Header } from './styles';
import gravatar from 'gravatar';
import { useParams, useRouteLoaderData } from 'react-router-dom';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';

const DirectMessage = () => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const { data: userData } = useSWR(`/api/workspaces/${workspace}/users/${id}`, fetcher);
  const { data: myData } = useSWR(`/api/users`, fetcher);

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
      </Container>
    </Workspace>
  );
};

export default DirectMessage;

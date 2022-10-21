import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { FC, useCallback, useState } from 'react';
import { Navigate } from 'react-router-dom';
import useSWR from 'swr';
import {
  Channels,
  Chats,
  Header,
  LogOutButton,
  MenuScroll,
  ProfileImg,
  ProfileModal,
  RightMenu,
  WorkspaceName,
  Workspaces,
  WorkspaceWrapper,
} from './styles';
import gravatar from 'gravatar';
import Menu from '@components/menu';

const Workspace: FC = ({ children }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { data, error, mutate } = useSWR('/api/users', fetcher);

  const onLogout = useCallback(() => {
    axios
      .post('/api/users/logout', null, {
        withCredentials: true,
      })
      .then((res) => {
        mutate(res.data);
      });
  }, []);

  if (!data) {
    return <Navigate to="/login" />;
  }

  const onClickUserProfile = useCallback(() => {
    setShowUserMenu(!showUserMenu);
  }, [showUserMenu]);

  return (
    <div>
      <Header>test</Header>
      <RightMenu>
        <span onClick={onClickUserProfile}>
          <ProfileImg src={gravatar.url(data.email, { s: '28px', d: 'retro' })} alt={data.nickname} />
          {showUserMenu && (
            <Menu style={{ right: 0, top: 38 }} onCloseModal={onClickUserProfile} show={showUserMenu}>
              <ProfileModal>
                <img src={gravatar.url(data.email, { s: '28px', d: 'retro' })} alt={data.nickname} />
                <div>
                  <span id="profile-name">{data.nickname}</span>
                  <span id="profile-active">Active</span>
                </div>
              </ProfileModal>
              <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
            </Menu>
          )}
        </span>
      </RightMenu>
      <WorkspaceWrapper>
        <Workspaces>test</Workspaces>
        <Channels>
          <WorkspaceName>Sleact</WorkspaceName>
          <MenuScroll>MenuScroll</MenuScroll>
        </Channels>
        <Chats> {children}</Chats>
      </WorkspaceWrapper>
    </div>
  );
};

export default Workspace;

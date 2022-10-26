import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { FC, useCallback, useState } from 'react';
import { Navigate } from 'react-router-dom';
import useSWR from 'swr';
import {
  AddButton,
  Channels,
  Chats,
  Header,
  LogOutButton,
  MenuScroll,
  ProfileImg,
  ProfileModal,
  RightMenu,
  WorkspaceButton,
  WorkspaceModal,
  WorkspaceName,
  Workspaces,
  WorkspaceWrapper,
} from './styles';
import gravatar from 'gravatar';
import Menu from '@components/menu';
import { Link } from 'react-router-dom';
import { IUser, IWorkspace } from '@typings/db';
import { Button, Input, Label } from '@pages/signup/styles';
import useInput from '@hooks/useInput';
import Modal from '@components/modal';
import { toast } from 'react-toastify';

import CreateChannelModal from '@components/createChannelModal';

const Workspace: FC = ({ children }) => {
  const { data: userData, error, mutate } = useSWR<IUser | false>('/api/users', fetcher);

  if (!userData) {
    return <Navigate to="/login" />;
  }

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [newWorkspace, onChangeNewWorkspace, setNewWorkspace] = useInput('');
  const [newUrl, onChangeNewUrl, setNewUrl] = useInput('');
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);

  //functions
  const onLogout = useCallback(() => {
    axios
      .post('/api/users/logout', null, {
        withCredentials: true,
      })
      .then((res) => {
        mutate(res.data);
      });
  }, []);

  const onClickUserProfile = useCallback(() => {
    setShowUserMenu(!showUserMenu);
  }, [showUserMenu]);

  const onClickCreateWorkspace = useCallback(() => {
    setShowCreateWorkspaceModal(true);
  }, []);

  const onCreateWorkspace = useCallback(
    (e) => {
      e.preventDefault();
      if (!newWorkspace || !newWorkspace.trim()) return;
      if (!newUrl || !newUrl.trim()) return;
      //trim ->띄어쓰기 하나도 통과돼버리는걸 막는다.
      axios
        .post(
          '/api/workspaces',
          {
            workspace: newWorkspace,
            url: newUrl,
          },
          {
            withCredentials: true,
          },
        )
        .then((res) => {
          mutate(res.data);
          setShowCreateWorkspaceModal(false);
          setNewWorkspace(''), setNewUrl('');
        })
        .catch((err) => {
          console.dir(err);
          toast.error(error.response?.data, { position: 'bottom-center' });
        });
    },
    [newWorkspace, newUrl],
  );

  const onCloseModal = useCallback(() => {
    setShowCreateWorkspaceModal(false);
    setShowCreateChannelModal(false);
  }, []);

  const toggleWorkspaceModal = useCallback(() => {
    setShowWorkspaceModal(!showWorkspaceModal);
  }, [showWorkspaceModal]);

  const onClickAddChannel = useCallback(() => {
    setShowCreateChannelModal(true);
  }, []);

  return (
    <div>
      <Header>test</Header>

      <RightMenu>
        <span onClick={onClickUserProfile}>
          <ProfileImg src={gravatar.url(userData.email, { s: '28px', d: 'retro' })} alt={userData.nickname} />
          {showUserMenu && (
            <Menu style={{ right: 0, top: 38 }} onCloseModal={onClickUserProfile} show={showUserMenu}>
              <ProfileModal>
                <img src={gravatar.url(userData.email, { s: '28px', d: 'retro' })} alt={userData.nickname} />
                <div>
                  <span id="profile-name">{userData.nickname}</span>
                  <span id="profile-active">Active</span>
                </div>
              </ProfileModal>
              <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
            </Menu>
          )}
        </span>
      </RightMenu>

      <WorkspaceWrapper>
        <Workspaces>
          {userData.Workspaces?.map((ws: IWorkspace) => {
            return (
              <Link key={ws.id} to={`/workspace/${123}/channel/일반`}>
                <WorkspaceButton>{ws.name.slice(0, 1).toUpperCase()}</WorkspaceButton>
              </Link>
            );
          })}
          <AddButton onClick={onClickCreateWorkspace}>+</AddButton>
        </Workspaces>

        <Channels>
          <WorkspaceName onClick={toggleWorkspaceModal}>Sleact</WorkspaceName>
          <MenuScroll>
            <Menu show={showWorkspaceModal} onCloseModal={toggleWorkspaceModal} style={{ top: 95, left: 80 }}>
              <WorkspaceModal>
                <h2>Sleact</h2>
                {/* <button onClick={onClickInviteWorkspace}>워크스페이스에 사용자 초대</button> */}
                <button onClick={onClickAddChannel}>채널 만들기</button>
                <button onClick={onLogout}>로그아웃</button>
              </WorkspaceModal>
            </Menu>
          </MenuScroll>
        </Channels>
        <Chats> {children}</Chats>
      </WorkspaceWrapper>

      <Modal show={showCreateWorkspaceModal} onCloseModal={onCloseModal}>
        <form onSubmit={onCreateWorkspace}>
          <Label id="workspace-label">
            <span>워크스페이스 이름</span>
            <Input id="workspace" value={newWorkspace} onChange={onChangeNewWorkspace} />
          </Label>
          <Label id="workspace-url-label">
            <span>워크스페이스 url</span>
            <Input id="workspace" value={newUrl} onChange={onChangeNewUrl} />
          </Label>
          <Button type="submit">생성하기</Button>
        </form>
      </Modal>

      <CreateChannelModal show={showCreateChannelModal} onCloseModal={onCloseModal} />
    </div>
  );
};

export default Workspace;

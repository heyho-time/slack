import { CollapseButton } from '@components/dmList/styles';
import { IUser, IUserWithOnline } from '@typings/db';
import useSocket from '@hooks/useSocket';
import fetcher from '@utils/fetcher';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import useSWR from 'swr';

const DMList: FC = () => {
  const { workspace } = useParams<{ workspace?: string }>();
  const {
    data: userData,
    error,
    mutate,
  } = useSWR<IUser>('/api/users', fetcher, {
    dedupingInterval: 2000, // 2초
  });
  const { data: memberData } = useSWR<IUserWithOnline[]>(
    userData ? `/api/workspaces/${workspace}/members` : null,
    fetcher,
  );
  const [socket] = useSocket(workspace);
  const [channelCollapse, setChannelCollapse] = useState(false);
  const [onlineList, setOnlineList] = useState<number[]>([]);

  const toggleChannelCollapse = useCallback(() => {
    setChannelCollapse((prev) => !prev);
  }, []);

  useEffect(() => {
    // console.log('DMList: workspace 바꼈다', workspace);
    setOnlineList([]);
  }, [workspace]);

  useEffect(() => {
    socket?.on('onlineList', (data: number[]) => {
      setOnlineList(data);
    });

    return () => {
      socket?.off('onlineList');
    };
  }, [socket]);

  return (
    <>
      <h2>
        <CollapseButton collapse={channelCollapse} onClick={toggleChannelCollapse}>
          <div style={{ color: 'red' }}>{channelCollapse ? '-' : 'open'}</div>
        </CollapseButton>
        <span>Direct Messages</span>
      </h2>
      <div>
        {!channelCollapse &&
          memberData?.map((member) => {
            const isOnline = onlineList.includes(member.id);
            return (
              <NavLink key={member.id} to={`/workspace/${workspace}/dm/${member.id}`}>
                {/* <NavLink key={member.id} activeClassName="selected" to={`/workspace/${workspace}/dm/${member.id}`}></NavLink> */}
                {isOnline ? <div style={{ marginRight: 10 }}>🥎</div> : <div style={{ marginRight: 10 }}>⚾️ </div>}
                <span>{member.nickname}</span>
                {member.id === userData?.id && <span> (나)</span>}
              </NavLink>
            );
          })}
      </div>
    </>
  );
};

export default DMList;

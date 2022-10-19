import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { FC, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import useSWR from 'swr';

const Workspace: FC = ({ children }) => {
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

  if (data) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <button onClick={onLogout}>로그아웃</button>
      {children}
    </div>
  );
};

export default Workspace;

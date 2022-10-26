import React from 'react';
import { Routes, Route } from 'react-router-dom';
import loadable from '@loadable/component';

const Login = loadable(() => import('@pages/login'));
const Signup = loadable(() => import('@pages/signup'));
const Channel = loadable(() => import('@pages/channel'));
const DirectMessage = loadable(() => import('@pages/directMessage'));

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/workspace/:workspace/channel/:channel" element={<Channel />} />
      <Route path="/workspace/:workspace/dm/:id" element={<DirectMessage />} />
    </Routes>
  );
};

export default App;

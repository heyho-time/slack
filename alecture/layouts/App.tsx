import React from 'react';
import { Routes, Route } from 'react-router-dom';
import loadable from '@loadable/component';

const Login = loadable(() => import('@pages/login'));
const Signup = loadable(() => import('@pages/signup'));
const Channel = loadable(() => import('@pages/channel'));

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/workspace/channel" element={<Channel />} />
    </Routes>
  );
};

export default App;

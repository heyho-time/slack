import useInput from '@hooks/useInput';
import React, { useCallback, useState } from 'react';
import { Header, Button, Error, Form, Input, Label, LinkContainer, Success } from '@pages/signup/styles';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';

const LogIn = () => {
  const { data, error, mutate } = useSWR('/api/users', fetcher);
  // const {data} = useSWR('hello', (key)=> {localStorage.setItem('data',key); return localStorage.getItem('data')})
  // swr이 항상 비동기요청과만 관련있는게 아니라 이렇게 전역상태관리로 쓰일 수 있다.
  // 다른 컴포넌트에서 이렇게 사용가능.
  // const {data} = useSWR('hello')

  // const { data, error, mutate } = useSWR('/api/users#123', fetcher);
  // 이렇게 #붙이면 swr이 다르게 인식. 요청은 같게 보내면서 데이터는 다르게 저장할 수 있다.

  const [logInError, setLogInError] = useState(false);
  const [email, onChangeEmail] = useInput('');
  const [password, onChangePassword] = useInput('');

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setLogInError(false);
      axios
        .post(
          '/api/users/login',
          { email, password },
          {
            withCredentials: true,
          }, //get일때와 post일때 withCredentials 위치가 다르다.
        )
        .then((response) => {
          mutate(response.data, true); //optimistic ui -> 낙관적ui 통신 성공할꺼로 예측하고 하는거..
          // 서버에 요청이 가기도전에 액션이 바로바로 반영되도록
        })
        .catch((error) => {
          setLogInError(error.response?.data?.statusCode === 401);
        });
    },
    [email, password],
  );

  if (data) {
    return <Navigate to="/workspace/channel" />;
  }

  return (
    <div id="container">
      <Header>Sleact</Header>
      <Form onSubmit={onSubmit}>
        <Label id="email-label">
          <span>이메일 주소</span>
          <div>
            <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
          {logInError && <Error>이메일과 비밀번호 조합이 일치하지 않습니다.</Error>}
        </Label>
        <Button type="submit">로그인</Button>
      </Form>
      <LinkContainer>
        아직 회원이 아니신가요?&nbsp;
        <Link to="/signup">회원가입 하러가기</Link>
      </LinkContainer>
    </div>
  );
};

export default LogIn;

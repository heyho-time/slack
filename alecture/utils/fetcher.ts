import axios from 'axios';

const fetcher = (url: string) =>
  axios
    .get(url, {
      withCredentials: true,
      //   withCredentials: true, proxy를 안써서 백엔드, 프론트 포트가 다르면 쿠키를 전달할 수 없음. 로그인이 됐는지 확인불가. 그래서 이거로 해결.
    })
    .then((response) => response.data);

export default fetcher;

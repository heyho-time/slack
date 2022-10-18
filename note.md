## axios로 요청 보내기와 CORS, proxy

Redux로 상태관리를 하고 Thunk나 Saga 미들웨어로 비동기 통신을 하는데
한 컴포넌트에서만 쓰이는 비동기 통신이 있다면
굳이 비동기 통신과 컴포넌트를 나눌 필요가 없다고 함.

## cors

백엔드 프론트엔드 포트가 다르면 요청을 한번 더 보낸다.
백에서 허용하는걸 해줘야함..

해결법

1. 백엔드에 요청. 해결해달라.
2. 프론트가 스스로 하는 법 -> webpack.config.ts에서 설정.
   이렇게 하면 포트 달라도 options 요청을 한번 더 하지 않음.

   하지만 둘 다 로컬호스트일때만 사용가능.

```js
devServer: {
    historyApiFallback: true, // react router에 필요한 설정
    port: 3090,
    devMiddleware: { publicPath: '/dist/' },
    static: { directory: path.resolve(__dirname) },
    proxy: {
      '/api/': {
        target: 'http://localhost:3095', // 주소를 3095로 보내겠다.
        changeOrigin: true,
      },
    },
  },
```

## cookie

쿠키는 백에서 생성, 프론트에서 저장, 매 요청시 동봉.

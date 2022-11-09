import React, { memo, useMemo, FC } from 'react';
import { ChatWrapper } from './styles';
import gravatar from 'gravatar';
import regexifyString from 'regexify-string';
import { Link, useParams } from 'react-router-dom';
import dayjs from 'dayjs';

interface Props {
  data: any;
}

// a?.b optional chaining
// a??b nullish coalescing

const Chat: FC<Props> = ({ data }) => {
  const user = 'Sender' in data ? data.Sender : data.User;
  const { workspace } = useParams<{ workspace: string; channel: string }>();

  const result = useMemo(
    () =>
      regexifyString({
        input: data.content,
        pattern: /@\[(.+?)]\((\d+?)\)|\n/g,
        decorator(match, index) {
          const arr: string[] | null = match.match(/@\[(.+?)]\((\d+?)\)/)!;
          if (arr) {
            return (
              <Link key={match + index} to={`/workspace/${workspace}/dm/${arr[2]}`}>
                @{arr[1]}
              </Link>
            );
          }
          return <br key={index} />;
        },
      }),
    [data.content],
  );

  return (
    <ChatWrapper>
      <div className="chat-img">
        <img src={gravatar.url(user.email, { s: '36px', d: 'retro' })} alt={user.nickname} />
      </div>
      <div className="chat-text">
        <div className="chat-user">
          <b>{user.nickname}</b>
          {/* <span>{dayjs(data.createdAt).format('h:mm A')}</span> */}
        </div>
        <p>{result}</p>
      </div>
    </ChatWrapper>
  );
};

export default memo(Chat);

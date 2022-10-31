import Modal from '@components/modal';
import useInput from '@hooks/useInput';
import { Button, Input, Label } from '@pages/signup/styles';
import { IChannel, IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { useCallback, VFC } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import useSWR from 'swr';

interface Props {
  show: boolean;
  onCloseModal: () => void;
  setShowCreateChannelModal: (flag: boolean) => void;
}

const CreateChannelModal: VFC<Props> = ({ show, onCloseModal, setShowCreateChannelModal }) => {
  const { workspace } = useParams<{ workspace: string }>();
  const [newChannel, onChangeNewChannel, setNewChannel] = useInput('');
  const { data: userData } = useSWR<IUser | false>(`/api/users`, fetcher);
  const { mutate } = useSWR<IChannel[]>(userData ? `/api/workspaces/${workspace}/channels` : null, fetcher);

  const onCreateChannel = useCallback(
    (e: any) => {
      e.preventDefault();
      axios
        .post(
          `/api/workspaces/${workspace}/channels`,
          {
            name: newChannel,
          },
          { withCredentials: true },
        )
        .then((res) => {
          mutate();
          setShowCreateChannelModal(false);
          setNewChannel('');
        })
        .catch((err) => {
          console.dir(err);
          toast.error(err.response?.data, { position: 'bottom-center' });
        });
    },
    [newChannel, mutate, setNewChannel, setShowCreateChannelModal, workspace],
  );

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onCreateChannel}>
        <Label id="channel-label">
          <span>채널 이름</span>
          <Input id="channel" value={newChannel} onChange={onChangeNewChannel} />
        </Label>

        <Button type="submit">생성하기</Button>
      </form>
    </Modal>
  );
};

export default CreateChannelModal;

// Copyright 2020-2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import {
  ControlBarButton,
  Phone,
  Modal,
  ModalBody,
  ModalHeader,
  ModalButton,
  ModalButtonGroup,
  useMeetingManager,
  Flex
} from 'amazon-chime-sdk-component-library-react';

import { endMeeting } from '../../utils/api';
import { StyledP } from './Styled';
import { useAppState } from '../../providers/AppStateProvider';
import routes from '../../constants/routes';

const EndMeetingControl: React.FC = () => {
  const meetingManager = useMeetingManager();
  const [showModal, setShowModal] = useState(false);
  const [endedMeeting, setEndedMeeting] = useState(false);
  const toggleModal = (): void => setShowModal(!showModal);
  const { meetingId } = useAppState();
  const history = useHistory();

  const path = useLocation();

  const leaveMeeting = async (): Promise<void> => {
    if(!path.pathname.includes("/customer-meeting")) {
      history.push(routes.HOME);
    }
    meetingManager.audioVideo?.stop();
    await meetingManager.leave();
    setEndedMeeting(true);
  };

  const endMeetingForAll = async (): Promise<void> => {
    try {
      if (meetingId) {
        await endMeeting(meetingId);
        await meetingManager.leave();
        history.push(routes.HOME);
      }
    } catch (e) {
      console.log('Could not end meeting', e);
    }
  };

  return (
    <>
      <ControlBarButton icon={<Phone />} onClick={toggleModal} label="Leave" />
      {showModal && !endedMeeting && (
        <Modal size="md" onClose={toggleModal} rootId="modal-root">
          <ModalHeader title="End Meeting" />
          <ModalBody>
            <StyledP>
              Leave meeting or you can end the meeting for all. The meeting
              cannot be used once it ends.
            </StyledP>
          </ModalBody>
          <ModalButtonGroup
            primaryButtons={(!path.pathname.includes("/customer-meeting")) ? [
              <ModalButton
                onClick={endMeetingForAll}
                variant="primary"
                label="End meeting for all"
                closesModal
              />,
              <ModalButton
                onClick={leaveMeeting}
                variant="primary"
                label="Leave Meeting"
                closesModal
              />,
              <ModalButton variant="secondary" label="Cancel" closesModal />
            ] : [<ModalButton
              onClick={leaveMeeting}
              variant="primary"
              label="Leave Meeting"
            // closesModal
            />,
            <ModalButton variant="secondary" label="Cancel" closesModal />
            ]}
          />
        </Modal>
      )}

      {showModal && endedMeeting && (
        <Modal size="fullscreen" rootId="modal-root" dismissible={false}>
          {/* <ModalHeader title="Ended Meeting" /> */}
          <ModalBody>
            <Flex
              container
              layout="fill-space-centered"
              style={{fontSize: '250%' }}
            >
              <h1>Meeting Ended</h1>
            </Flex>
          </ModalBody>

        </Modal>
      )}
    </>
  );
};

export default EndMeetingControl;

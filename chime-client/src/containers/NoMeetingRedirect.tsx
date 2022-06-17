// Copyright 2020-2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import {
  useMeetingManager,
  useNotificationDispatch,
  Severity,
  ActionType,
  Flex,
  Modal,
  ModalBody
} from 'amazon-chime-sdk-component-library-react';

import routes from '../constants/routes';

const NoMeetingRedirect: React.FC = ({ children }) => {
  const history = useHistory();
  const dispatch = useNotificationDispatch();
  const meetingManager = useMeetingManager();
  const [endedMeeting, setEndedMeeting] = useState(false);
  const path = useLocation();

  const payload: any = {
    severity: Severity.INFO,
    message: 'No meeting found, please enter a valid meeting Id',
    autoClose: true
  };

  useEffect(() => {
    if (!meetingManager.meetingSession) {
      setEndedMeeting(true);
      dispatch({
        type: ActionType.ADD,
        payload: payload
      });
      if(!path.pathname.includes("/customer-meeting")) {
        history.push(routes.HOME);
      }
    }
  }, []);

  return <>{children}
    {endedMeeting && path.pathname.includes("/customer-meeting") && (
      <Modal size="fullscreen" rootId="modal-root" dismissible={false}>
        <ModalBody>
          <Flex
            container
            layout="fill-space-centered"
            style={{ fontSize: '250%' }}
          >
            <h1>Meeting Ended</h1>
          </Flex>
        </ModalBody>

      </Modal>
    )}
  </>;
};

export default NoMeetingRedirect;

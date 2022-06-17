// Copyright 2020-2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import {
  MeetingStatus,
  useNotificationDispatch,
  Severity,
  ActionType,
  useMeetingStatus
} from 'amazon-chime-sdk-component-library-react';
import routes from '../constants/routes';

const useMeetingEndRedirect = () => {
  const history = useHistory();
  const dispatch = useNotificationDispatch();
  const meetingStatus = useMeetingStatus();
  const path = useLocation();

  useEffect(() => {
    if (meetingStatus === MeetingStatus.Ended) {
      console.log('[useMeetingEndRedirect] Meeting ended');
      dispatch({
        type: ActionType.ADD,
        payload: {
          severity: Severity.INFO,
          message: 'The meeting was ended by another attendee',
          autoClose: true,
          replaceAll: true
        }
      });
      if (!path.pathname.includes("/customer-meeting")) {
        history.push(routes.HOME);
      }
      else {
        window.location.reload();
      }
    }
  }, [meetingStatus]);
};

export default useMeetingEndRedirect;

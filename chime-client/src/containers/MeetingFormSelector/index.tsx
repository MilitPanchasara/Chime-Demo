// Copyright 2020-2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import {
  Flex,
  SecondaryButton
} from 'amazon-chime-sdk-component-library-react';

import MeetingForm from '../MeetingForm';
import SIPMeeting from '../SIPMeeting';
import useToggle from '../../hooks/useToggle';
import SIPMeetingProvider from '../../providers/SIPMeetingProvider';
import { StyledDiv, StyledWrapper } from './Styled';
import { useLocation } from 'react-router-dom';
import MeetingFormAttendee from '../MeetingFormAttendee';

const MeetingFormSelector: React.FC = () => {
  const { isActive, toggle } = useToggle(false);
  const path = useLocation();
   console.log(path);
   
  const formToShow = (path.pathname != '/customer') ? <MeetingForm /> : <MeetingFormAttendee />
  // const formToShow = <MeetingForm />

  return (
    <StyledWrapper>
      <StyledDiv>{formToShow}</StyledDiv>
    </StyledWrapper>
  );
};

export default MeetingFormSelector;

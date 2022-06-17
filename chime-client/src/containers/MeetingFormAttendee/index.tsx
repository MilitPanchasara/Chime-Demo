// Copyright 2020-2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import '../../styles.css'
import React, { useState, useContext, ChangeEvent, ReactElement, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import {
  Input,
  Flex,
  Heading,
  FormField,
  PrimaryButton,
  useMeetingManager,
  Modal,
  ModalBody,
  ModalHeader
} from "amazon-chime-sdk-component-library-react";

import { getErrorContext } from "../../providers/ErrorProvider";
import routes from "../../constants/routes";
import Card from "../../components/Card";
import Spinner from "../../components/Spinner";
import DevicePermissionPrompt from "../DevicePermissionPrompt";
import RegionSelection from "./RegionSelection";
import { fetchMeeting, createGetAttendeeCallback } from "../../utils/api";
import { useAppState } from "../../providers/AppStateProvider";
import { API_BASE_URL } from '../../constants';

const MeetingFormAttendee: React.FC = () => {
  const meetingManager = useMeetingManager();
  const {
    setAppMeetingInfo,
    region: appRegion,
    meetingId: appMeetingId
  } = useAppState();
  const [meetingId, setMeetingId] = useState(appMeetingId);
  const [meetingErr, setMeetingErr] = useState(false);
  const [name, setName] = useState("");
  const [nameErr, setNameErr] = useState(false);
  const [region, setRegion] = useState(appRegion);
  const [isLoading, setIsLoading] = useState(false);
  const { errorMessage, updateErrorMessage } = useContext(getErrorContext());
  const history = useHistory();
  const [endedMeeting, setEndedMeeting] = useState(false);
  // const tableRowsDefault: ReactElement<any, any>[] = [];
  const [tableRows, setTableRows] = useState(([] as any[]));
  const path = useLocation();
  var clientMeetingId: string;
  if (path.search != '' && path.search.split('=').length > 1 && path.search.split('=')[0] == '?meetingId' && path.search.split('=')[1] != '') {
    clientMeetingId = path.search.split('=')[1];
  }

  var existingMeeting: any;

  useEffect(() => {
    getMeeting();
  }, []);

  const getMeeting = async () => {
    var requestPath = API_BASE_URL + "Chime/GetMeeting/" + clientMeetingId;
    var response = await fetch(requestPath, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (response.status == 204) {
      setEndedMeeting(true);
    }
    else {
      const data = await response.json();
      existingMeeting = data;
      if (existingMeeting != null) {
        await joinMeeting(existingMeeting);
      }
      else {
        setEndedMeeting(true);
      }
    }
  }


  const joinMeeting = async (e: any) => {
    // e.preventDefault();
    const id = e.MeetingId.trim().toLocaleLowerCase();
    const attendeeName = "Attendee";

    if (!id) {
      if (!id) {
        setMeetingErr(true);
      }

      return;
    }
    setIsLoading(true);

    try {
      var clientId = generateString();
      var requestPath = API_BASE_URL + "Chime/CreateAttendee";
      var response = await fetch(requestPath, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "ExternalUserId": clientId,
          "MeetingId": id,
          "Tags": []
        })
      });
      const data = await response.json();
      var meetingResponse = { "meetingInfo": e, "attendeeInfo": data.Attendee };

      await meetingManager.join(meetingResponse);

      setAppMeetingInfo(id, attendeeName, region);
      history.push(routes.CUSTOMERDEVICE);
    } catch (error) {
      updateErrorMessage((error as any).message);
    }
  };

  const closeError = (): void => {
    updateErrorMessage("");
    setMeetingId("");
    setName("");
    setIsLoading(false);
  };

  const generateString = (): string => {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }


  return (
    <form>
      {/* <h3>Loading meeting...</h3> */}
      <Flex
        container
        layout="fill-space-centered"
        style={{ marginTop: "2.5rem", fontSize: '250%' }}
      >
        <Spinner />
      </Flex>
      {/* {errorMessage && (
        <Modal size="md" onClose={closeError}>
          <ModalHeader title={`Meeting ID: ${meetingId}`} />
          <ModalBody>
            <Card
              title="Unable to join meeting"
              description="There was an issue finding that meeting. The meeting may have already ended, or your authorization may have expired."
              smallText={errorMessage}
            />
          </ModalBody>
        </Modal>
      )} */}
      <DevicePermissionPrompt />
      {(endedMeeting || errorMessage) && path.pathname.includes("/customer") && (
        <Modal size="fullscreen" rootId="modal-root" dismissible={false}>
          <ModalBody>
            <Flex
              container
              layout="fill-space-centered"
              style={{ fontSize: '250%' }}
            >
              <h1>Meeting Not Found</h1>
            </Flex>
          </ModalBody>

        </Modal>
      )}
    </form>
  );
};

export default MeetingFormAttendee;

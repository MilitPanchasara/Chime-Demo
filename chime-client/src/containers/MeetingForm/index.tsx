// Copyright 2020-2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import '../../styles.css'
import React, { useState, useContext, ChangeEvent, ReactElement, useEffect } from "react";
import { useHistory } from "react-router-dom";
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

const MeetingForm: React.FC = () => {
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
  // const tableRowsDefault: ReactElement<any, any>[] = [];
  const [tableRows, setTableRows] = useState(([] as any[]));

  var existingMeetings:any;

  useEffect(() => {
    let isMounted = true;               // note mutable flag
    getAllMeetings().then(data => {
      setTableRows([]);
      if (isMounted) {
        setTableRows(data);
      }    // add conditional check
    })
    return () => { isMounted = false }; // cleanup toggles value, if unmounted
  }, []);

  const getAllMeetings = async () => {
    var requestPath = API_BASE_URL + "Chime/GetAllMeetings";
    var response = await fetch(requestPath, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    existingMeetings = data;
    for (const [key, value] of Object.entries(existingMeetings)) {

      var sTime = existingMeetings[key].StartTime;
      var eTime = existingMeetings[key].EndTime;
      // var rows = [];

      tableRows.push(<tr key={key}>
        <td>
          <a style={{'color': 'blue', cursor:'pointer'}} onClick={() => {joinMeeting(key)}} >{key}</a>
        </td>
        <td>{sTime}</td><td>{eTime}</td><td>{eTime == null ? "No" : "Yes"}</td>
      </tr>);
    }
    return tableRows;
    // setTableRows(data);

  }


  const createMeeting = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      var clientId = generateString();
      var requestPath = API_BASE_URL + "Chime/CreateMeeting";
      var response = await fetch(requestPath, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "ClientRequestToken": generateString(),
          "MediaRegion": "ap-southeast-1",
          "ExternalMeetingId": generateString(),
          "Attendees": [
            {
              "ExternalUserId": clientId
            }
          ]
        })
      });
      const data = await response.json();
      var meetingId = data.Meeting.MeetingId;
      setMeetingId(meetingId);
      alert("MEETING ID:" + meetingId);
      var meetingResponse = { "meetingInfo": data.Meeting, "attendeeInfo": data.Attendees[0] };

      await meetingManager.join(meetingResponse);

      setAppMeetingInfo(meetingId, "Host", region);
      window.location.reload();
    } catch (error) {
      updateErrorMessage((error as any).message);
    }
  };

  const joinMeeting = async (e: any) => {
    // e.preventDefault();
    var meetingObj = existingMeetings[e];
    const id = meetingObj.MeetingId.trim().toLocaleLowerCase();
    const attendeeName = "Host";

    if (!id) {
      if (!id) {
        setMeetingErr(true);
      }

      return;
    }

    setIsLoading(true);
    meetingManager.getAttendee = createGetAttendeeCallback(id);

    try {
      // var clientId = generateString();

      // var meetingRequestPath = "https://localhost:44325/api/Chime/GetMeeting";
      // var meetingRes = await fetch(meetingRequestPath, {
      //   method: "POST",
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({
      //     "MeetingId": id
      //   })
      // });
      // const meetingData = await meetingRes.json();


      // var requestPath = "https://localhost:44325/api/Chime/CreateAttendee";
      // var response = await fetch(requestPath, {
      //   method: "POST",
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({
      //     "ExternalUserId": clientId,
      //     "MeetingId": id,
      //     "Tags": []
      //   })
      // });
      // const data = await response.json();
      var meetingResponse = { "meetingInfo": meetingObj.Meeting, "attendeeInfo": meetingObj.Attendee };

      await meetingManager.join(meetingResponse);

      setAppMeetingInfo(id, attendeeName, region);
      history.push(routes.DEVICE);

      // history.push(routes.DEVICE);
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

      {/* <FormField
        field={Input}
        label="Meeting Id"
        value={meetingId}
        infoText="Anyone with access to the meeting ID can join"
        fieldProps={{
          name: "meetingId",
          placeholder: "Enter Meeting Id"
        }}
        errorText="Please enter a valid meeting ID"
        error={meetingErr}
        onChange={(e: ChangeEvent<HTMLInputElement>): void => {
          setMeetingId(e.target.value);
          if (meetingErr) {
            setMeetingErr(false);
          }
        }}
      />
      <Flex
        container
        layout="fill-space-centered"
        style={{ marginTop: "2.5rem" }}
      >
        {isLoading ? (
          <Spinner />
        ) : (
          <PrimaryButton label="Join meeting" onClick={joinMeeting} />
        )}
      </Flex>
      <hr /> */}
      <Flex
        container
        layout="fill-space-centered"
        style={{ marginTop: "2.5rem" }}
      >
        {isLoading ? (
          <Spinner />
        ) : (
          <PrimaryButton label="Create meeting" onClick={createMeeting} />
        )}
      </Flex>

      <table id="meetings-table">
        <thead>
          <tr>
            <th>
              Meeting Id
            </th>
            <th>
              Start Time
            </th>
            <th>
              End Time
            </th>
            <th>
              Staff engaged
            </th>
          </tr>
        </thead>
        <tbody>
          {tableRows}
        </tbody>

      </table>

      {errorMessage && (
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
      )}
      <DevicePermissionPrompt />
    </form>
  );
};

export default MeetingForm;

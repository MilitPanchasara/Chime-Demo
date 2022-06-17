// Copyright 2020-2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { API_BASE_URL } from '../constants';
import routes from '../constants/routes';

export const BASE_URL = routes.HOME;

interface MeetingResponse {
  JoinInfo: {
    Attendee: any;
    Meeting: any;
  };
}

export async function fetchMeeting(
  meetingId: string,
  name: string,
  region: string
): Promise<MeetingResponse> {
  const response = await fetch(
    `${BASE_URL}join?title=${encodeURIComponent(
      meetingId
    )}&name=${encodeURIComponent(name)}${region ? `&region=${encodeURIComponent(region)}` : ''
    }`,
    {
      method: 'POST'
    }
  );
  const data = await response.json();

  if (data.error) {
    throw new Error(`Server error: ${data.error}`);
  }

  return data;
}

export function createGetAttendeeCallback(meetingId: string) {
  return async (chimeAttendeeId: string, externalUserId?: string) => {
    const attendeeUrl = `${BASE_URL}attendee?title=${encodeURIComponent(
      meetingId
    )}&attendee=${encodeURIComponent(chimeAttendeeId)}`;
    const res = await fetch(attendeeUrl, {
      method: 'GET'
    });

    if (!res.ok) {
      throw new Error('Invalid server response');
    }

    const data = await res.json();

    return {
      name: data.AttendeeInfo.Name
    };
  };
}

export async function endMeeting(meetingId: string) {
  var requestPath = API_BASE_URL + "Chime/DeleteMeeting";
  console.log(meetingId)
  var response = await fetch(requestPath, {
    method: "DELETE",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "MeetingId": meetingId
    })
  });

  if (!response.ok) {
    throw new Error('Ending meeting');
  }
}

using Amazon.Chime.Model;
using Chime.HelperService;
using Chime.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace Chime.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChimeController : ControllerBase
    {
        private readonly IChimeClientService _chimeClientService;
        public ChimeController(IChimeClientService chimeClientService)
        {
            _chimeClientService = chimeClientService;
        }

        [HttpPost("CreateMeeting")]
        public async Task<ActionResult> CreateMeeting(CreateMeetingWithAttendeesRequest request)
        {
            try
            {
                var chime = _chimeClientService.GetChimeClient();
                var meeting = await chime.CreateMeetingWithAttendeesAsync(request);
                if(meeting.HttpStatusCode == HttpStatusCode.Created)
                {
                    Startup.meetingIdSeed++;
                    var meetingNo = Startup.meetingIdSeed;
                    var meetingListDTO = new MeetingsListDTO()
                    {
                        MeetingId = meeting.Meeting.MeetingId,
                        StartTime = DateTime.Now,
                        Attendee = meeting.Attendees.FirstOrDefault(),
                        Meeting = meeting.Meeting
                    };
                    Startup.meetingsDictionary.Add(meetingNo.ToString(), meetingListDTO);
                }
                return Ok(meeting);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetMeeting/{id}")]
        public async Task<ActionResult> GetMeeting(int id)
        {
            try
            {
                var meetingData = Startup.meetingsDictionary[id.ToString()];
                return Ok(meetingData.Meeting);

            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpDelete("DeleteMeeting")]
        public async Task<ActionResult> DeleteMeeting(DeleteMeetingRequest request)
        {
            try
            {
                var chime = _chimeClientService.GetChimeClient();
                var meetingResponse = await chime.DeleteMeetingAsync(request);
                if(meetingResponse.HttpStatusCode == HttpStatusCode.NoContent)
                {
                    var meetingPair = Startup.meetingsDictionary.FirstOrDefault(x => x.Value.MeetingId == request.MeetingId);
                    if (!meetingPair.Equals(new KeyValuePair<string, MeetingsListDTO>()))
                    {
                        var meetingIndex = meetingPair.Key;
                        Startup.meetingsDictionary[meetingIndex].EndTime = DateTime.Now;
                        Startup.meetingsDictionary[meetingIndex].Meeting = null;
                        Startup.meetingsDictionary[meetingIndex].Attendee = null;
                    }
                }
                return Ok(meetingResponse);

            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpPost("CreateAttendee")]
        public async Task<ActionResult> CreateAttendee(CreateAttendeeRequest request)
        {
            try
            {
                var chime = _chimeClientService.GetChimeClient();
                var attendeeResponse = await chime.CreateAttendeeAsync(request);
                return Ok(attendeeResponse);

            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpGet("GetAllMeetings")]
        public async Task<ActionResult> GetAllMeetings()
        {
            try
            {
                return Ok(Startup.meetingsDictionary);
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

    }
}

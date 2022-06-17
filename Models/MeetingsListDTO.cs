using Amazon.Chime.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Chime.Models
{
    public class MeetingsListDTO
    {
        public string MeetingId { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public Attendee? Attendee { get; set; }
        public Meeting? Meeting { get; set; }
    }
}

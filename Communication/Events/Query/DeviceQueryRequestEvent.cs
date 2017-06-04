using System;
using System.ComponentModel;
using Communication.Attributes;

namespace Communication.Events
{

    public class DeviceQueryRequestEvent : IRequestEventDefinition
    {
        public RequestEventType EventType { get; set; }
        public string Id { get; set; }
        public string Domain { get; set; }
        public string User { get; set; }

        public DeviceQueryRequestEvent(RequestEventType type, string id)
        {
            EventType = type;
            Id = id;
        }
    }
}
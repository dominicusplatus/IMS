using System;
namespace Communication.Events
{
    public class DeviceQueryRequestEvent : IRequestEventDefinition
    {
        public RequestEventType EventType { get; set; }
        public string Id { get; set; }

        public DeviceQueryRequestEvent(RequestEventType type, string id)
        {
            EventType = type;
            Id = id;
        }
    }
}
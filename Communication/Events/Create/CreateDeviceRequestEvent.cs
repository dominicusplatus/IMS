using System;
namespace Communication.Events.Create
{
	public class CreateDeviceRequestEvent : IRequestEventDefinition
	{
		public RequestEventType EventType { get; set; }
		public string Id { get; set; }
        public string Domain { get; set; }
        public string User { get; set; }

        public CreateDeviceRequestEvent(RequestEventType type, string id)
		{
			EventType = type;
			Id = id;
		}
	}

}

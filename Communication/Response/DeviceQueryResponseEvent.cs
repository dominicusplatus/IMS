﻿using System;
using Communication.Events.Query;

namespace Communication.Response
{
    public class DeviceQueryResponseEvent : IResponseEventDefinition
	{
		public ResponseEventType EventType { get; set; }
		public string Id { get; set; }
        public string Domain { get; set; }
        public string User { get; set; }

        public DeviceQueryResponseEvent(ResponseEventType type, string id)
		{
			EventType = type;
			Id = id;
		}
	}

}

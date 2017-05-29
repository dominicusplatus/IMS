using System;
using Communication.Events;

namespace Communication.Attributes
{
    [AttributeUsage(AttributeTargets.Class, AllowMultiple = true)]
    public class EventSubscriberAttribute : System.Attribute
	{
        /*
        private RequestEventType _eventType;
		public RequestEventType EventType       
		{
			get
			{
				return _eventType;
			}
			set
			{

				_eventType = value;
			}
		}
		*/

        public RequestEventType EventType;

        public EventSubscriberAttribute(RequestEventType eventType)
        {
            EventType = eventType;
        }
    }
}
    
using System;
namespace Communication.Events
{

    public class RequestEventArgs<TIn, TOut> : EventArgs
    {
        public string RequestId
        {
            get;
            set;
        }

        public TIn QueryArgs
        {
            get;
            set;
        }

        public TOut ResultArgs
        {
            get;
            set;
        }
    }

    public interface IUserEvent
    {
        string Domain { get; set; }

		string User { get; set; }
    }

    public interface IConcreteUserEvent : IUserEvent
    {
		 int EventType { get; set; }

		 object Payload { get; set; }
    }

    public class BaseUserEvent : IConcreteUserEvent
	{
		public string Domain { get; set; }

		public string User { get; set; }

        public int EventType { get; set; }

        public object Payload { get; set; }
	}

}

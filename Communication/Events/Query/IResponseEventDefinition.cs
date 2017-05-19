using System;
namespace Communication.Events.Query
{
	public enum ResponseEventType
	{
		QueryDeviceResponseStarted = 1,
		QueryDeviceResponseReady,
		QueryDeviceResponseError
	}

	public interface IResponseEventDefinition
	{
		ResponseEventType EventType
		{
			get;
			set;
		}

		string Id
		{
			get;
			set;
		}
	}

}

using System;
namespace Communication.Events.Query
{
	public enum ResponseEventType
	{
		QueryDeviceResponseStarted = 1,
		QueryDeviceResponseReady,
		QueryDeviceResponseError,
		UpdateDeviceResponseStarted,
		UpdateDeviceResponseReady,
		UpdateDeviceResponseError,

        GenericResponseStarted,
        GenericResponseError,
        GenericResponseReady,
	}

    public interface IResponseEventDefinition : IUserEvent
	{
		ResponseEventType EventType { get; set; }

		string Id { get; set; }

	}

}

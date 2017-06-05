using System;
namespace Communication.Events.Query
{
	public enum ResponseEventType
	{
		QueryDeviceResponseStarted = 1,
		QueryDeviceResponseReady,
		QueryDeviceResponseError,

		QueryDeviceByIdResponseStarted,
		QueryDeviceByIdResponseReady,
		QueryDeviceByIdResponseError,

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

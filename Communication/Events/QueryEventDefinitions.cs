using System;
namespace Communication.Events
{
    public enum RequestEventType
    {
        QueryDeviceRequestStarted = 1,
        QueryDeviceResponseReady,
        QueryDeviceResponseError,

		QueryDeviceByIdRequestStarted,
		QueryDeviceByIdResponseReady,
		QueryDeviceByIdResponseError,

        UpdateDeviceRequestStarted,
        UpdateDeviceRequestReady,
        UpdateDeviceRequestError
    }

    public interface IEventDefinition 
    {
		RequestEventType EventType { get; set; }

		string Id { get; set; }
	}

    public interface IRequestEventDefinition  : IUserEvent       
    {
		RequestEventType EventType { get; set; }

		string Id { get; set; }
	}




}

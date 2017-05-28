using System;
namespace Communication.Events
{
    public enum RequestEventType
    {
        QueryDeviceRequestStarted = 1,
        QueryDeviceResponseReady,
        QueryDeviceResponseError,
        UpdateDeviceRequestStarted,
        UpdateDeviceRequestReady,
        UpdateDeviceRequestError
    }

    public interface IRequestEventDefinition              
    {
        RequestEventType EventType
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

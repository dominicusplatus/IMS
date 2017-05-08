using System;
namespace Communication.Events
{
    public enum RequestEventType
    {
        QueryDeviceRequestStarted = 1,
        QueryDeviceResponseReady,
        QueryDeviceResponseError
    }

    public interface IRequestEventDefinition              
    {
        int EventType
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

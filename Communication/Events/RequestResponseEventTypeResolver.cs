﻿using System;
using Communication.Events.Query;

namespace Communication.Events
{
    public static class RequestResponseEventTypeResolver
    {
        public static ResponseEventType GetResponseTypeForRequest(RequestEventType requestType){
            if(requestType == RequestEventType.QueryDeviceRequestStarted){
                return ResponseEventType.QueryDeviceResponseReady;
            }else if (requestType == RequestEventType.UpdateDeviceRequestStarted){
                return ResponseEventType.UpdateDeviceResponseReady;
            }
            return ResponseEventType.GenericResponseReady;
        }
    }
}

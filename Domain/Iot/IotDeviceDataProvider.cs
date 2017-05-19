using System;
using Communication.Requests;
using Communication.Routing;
using Core.Results;
using Core.POCO.Device;
using Communication.Response;
using Communication.Events.Query;
using Communication.Events;

namespace Domain.Iot
{
    public class IotDeviceDataProvider : IConcreteRequestResponseProvider
    {
        private IConcreteRequestEventRouter _router;
        private IConcreteResponseEventRouter _responseRouter;

        public IotDeviceDataProvider()
        {

        }

        public IotDeviceDataProvider(IConcreteRequestEventRouter requestrouter, IConcreteResponseEventRouter responserouter)
        {
            _router = requestrouter;
            _responseRouter = responserouter;
            _router.Subscribe(RequestEventType.QueryDeviceRequestStarted,this);
        }

        public void OnCompleted()
        {
          
        }

        public void OnError(Exception error)
        {
           
        }

        public void OnNext(IConcreteRequest value)
        {
            if(value!=null){
                var result = new DeviceQueryResult();
                result.Device = new IotDevice();
                result.Device.Name = Guid.NewGuid().ToString();

                IConcreteResponse queryResponse = new ConcreteDataQueryResponse();
                queryResponse.RequestEventDefinition = value.EventDefinition;
                queryResponse.Id = Guid.NewGuid().ToString();
                queryResponse.ResponseEventDefinition = new DeviceQueryResponseEvent(ResponseEventType.QueryDeviceResponseReady,Guid.NewGuid().ToString());
                queryResponse.Result = result;
                _responseRouter.Publish(queryResponse);

            }
        }
    }
}

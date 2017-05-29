using System;
using Communication.Requests;
using Communication.Routing;
using Core.Results;
using Core.POCO.Device;
using Communication.Response;
using Communication.Events.Query;
using Communication.Events;
using IotRepository;
using DAL.Repository;
using Communication.Attributes;

namespace IotDomain.Iot
{
    
	[EventSubscriber(RequestEventType.QueryDeviceRequestStarted)]
    public class IotDeviceDataProvider : IConcreteRequestResponseProvider
    {
        private IConcreteRequestEventRouter _router;
        private IConcreteResponseEventRouter _responseRouter;
        private IIotRepository _repository;

        public IotDeviceDataProvider(IConcreteRequestEventRouter requestrouter, 
                                     IConcreteResponseEventRouter responserouter,
                                     IIotRepository repository)
        {
            _router = requestrouter;
            _responseRouter = responserouter;
            _repository = repository;
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
                var result = new DevicesQueryResult();
                result.Devices = _repository.GetAll<IotDevice>().Result.Entities;

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

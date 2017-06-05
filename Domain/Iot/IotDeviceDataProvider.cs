using System;
using Communication.Requests;
using Communication.Routing;
using Core.Results;
using Core.POCO.Device;
using Communication.Response;
using Communication.Events.Query;
using Communication.Events;
using DAL.Repository;
using Communication.Attributes;
using System.Collections.Generic;

namespace IotDomain.Iot
{
    
	[EventSubscriber(RequestEventType.QueryDeviceRequestStarted)]
    [EventSubscriber(RequestEventType.QueryDeviceByIdRequestStarted)]
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

        private IEnumerable<IotDevice> GetDevices(string user)
        {
			var result = new DevicesQueryResult();
			return _repository.GetAll<IotDevice>().Result.Entities;
        }

        private IotDevice GetDeviceById(string id, string user)
        {
			return _repository.GetOne<IotDevice>(id).Result.Entity;
        }

        private void HandleGetAllEvent(IConcreteRequest request)
        {
			var result = new DevicesQueryResult();
			result.Devices = GetDevices(request.EventDefinition.User);

			IConcreteResponse queryResponse = new ConcreteDataQueryResponse();
			queryResponse.RequestEventDefinition = request.EventDefinition;
			queryResponse.Id = Guid.NewGuid().ToString();
			queryResponse.ResponseEventDefinition = new DeviceQueryResponseEvent(ResponseEventType.QueryDeviceResponseReady, Guid.NewGuid().ToString());
			queryResponse.Result = result;
			_responseRouter.Publish(queryResponse);
        }

		private void HandleGetEvent(IConcreteRequest request)
		{
			var result = new DeviceQueryResult();
			result.Device = GetDeviceById((string)request.Parameter, request.EventDefinition.User);

			IConcreteResponse queryResponse = new ConcreteDataQueryResponse();
			queryResponse.RequestEventDefinition = request.EventDefinition;
			queryResponse.Id = Guid.NewGuid().ToString();
			queryResponse.ResponseEventDefinition = new DeviceQueryResponseEvent(ResponseEventType.QueryDeviceByIdResponseReady, Guid.NewGuid().ToString());
			queryResponse.Result = result;
			_responseRouter.Publish(queryResponse);
		}

        public void OnNext(IConcreteRequest request)
        {
            if(request !=null){
                if(request.EventDefinition.EventType == RequestEventType.QueryDeviceRequestStarted){
                    HandleGetAllEvent(request);
                }
                else if(request.EventDefinition.EventType == RequestEventType.QueryDeviceByIdRequestStarted){
                    HandleGetEvent(request);
                }
            }
        }
    }
}

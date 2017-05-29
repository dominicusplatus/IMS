using System;
using Communication.Requests;
using Communication.Routing;
using Core.Results;
using Core.POCO.Device;
using Communication.Response;
using Communication.Events.Query;
using Communication.Events;
using IotRepository;
using MongoDB.Driver;
using MongoDB.Bson;
using Communication.Attributes;

namespace IotDomain.Iot
{

    [EventSubscriber(RequestEventType.UpdateDeviceRequestStarted)]
	public class IotDeviceUpdateHandler : IConcreteRequestResponseProvider
	{
		private IConcreteRequestEventRouter _router;
		private IConcreteResponseEventRouter _responseRouter;
		private IIotDeviceRepository _repository;

		public IotDeviceUpdateHandler()
		{

		}

		public IotDeviceUpdateHandler(IConcreteRequestEventRouter requestrouter, 
                                      IConcreteResponseEventRouter responserouter,
									  IIotDeviceRepository repository)
		{
			_router = requestrouter;
			_responseRouter = responserouter;
			_repository = repository;
			_router.Subscribe(RequestEventType.UpdateDeviceRequestStarted, this);
		}

		public void OnCompleted()
		{

		}

		public void OnError(Exception error)
		{

		}

		public void OnNext(IConcreteRequest value)
		{
			if (value != null)
			{
				IConcreteResponse queryResponse = new ConcreteDataQueryResponse();
				queryResponse.RequestEventDefinition = value.EventDefinition;
				queryResponse.Id = Guid.NewGuid().ToString();
				queryResponse.ResponseEventDefinition = new DeviceQueryResponseEvent(ResponseEventType.UpdateDeviceResponseStarted, Guid.NewGuid().ToString());
                queryResponse.Result = false;

                IotDevice updated = value.GetCommandParameter() as IotDevice;
                if(updated!=null){
					//var replacement = Builders<BsonDocument>.Update<IotDevice>.Replace(updated);
                    var filter = Builders<IotDevice>.Filter.Eq(s => s.Id, updated.Id);
                    var replaceResult = _repository.ReplaceOne<IotDevice>(updated.Id,filter,updated,true);
                    if(replaceResult.ModifiedCount > 0){
                        queryResponse.Result = true;
                    }
                }

				_responseRouter.Publish(queryResponse);

			}
		}
	}
}

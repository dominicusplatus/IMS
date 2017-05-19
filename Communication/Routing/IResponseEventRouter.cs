using System;
using Communication.Events;
using Communication.Events.Query;
using Communication.Requests;
using Communication.Response;

namespace Communication.Routing
{
	public interface IConcreteResponseEventRouter : IObservable<IConcreteResponse>
	{
		void Publish(IConcreteResponse response);
		bool Subscribe(ResponseEventType type, IObserver<IConcreteResponse> observer);
	}
}

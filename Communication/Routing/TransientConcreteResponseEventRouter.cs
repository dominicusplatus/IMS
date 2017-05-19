using System;
using System.Collections.Generic;
using Communication.Events;
using Communication.Events.Query;
using Communication.Response;

namespace Communication.Routing
{
    public class TransientConcreteResponseEventRouter : IConcreteResponseEventRouter
    {

		private Dictionary<ResponseEventType, List<IObserver<IConcreteResponse>>> _subscriptions;
		private List<IConcreteResponse> requests;

		public Dictionary<ResponseEventType, List<IObserver<IConcreteResponse>>> Subscriptions
		{
			get { return _subscriptions; }
			set { _subscriptions = value; }
		}

		public TransientConcreteResponseEventRouter()
		{
			_subscriptions = new Dictionary<ResponseEventType, List<IObserver<IConcreteResponse>>>();
			requests = new List<IConcreteResponse>();
		}

		public void Publish(IConcreteResponse request)
		{
			requests.Add(request);
			lock (_subscriptions)
			{
				if (request.ResponseEventDefinition != null)
				{
					var targetSubscriptions = new List<IObserver<IConcreteResponse>>();
					_subscriptions.TryGetValue(request.ResponseEventDefinition.EventType, out targetSubscriptions); 
					if (targetSubscriptions != null)
					{
						foreach (var item in targetSubscriptions)
						{
							item.OnNext(request);
						}
					}
				}
			}
		}

		public bool Subscribe(ResponseEventType type, IObserver<IConcreteResponse> observer)
		{
			List<IObserver<IConcreteResponse>> searchedSubscriptions;
			if (!(_subscriptions.TryGetValue(type, out searchedSubscriptions)))
			{
				searchedSubscriptions = new List<IObserver<IConcreteResponse>>();
				_subscriptions.Add(type, searchedSubscriptions);
				if (searchedSubscriptions != null)
				{
					if (!searchedSubscriptions.Contains(observer))
					{
						lock (searchedSubscriptions)
						{
							searchedSubscriptions.Add(observer);
						}
						return true;
					}
				}
			}
			return false;
		}

		public IDisposable Subscribe(IObserver<IConcreteResponse> observer)
		{
			return null;
		}

		public void Unsubscribe(ResponseEventType type, IObserver<IConcreteResponse> observer)
		{
			List<IObserver<IConcreteResponse>> searchedSubscriptions;
			if ((_subscriptions.TryGetValue(type, out searchedSubscriptions)))
			{
				if (searchedSubscriptions != null)
				{
					if (!searchedSubscriptions.Contains(observer))
					{
						lock (searchedSubscriptions)
						{
							searchedSubscriptions.Remove(observer);
						}
					}
				}
			}
		}

	
    }
}

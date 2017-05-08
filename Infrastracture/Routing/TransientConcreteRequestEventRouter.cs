using System;
using System.Collections.Generic;
using Communication.Events;
using Communication.Requests;

namespace Infrastracture.Routing
{

	public class TransientConcreteRequestEventRouter: IConcreteRequestEventRouter
	{
		private Dictionary<RequestEventType, IObserver<IConcreteRequest>> _subscriptions;
        private List<IConcreteRequest> requests;

		public Dictionary<RequestEventType, IObserver<IConcreteRequest>> Subscriptions
		{
			get { return _subscriptions; }
			set { _subscriptions = value; }
		}

        public void Publish(IConcreteRequest request)
        {
            requests.Add(request);
            foreach (var subscription in _subscriptions)
            {
                if(observer.)
                observer.OnNext(request);
            }
        }

        public IDisposable Subscribe(IObserver<IConcreteRequest> observer)
		{
			// Check whether observer is already registered. If not, add it

		}

        public bool Subscribe(RequestEventType type, IObserver<IConcreteRequest> observer)
        {
            IObserver<IConcreteRequest> searchedObserver;
			if (! (_subscriptions.TryGetValue(type, out searchedObserver) && searchedObserver == observer))
			{
				_subscriptions.Add(type,observer);
                return true;
			}
            return false;
        }

        public void  Unsubscribe(RequestEventType type, IObserver<IConcreteRequest> observer)
        {
            IObserver<IConcreteRequest> searchedObserver;
			if ((_subscriptions.TryGetValue(type, out searchedObserver) && searchedObserver == observer))
			{
				//_subscriptions.Remove(searchedObserver);
			}
        }

	}

}

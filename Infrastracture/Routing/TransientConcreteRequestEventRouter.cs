﻿using System;
using System.Collections.Generic;
using System.Linq;
using Communication.Events;
using Communication.Requests;

namespace Infrastracture.Routing
{

	public class TransientConcreteRequestEventRouter: IConcreteRequestEventRouter
	{
		private Dictionary<RequestEventType, List<IObserver<IConcreteRequest>>> _subscriptions;
        private List<IConcreteRequest> requests;

		public Dictionary<RequestEventType, List<IObserver<IConcreteRequest>>> Subscriptions
		{
			get { return _subscriptions; }
			set { _subscriptions = value; }
		}

        Lookup<RequestEventType, IObserver<IConcreteRequest>> IConcreteRequestEventRouter.Subscriptions { get => throw new NotImplementedException(); set => throw new NotImplementedException(); }

        public void Publish(IConcreteRequest request)
        {
            requests.Add(request);
			lock (_subscriptions)
			{
				var targetSubscriptions = _subscriptions[request.EventDefinition.EventType];
				if (targetSubscriptions != null)
				{
					foreach (var item in targetSubscriptions)
					{
						item.OnNext(request);
					}
				}
			}

        }

        public bool Subscribe(RequestEventType type, IObserver<IConcreteRequest> observer)
        {
            List<IObserver<IConcreteRequest>> searchedSubscriptions;
			if (! (_subscriptions.TryGetValue(type, out searchedSubscriptions) ) )
			{
                searchedSubscriptions = new List<IObserver<IConcreteRequest>>();
				_subscriptions.Add(type,searchedSubscriptions);
                return true;
            }else{
                if(searchedSubscriptions !=null){
                    if(!searchedSubscriptions.Contains(observer)){
                        lock(searchedSubscriptions){
                            searchedSubscriptions.Add(observer);
                        }
                        return true;
                    }
                }
            }
            return false;
        }

        public IDisposable Subscribe(IObserver<IConcreteRequest> observer)
        {
            return null;
        }

        public void Unsubscribe(RequestEventType type, IObserver<IConcreteRequest> observer)
        {
            List<IObserver<IConcreteRequest>> searchedSubscriptions;
            if ((_subscriptions.TryGetValue(type, out searchedSubscriptions)))
            {
                if (searchedSubscriptions != null)
                {
                    if (!searchedSubscriptions.Contains(observer))
                    {
                        lock(searchedSubscriptions){
                            searchedSubscriptions.Remove(observer);
                        }
                    }
                }
            }
        }
	
    }

}

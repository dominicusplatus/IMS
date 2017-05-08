using System;
using System.Collections.Generic;
using Communication.Events;
using Communication.Requests;

namespace Infrastracture.Routing
{
    public interface IConcreteRequestEventRouter : IObservable<IConcreteRequest>
    {
        Dictionary<RequestEventType,IObserver<IConcreteRequest>> Subscriptions { get; set; }
        void Publish(IConcreteRequest request);
        bool Subscribe(RequestEventType type, IObserver<IConcreteRequest> observer);
    }

}
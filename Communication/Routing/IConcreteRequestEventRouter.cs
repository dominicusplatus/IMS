using System;
using System.Collections.Generic;
using System.Linq;
using Communication.Events;
using Communication.Requests;

namespace Communication.Routing
{
    public interface IConcreteRequestEventRouter : IObservable<object>
    {
        void Publish(IConcreteRequest request);
        void Reply(RequestEventType type, string Id, object response);
        bool Subscribe(RequestEventType type, IObserver<IConcreteRequest> observer);
    }

}
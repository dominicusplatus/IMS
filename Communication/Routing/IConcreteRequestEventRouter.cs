using System;
using System.Collections.Generic;
using System.Linq;
using Communication.Events;
using Communication.Requests;

namespace Communication.Routing
{
    public interface IConcreteRequestEventRouter : IObservable<IConcreteRequest>
    {
        void Publish(IConcreteRequest request);
        bool Subscribe(RequestEventType type, IObserver<IConcreteRequest> observer);
    }

}
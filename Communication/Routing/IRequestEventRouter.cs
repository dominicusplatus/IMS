using System;
using System.Collections.Generic;

namespace Communication.Routing
{
    public interface IRequestEventRouter<TIn> : IObservable<TIn>
    {
        List<IObserver<TIn>> Observers { get; set; }
    }
}

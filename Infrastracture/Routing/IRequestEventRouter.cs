using System;
using System.Collections.Generic;

namespace Infrastracture.Routing
{
    public interface IRequestEventRouter<TIn> : IObservable<TIn>
    {
        List<IObserver<TIn>> Observers { get; set; }
    }
}

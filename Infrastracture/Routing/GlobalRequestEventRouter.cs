using System;
using System.Collections.Generic;

namespace Infrastracture.Routing
{
    public class GlobalRequestEventRouter<TIn, TOut> : IRequestEventRouter<TIn>
    {
        private List<IObserver<TIn>> observers;

        public List<IObserver<TIn>> Observers { 
            get { return observers; }
            set { observers=value; }
        }

        public IDisposable Subscribe(IObserver<TIn> observer)
        {
			// Check whether observer is already registered. If not, add it
			if (!observers.Contains(observer))
			{
				observers.Add(observer);
			}
			return new Unsubscriber<TIn>(observers, observer);
        }

		internal class Unsubscriber<TIn> : IDisposable
		{
			private List<IObserver<TIn>> _observers;
			private IObserver<TIn> _observer;

			internal Unsubscriber(List<IObserver<TIn>> observers, IObserver<TIn> observer)
			{
				this._observers = observers;
				this._observer = observer;
			}

			public void Dispose()
			{
				if (_observers.Contains(_observer))
					_observers.Remove(_observer);
			}
		}

    }
}

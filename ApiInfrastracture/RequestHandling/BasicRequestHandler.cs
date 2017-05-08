using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Communication.Requests;
using Infrastracture.Routing;

namespace ApiInfrastracture.RequestHandling
{

	public interface IConcreteRequestHandler  : IObserver<IConcreteRequest>
	{
		object HandleRequest(IConcreteRequest request);
		Task<object> HandleRequestAsync(IConcreteRequest request);
	}

	public class RequestTimedOutEventArgs : EventArgs
	{
        private Action<object, RequestTimedOutEventArgs> requestTimedOut;

        public RequestTimedOutEventArgs(Action<object, RequestTimedOutEventArgs> requestTimedOut)
        {
            this.requestTimedOut = requestTimedOut;
        }

		public RequestTimedOutEventArgs(Action<object, RequestTimedOutEventArgs> requestTimedOut, string reqId)
		{
			this.requestTimedOut = requestTimedOut;
            RequestId = reqId;
		}

        public string RequestId
		{
			get;
			set;
		}

	}

    public class BasicRequestHandler : IConcreteRequestHandler
    {
        private IConcreteRequestEventRouter _router;
        private List<IConcreteRequest> _requests;
        private List<Timer> _timers;
        private Timer _timer;

        public BasicRequestHandler(IConcreteRequestEventRouter router)
        {
            _router = router;
        }

        public object HandleRequest(IConcreteRequest request)
        {
            _router.Publish(request);
            _requests.Add(request);
			Timer t = new Timer();
			t.Interval = request.Lifetime; 
			t.AutoReset = true; 
			t.Elapsed += new RequestTimedOutEventArgs(RequestTimedOut,request.Id);
            _timers.Add(t);
			t.Start();


        }

        public Task<object> HandleRequestAsync(IConcreteRequest request)
        {
            throw new NotImplementedException();
        }

        public void OnCompleted()
        {
            
        }

        public void OnError(Exception error)
        {
            
        }

        public void OnNext(IConcreteRequest value)
        {
           
        }

        void RequestTimedOut(object sender, RequestTimedOutEventArgs e)
		{
            _requests.Remove(_requests.FirstOrDefault(r=>r.Id == e.RequestId));
		}

    }
}

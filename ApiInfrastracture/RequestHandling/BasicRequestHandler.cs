using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ApiInfrastracture.Results;
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

	public class RequestTimedOutArgs 
	{

		public RequestTimedOutArgs(string reqId)
		{
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

        public BasicRequestHandler(IConcreteRequestEventRouter router)
        {
            _router = router;
            _requests = new List<IConcreteRequest>();
            _timers = new List<Timer>();
        }

        public object HandleRequest(IConcreteRequest request)
        {
            _router.Publish(request);
            _requests.Add(request);
			var autoEvent = new AutoResetEvent(false);
			Timer t = new Timer(RequestTimedOut,new RequestTimedOutArgs(request.Id),request.Lifetime, Timeout.Infinite);
			autoEvent.WaitOne();
            return new RequestFailedQueryResult(){ Description = "", ErrorCode = 500 };
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

        void RequestTimedOut(Object stateInfo)
		{
            //object sender, RequestTimedOutEventArgs e
            RequestTimedOutArgs args = (RequestTimedOutArgs)stateInfo;
			_requests.Remove(_requests.FirstOrDefault(r=>r.Id == args.RequestId));
		}

    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading;
using System.Threading.Tasks;
using ApiInfrastracture.Results;
using Communication.Events.Query;
using Communication.Requests;
using Communication.Response;
using Communication.Routing;

namespace ApiInfrastracture.RequestHandling
{

    public interface IConcreteRequestHandler  : IObserver<IConcreteResponse>
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

    public class TransientRequestState
    {
        public string Id{ get; set; }
        public IConcreteRequest Request { get; set; }
        public AutoResetEvent ResetTimeout { get; set; }
        public object Response { get; set; }

        public TransientRequestState(IConcreteRequest request, AutoResetEvent resetevent)
        {
            Request = request;
            ResetTimeout = resetevent;
        }
    }


    public class BasicRequestHandler : IConcreteRequestHandler
    {
        private IConcreteRequestEventRouter _router;
        private IConcreteResponseEventRouter _responseRouter;
        private List<TransientRequestState> _requestStates;
        private IConcreteRequestResponseProvider _responseProvider;

        public BasicRequestHandler(IConcreteRequestEventRouter router, 
                                   IConcreteResponseEventRouter responseRouter,
                                   IConcreteRequestResponseProvider responseProvider
                                  )
        {
            _router = router;
            _responseRouter = responseRouter;
			_requestStates = new List<TransientRequestState>();
            _responseProvider = responseProvider;
			_responseRouter.Subscribe(ResponseEventType.QueryDeviceResponseReady, this );
        }

        public object HandleRequest(IConcreteRequest request)
        {
            var autoEvent = new AutoResetEvent(false);
            TransientRequestState state = new TransientRequestState(request,autoEvent);
            _requestStates.Add(state);

			_router.Publish(request);

            var processed = autoEvent.WaitOne(request.Lifetime);
            if(state.Response != null){
                return state.Response;
            } 
            return new RequestFailedQueryResult(){ Description = "", ErrorCode = 500 };
        }

        public Task<object> HandleRequestAsync(IConcreteRequest request)
        {
            throw new NotImplementedException();
        }

        public void OnRequestProcessed(object result)
        {
            
        }

        public void FinishProcessingRequest(object response)
        {
            if( response.GetType().GetInterfaces().Contains(typeof(IConcreteResponse)) )
            {
                var eventResponse = (IConcreteResponse)response;
				var adjacentRequest = _requestStates.FirstOrDefault(r => r.Request.EventDefinition.Id == eventResponse.RequestEventDefinition.Id);
				if (adjacentRequest != null)
				{
					adjacentRequest.Response = eventResponse;
					var requestTimer = adjacentRequest?.ResetTimeout;
					if (requestTimer != null)
					{
						requestTimer.Set();
					}
				}

            }
            else if (response.GetType() == typeof(RequestTimedOutArgs))
			{
				var timeoutResponse = (RequestTimedOutArgs)response;
				var adjacentRequest = _requestStates.FirstOrDefault(r => r.Request.Id == timeoutResponse.RequestId);
                if (adjacentRequest != null)
                {
					var requestTimer = adjacentRequest?.ResetTimeout;
					if (requestTimer != null)
					{
						requestTimer.Set();
					}
                }
            }

        }

        void RequestTimedOut(Object stateInfo)
        {
            RequestTimedOutArgs args = (RequestTimedOutArgs)stateInfo;
            FinishProcessingRequest(stateInfo);
        }

        public void OnCompleted()
        {
			//TODO
        }

        public void OnNext(IConcreteResponse value)
        {
			FinishProcessingRequest(value);
        }

        public void OnError(Exception error)
        {
           
        }
    }
}

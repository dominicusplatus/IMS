using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ApiInfrastracture.Results;
using Communication.Requests;
using Communication.Routing;

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
        private List<TransientRequestState> _requestStates;

        public BasicRequestHandler(IConcreteRequestEventRouter router)
        {
            _router = router;
            _requestStates = new List<TransientRequestState>();
        }

        public object HandleRequest(IConcreteRequest request)
        {
            _router.Publish(request);
            var autoEvent = new AutoResetEvent(false);
            //Timer t = new Timer(RequestTimedOut,new RequestTimedOutArgs(request.Id),request.Lifetime, Timeout.Infinite);
            TransientRequestState state = new TransientRequestState(request,autoEvent);
            _requestStates.Add(state);
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

        public void FinishProcessingRequest(object request)
        {
            var requestTimer = _requestStates.FirstOrDefault().ResetTimeout;
            if (requestTimer != null)
            {
                requestTimer.Set();
                //requestTimer.Change(0, 0);
            }  
        }

        public void OnCompleted(object request)
        {
            FinishProcessingRequest(request);

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
           // _requests.Remove(_requests.FirstOrDefault(r=>r.Id == args.RequestId));
            FinishProcessingRequest(stateInfo);
        }

        public void OnCompleted()
        {
            throw new NotImplementedException();
        }
    }
}

using System;
namespace Communication.Events
{

    public class RequestEventArgs<TIn, TOut> : EventArgs
    {
        public string RequestId
        {
            get;
            set;
        }

        public TIn QueryArgs
        {
            get;
            set;
        }

        public TOut ResultArgs
        {
            get;
            set;
        }
    }

    public interface IRequestEvent
    {
        
    }
}

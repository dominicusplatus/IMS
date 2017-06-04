using System;
using Communication.Events;
using Communication.Events.Query;

namespace Communication.Response
{
    public class ConcreteDataQueryResponse : IConcreteResponse
    {
		public string Id { get; set; }  
		public object Result { get; set; } 
		public int Lifetime { get; set; }
		public object Prototype { get; set; }
        public IRequestEventDefinition RequestEventDefinition { get; set; }
        public IResponseEventDefinition ResponseEventDefinition { get; set; }
    }
}

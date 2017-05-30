using System;
using System.Collections.Generic;
using System.Text;
using Communication.Events;
using Communication.Queries;

namespace Communication.Requests
{
    public class DataQueryRequest<TPin, TPout> : IRequest<TPin, TPout>
    {
        public string Id { get; set; }
        public string Message { get; set; }
        public int Lifetime { get; set; }
        public bool ExceptsResults { get; set; }

        public IDataQuery<TPin> GetCommandParameter()
        {
            throw new NotImplementedException();
        }

        public void SetExpectedPrototype(TPout prototype)
        {
           
        }
    }

	public class ConcreteDataQueryRequest: IConcreteRequest
	{
		public string Id { get; set; }
		public string Message { get; set; }
		public int Lifetime { get; set; }
		public bool ExceptsResults { get; set; }
        public object Parameter { get; set; }
        public IRequestEventDefinition EventDefinition { get; set; }
        public IConcreteDataQuery DataQuery { get; set; }
        public object Prototype  { get;  set; }

		public void SetExpectedPrototype(object prototype)
		{
            Prototype = prototype;
		}
	}


}

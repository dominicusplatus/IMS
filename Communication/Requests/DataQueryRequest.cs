using System;
using System.Collections.Generic;
using System.Text;
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
            throw new NotImplementedException();
        }
    }

	public class ConcreteDataQueryRequest: IConcreteRequest
	{
		public string Id { get; set; }
		public string Message { get; set; }
		public int Lifetime { get; set; }
		public bool ExceptsResults { get; set; }

		public IConcreteDataQuery GetCommandParameter()
		{
			throw new NotImplementedException();
		}

		public void SetExpectedPrototype(object prototype)
		{
			throw new NotImplementedException();
		}
	}


}

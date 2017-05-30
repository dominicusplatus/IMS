using System;
using System.Collections.Generic;
using System.Text;
using Communication.Events;
using Communication.Queries;

namespace Communication.Requests
{
    public interface IRequest<TPin, TPout>
    {
        string Id { get; set; }
        string Message { get; set; }
        int Lifetime { get; set; }
        bool ExceptsResults { get; set; }
        IDataQuery<TPin> GetCommandParameter();
        void SetExpectedPrototype(TPout prototype);
    }

	public interface IConcreteRequest
	{
		string Id { get; set; }
		string Message { get; set; }
		int Lifetime { get; set; }
        object Parameter { get; set; }
        IRequestEventDefinition EventDefinition { get; set; }
		bool ExceptsResults { get; set; }
		void SetExpectedPrototype(object prototype);
	}
}

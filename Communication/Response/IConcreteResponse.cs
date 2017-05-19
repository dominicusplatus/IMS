using System;
using Communication.Events;
using Communication.Events.Query;

namespace Communication.Response
{
    public interface IConcreteResponse
    {
		string Id { get; set; }
		object Result { get; set; }
		int Lifetime { get; set; }
		IRequestEventDefinition RequestEventDefinition { get; set; }
        IResponseEventDefinition ResponseEventDefinition { get; set; }
		bool ExceptsResults { get; set; }
		object GetExpectedPrototype();
    }

}

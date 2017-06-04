using System;
using Communication.Events;
using Communication.Events.Query;

namespace Communication.Response
{
    public interface IConcreteResponse
    {
		string Id { get; set; }
		object Result { get; set; }
        object Prototype { get; set; }
		int Lifetime { get; set; }
		IRequestEventDefinition RequestEventDefinition { get; set; }
        IResponseEventDefinition ResponseEventDefinition { get; set; }
    }

}

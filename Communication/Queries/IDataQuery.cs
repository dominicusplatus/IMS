using System;
using System.Collections.Generic;
using System.Text;

namespace Communication.Queries
{
    public interface IDataQuery<TIn>
    {
        int Limit { get; set; }
        int Timeout { get; set; }
    }

	public interface IConcreteDataQuery
	{
		int Limit { get; set; }
		int Timeout { get; set; }
	}

}

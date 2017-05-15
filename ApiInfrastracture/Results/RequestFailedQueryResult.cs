using System;
namespace ApiInfrastracture.Results
{
    public class RequestFailedQueryResult
    {
        public string Description
        {
            get;
            set;
        }


        public int ErrorCode
        {
            get;
            set;
        }
    }
}

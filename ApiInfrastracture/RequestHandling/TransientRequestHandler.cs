using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Input;
using ApiInfrastracture.Results;
using Communication.Requests;

namespace ApiInfrastracture.RequestHandling
{
    public class TransientRequestHandler<TPin, TPout> : IRequestHandler<TPin, TPout>
    {

        public TPout HandleRequest(IRequest<TPin, TPout> request)
        {
            return default(TPout);
        }

        public Task<TPout> HandleRequestAsync(IRequest<TPin, TPout> request)
        {
            return null;
        }
    }
}

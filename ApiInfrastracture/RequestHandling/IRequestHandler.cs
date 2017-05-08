using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Input;
using Communication.Requests;

namespace ApiInfrastracture.RequestHandling
{
    public interface IRequestHandler<TPin,TPout>
    {
        TPout HandleRequest(IRequest<TPin,TPout> request);
        Task<TPout> HandleRequestAsync(IRequest<TPin,TPout> request);
    }
}

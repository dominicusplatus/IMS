using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ApiInfrastracture.RequestHandling;
using ApiInfrastracture.Results;
using Communication.Queries;
using Communication.Requests;
using Core.POCO.Device;
using Microsoft.AspNetCore.Mvc;

namespace senseGridApp.Controllers
{
    [Route("api/[controller]")]
    public class DeviceController : Controller
    {
        private IRequestHandler<IDeviceQuery<IotDevice>,  IDeviceQueryResult> _handler;
        private IConcreteRequestHandler _concreteHandler;

        public DeviceController()
        {
            //_handler = new TransientRequestHandler<IDeviceQuery<IotDevice>, IDeviceQueryResult>();
           // _concreteHandler = new BasicRequestHandler(new TransientConcreteRequestEventRouter());
        }

        public DeviceController(
            IRequestHandler<IDeviceQuery<IotDevice>, IDeviceQueryResult> handler,
            IConcreteRequestHandler concreteHandler
        )
        {
            _handler = handler;
            _concreteHandler = concreteHandler;
        }

        // GET api/values
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public IotDevice Get(int id)
        {
            // IRequest<IDeviceQuery<IotDevice>, IDeviceQueryResult> request = new DataQueryRequest<IDeviceQuery<IotDevice>, IDeviceQueryResult>();
            IConcreteRequest request = new ConcreteDataQueryRequest();
            request.Lifetime = 1000;
            request.Id = Guid.NewGuid().ToString();
            request.ExceptsResults = true;
            request.SetExpectedPrototype(new DeviceQueryResult());

            var query = _concreteHandler.HandleRequestAsync(request);  //_handler.HandleRequestAsync(request);
            query.Wait();
            return ((DeviceQueryResult)query.Result).Device;
           // return new IotDevice();
        }

        // POST api/values
        [HttpPost]
        public void Post([FromBody]string value)
        {
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}

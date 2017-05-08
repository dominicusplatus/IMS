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

        public DeviceController()
        {
            _handler = new TransientRequestHandler<IDeviceQuery<IotDevice>, IDeviceQueryResult>();
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
            IRequest<IDeviceQuery<IotDevice>, IDeviceQueryResult> request = new DataQueryRequest<IDeviceQuery<IotDevice>, IDeviceQueryResult>();
            var query = _handler.HandleRequestAsync(request);
            query.Wait();
            return query.Result.Device;
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

using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using ApiInfrastracture.RequestHandling;
using ApiInfrastracture.Results;
using Communication.Events;
using Communication.Queries;
using Communication.Requests;
using Communication.Response;
using Core.POCO.Device;
using Core.Results;
using Microsoft.AspNetCore.Mvc;

namespace senseGridApp.Controllers
{
    [Route("api/[controller]")]
    public class DeviceController : Controller
    {
        private IConcreteRequestHandler _concreteHandler;

        public DeviceController(
            IConcreteRequestHandler concreteHandler
        )
        {
            _concreteHandler = concreteHandler;
        }

        // GET api/values
        [HttpGet]
        public IEnumerable<IotDevice> Get()
        {
			IConcreteRequest request = new ConcreteDataQueryRequest();
			request.Lifetime = 180;
			request.Id = Guid.NewGuid().ToString();request.EventDefinition = new DeviceQueryRequestEvent(RequestEventType.QueryDeviceRequestStarted, Guid.NewGuid().ToString());
            request.Prototype = new DeviceQueryResult();

			var devices = new List<IotDevice>();
			var response = _concreteHandler.HandleRequest(request);
			try
			{
				var responseConrete = response as ConcreteDataQueryResponse;
 				if (responseConrete != null)
				{

					if (responseConrete?.Result is DeviceQueryResult)
					{
                        devices.Add(((DeviceQueryResult)responseConrete.Result)?.Device);
					}
                    else if (responseConrete?.Result is DevicesQueryResult){
                        return ((DevicesQueryResult)responseConrete.Result)?.Devices;
                    }
				}
               
                return devices.AsEnumerable();
			}
			catch (Exception ex)
			{
                return null;
			}
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public IotDevice Get(int id)
        {
            IConcreteRequest request = new ConcreteDataQueryRequest();
            request.Lifetime = 180;
            request.Id = Guid.NewGuid().ToString();
            request.EventDefinition = new DeviceQueryRequestEvent(RequestEventType.QueryDeviceRequestStarted, Guid.NewGuid().ToString());
            request.Prototype = new DeviceQueryResult();
            var response = _concreteHandler.HandleRequest(request);
            try
            {
				var responseConrete = response as ConcreteDataQueryResponse;
                if (responseConrete!=null){
                  
					if (responseConrete?.Result is DeviceQueryResult)
					{
						return ((DeviceQueryResult)responseConrete.Result)?.Device;
					}
					else
					{
						return new IotDevice();
					}
                }
            }
            catch (Exception ex)
            {
				
            }
           return new IotDevice();
        }

        // POST api/values
        [HttpPost]
        public void Post([FromBody]IotDevice device)
        {
			IConcreteRequest request = new ConcreteDataQueryRequest();
			request.Lifetime = 180;
			request.Id = Guid.NewGuid().ToString();
			request.EventDefinition = new DeviceQueryRequestEvent(RequestEventType.UpdateDeviceRequestStarted, Guid.NewGuid().ToString());
			request.Prototype = true;
            request.Parameter = device;

			var response = _concreteHandler.HandleRequest(request);
			try
			{
				var responseConrete = response as ConcreteDataQueryResponse;
				if (responseConrete != null)
				{

					
				}

			}
			catch (Exception ex)
			{
				
			}
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]IotDevice device)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}

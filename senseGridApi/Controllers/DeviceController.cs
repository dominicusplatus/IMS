﻿using System;
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
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public IotDevice Get(int id)
        {
            IConcreteRequest request = new ConcreteDataQueryRequest();
            request.Lifetime = 1000;
            request.Id = Guid.NewGuid().ToString();
            request.ExceptsResults = true;
            request.EventDefinition = new DeviceQueryRequestEvent(RequestEventType.QueryDeviceRequestStarted, Guid.NewGuid().ToString());
            request.SetExpectedPrototype(new DeviceQueryResult());

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

using System;
using System.Collections.Generic;
using System.Text;
using Core.POCO.Device;

namespace ApiInfrastracture.Results
{
    public interface IDeviceQueryResult
    {
         IotDevice Device { get; set; }
    }

    public class DeviceQueryResult : IDeviceQueryResult
    {
        public IotDevice Device { get; set; }
    }

}

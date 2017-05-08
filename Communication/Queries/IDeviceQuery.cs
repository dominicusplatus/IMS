using System;
using System.Collections.Generic;
using System.Text;
using Core.POCO.Device;

namespace Communication.Queries
{
    public interface IDeviceQuery<TIn> : IDataQuery<TIn>
    {

    }

    public class DeviceQuery : IDeviceQuery<IotDevice>
    {
        public int Limit { get; set; }
        public int Timeout { get; set; }
    }


}

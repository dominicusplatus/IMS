using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Text;

namespace Core.POCO.Device
{
    [DataContract]
    public class IotDevice
    {
        [DataMember]
        public string Name { get; set; }

        [DataMember]
        public DateTime LastEdit { get; set; }

        [DataMember]
        public string Value { get; set; }
    }
}
 
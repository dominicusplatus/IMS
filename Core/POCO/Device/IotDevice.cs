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
        public string Id { get; set; }

        [DataMember]
        public string Name { get; set; }

        [DataMember]
        public DateTime LastEdit { get; set; }

        [DataMember]
        public string Value { get; set; }

        [DataMember]
        public double Temperature { get; set; }

        [DataMember]
        public double Humidity { get; set; }

        [DataMember]
        public double CO2 { get; set; }

        [DataMember]
        public double Elevation { get; set; }

        [DataMember]
        public double Latitude { get; set; }

        [DataMember]
        public double Longitude { get; set; }


        public IotDevice()
        {
            Id = Guid.NewGuid().ToString();
        }
}
}
 
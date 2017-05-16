using System;
using Communication.Requests;
using Communication.Routing;
using Core.Results;
using Core.POCO.Device;

namespace Domain.Iot
{
    public class IotDeviceDataProvider : IIotDeviceDataProvider, IObserver<IConcreteRequest>
    {
        private IConcreteRequestEventRouter _router;

        public IotDeviceDataProvider(IConcreteRequestEventRouter router)
        {
            _router = router;
            _router.Subscribe();
        }

        public void OnCompleted()
        {
          
        }

        public void OnError(Exception error)
        {
           
        }

        public void OnNext(IConcreteRequest value)
        {
            if(value!=null){
                //TODO
                var result = new DeviceQueryResult();
                result.Device = new IotDevice();
                result.Device.Name = Guid.NewGuid().ToString();
                _router.Publish(result);
            }
        }
    }
}

using System;
using Communication.Routing;

namespace Domain.Iot
{
    public class IotDeviceDataProvider :IIotDeviceDataProvider
    {
        private IConcreteRequestEventRouter _router;

		public IotDeviceDataProvider(IConcreteRequestEventRouter router)
		{
			_router = router;
            _router.Subscribe();
        }


    }
}

using System;
using System.Collections.Generic;
using System.Reflection;
using Communication.Events;
using Infrastracture.Dependency;
using Communication.Attributes;
using Autofac;
using Autofac.Core;
using Autofac.Core.Activators.Delegate;
using Autofac.Core.Lifetime;
using Autofac.Core.Registration;
using Communication.Requests;
using System.Collections;
using System.Linq;

namespace IotDomain.Iot
{
    public class IotDeviceServiceActivator : IEventServicesActivator
    {
        private IContainer _existingContainer;

        public IotDeviceServiceActivator()
        {

        }

        public IotDeviceServiceActivator(IContainer existingContainer)
        {
            _existingContainer = existingContainer;
        }


		public IEnumerable<IComponentRegistration> RegistrationsFor(
           Service service,
           Func<Service, IEnumerable<IComponentRegistration>> registrationAccessor)
		{
			var swt = service as IServiceWithType;
			if (swt == null || !typeof(IConcreteRequestResponseProvider).IsAssignableFrom(swt.ServiceType))
			{
				// It's not a request for the base handler type, so skip it.
				return Enumerable.Empty<IComponentRegistration>();
			}

			// This is where the magic happens!
			var registration = new ComponentRegistration(
			  Guid.NewGuid(),
			  new DelegateActivator(swt.ServiceType, (c, p) =>
				{
			// In this example, the factory itself is assumed to be registered
			// with Autofac, so we can resolve the factory. If you want to hard
			// code the factory here, you can do that, too.
			var provider = c.Resolve<IRequestResponseHandlerFactory>();

			// Our factory interface is generic, so we have to use a bit of
			// reflection to make the call.
			var method = provider.GetType().GetMethod("GetHandler").MakeGenericMethod(swt.ServiceType);

			// In the end, return the object from the factory.
			return method.Invoke(provider, null);
				}),
			  new CurrentScopeLifetime(),
			  InstanceSharing.None,
			  InstanceOwnership.OwnedByLifetimeScope,
			  new[] { service },
			  new Dictionary<string, object>());

			return new IComponentRegistration[] { registration };
		}

		public bool IsAdapterForIndividualComponents { get { return false; } }

        private void ActivateServiceByTypeForEventType(Type serviceType, RequestEventType type)
        {
            if(serviceType!=null){
                foreach (Attribute attr in serviceType.GetTypeInfo().GetCustomAttributes())
                {
                    var attrAsEventAttribute = attr as EventSubscriberAttribute;
                    if(attrAsEventAttribute !=null){
                        if(attrAsEventAttribute.EventType == type){
							var updater = new ContainerBuilder();
                            if(serviceType == typeof(IotDeviceDataProvider) ){
								updater.RegisterType<IotDeviceDataProvider>().AsImplementedInterfaces();
                            }else if(serviceType == typeof(IotDeviceUpdateHandler)){
                                updater.RegisterType<IotDeviceUpdateHandler>().AsImplementedInterfaces();
                            }
							updater.Update(_existingContainer);
                        }
                    }
                }
            }
        }


		public void ActivateForEvent(IRequestEventDefinition eventDefnition)
		{
            ActivateServiceByTypeForEventType(typeof(IotDeviceDataProvider),eventDefnition.EventType);
            ActivateServiceByTypeForEventType(typeof(IotDeviceUpdateHandler), eventDefnition.EventType);

			//Type clsType = typeof(IotDeviceDataProvider);

		}

    }



}

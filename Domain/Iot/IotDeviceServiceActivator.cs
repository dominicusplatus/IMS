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
		// private IContainer _existingContainer;
		private IComponentContext _context;
        private List<object> RegisteredHandlers;

        public IotDeviceServiceActivator(IComponentContext context)
        {
            _context = context;
            RegisteredHandlers = new List<object>();
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
					/*
					var provider = c.Resolve<IRequestResponseHandlerFactory>();
					var method = provider.GetType().GetMethod("GetHandler").MakeGenericMethod(swt.ServiceType)
					return method.Invoke(provider, null);
					*/

					return c.Resolve(swt.ServiceType);
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
							RegisteredHandlers.Add(_context.Resolve(serviceType));
                            /*
							var updater = new ContainerBuilder();
							if(serviceType == typeof(IotDeviceDataProvider) ){
                                updater.RegisterType<IotDeviceDataProvider>().AsImplementedInterfaces();
                            }else if(serviceType == typeof(IotDeviceUpdateHandler)){
                                updater.RegisterType<IotDeviceUpdateHandler>().AsImplementedInterfaces();
                            }
							updater.Update(_existingContainer);
							*/
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

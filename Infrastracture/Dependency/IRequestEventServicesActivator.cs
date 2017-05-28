using System;
using Communication.Events;
using System.ComponentModel;
using System.Collections.Generic;

namespace Infrastracture.Dependency
{
    public interface IEventServicesActivator
    {
        void ActivateForEvent(IRequestEventDefinition eventDefnition);
    }

   
    public class ImmediateEventServicesActivator : IEventServicesActivator
    {
      
        public IEnumerable<Lazy<IRequestEventDefinition, IService>> serviceEventRegistrations;

        public void ActivateForEvent(IRequestEventDefinition eventDefnition)
        {
           
        }
    }

}

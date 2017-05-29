using System;
using Communication.Events;
using System.ComponentModel;
using System.Collections.Generic;
using Autofac.Core;
using Autofac.Core.Activators.Delegate;
using Autofac.Core.Lifetime;
using Autofac.Core.Registration;

namespace Infrastracture.Dependency
{
    public interface IEventServicesActivator : IRegistrationSource
    {
        void ActivateForEvent(IRequestEventDefinition eventDefnition);
    }

}

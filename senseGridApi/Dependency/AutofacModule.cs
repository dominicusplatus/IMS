using System;
using ApiInfrastracture.RequestHandling;
using Autofac;

namespace senseGridApi.Dependency
{
    public class AutofacModule : Module
	{
		protected override void Load(ContainerBuilder builder)
		{
			//var dataAccess = Assembly.GetExecutingAssembly();

		//	builder.RegisterAssemblyTypes(dataAccess)
		//		   .Where(t => t.Name.EndsWith("Repository"))
		//				   .AsImplementedInterfaces();

            
		}
	}
}

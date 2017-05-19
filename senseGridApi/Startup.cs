using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Autofac;
using Autofac.Core;
using Autofac.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Scrutor;
using senseGridApi.Dependency;

using ApiInfrastracture.RequestHandling;
using ApiInfrastracture.Results;
using Communication.Queries;
using Communication.Requests;
using Core.POCO.Device;

using Info = Swashbuckle.AspNetCore.Swagger.Info;
using Communication.Routing;
using Domain.Iot;

namespace senseGridApi
{
	public class Startup
	{
		public Startup(IHostingEnvironment env)
		{
			var builder = new ConfigurationBuilder()
				.SetBasePath(env.ContentRootPath)
				.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
				.AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
				.AddEnvironmentVariables();
			Configuration = builder.Build();
		}

		public IConfigurationRoot Configuration { get; }

		public IContainer ApplicationContainer { get; private set; }


		// This method gets called by the runtime. Use this method to add services to the container.
		public void ConfigureServices(IServiceCollection services)
		{
			// Add framework services.
			services.AddMvc();

			services.AddLogging();

			// Register the Swagger generator, defining one or more Swagger documents
			services.AddSwaggerGen(c =>
			{
				c.SwaggerDoc("v1", new Info { Title = "Iot API", Version = "v1" });
			});

		}

		public void ConfigureContainer(ContainerBuilder containerBuilder)
		{
			// Add services using your custom container here. In this case autofac
			//containerBuilder.RegisterType<Foo>().AsImplementedInterfaces().SingleInstance();

			containerBuilder.RegisterModule(new AutofacModule());
            containerBuilder.RegisterType<TransientConcreteRequestEventRouter>().AsImplementedInterfaces().InstancePerLifetimeScope();    //InstancePerRequest
			containerBuilder.RegisterType<TransientConcreteResponseEventRouter>().AsImplementedInterfaces().InstancePerLifetimeScope();
            containerBuilder.RegisterType<BasicRequestHandler>().AsImplementedInterfaces().InstancePerLifetimeScope();

			containerBuilder.RegisterType<IotDeviceDataProvider>().Named<IConcreteRequestResponseProvider>("handler");
			containerBuilder.RegisterDecorator<IConcreteRequestResponseProvider>((c, inner) => new ConcreteRequestResponseProviderDecorator(inner),fromKey: "handler");

            //containerBuilder.RegisterType<IotDeviceDataProvider>().AsSelf().InstancePerRequest();



            /*
            var builder = new ContainerBuilder();
            builder.RegisterModule(new AutofacModule());
            builder.Populate(services);
            this.ApplicationContainer = builder.Build();
            return new AutofacServiceProvider(this.ApplicationContainer);
            */
		}


		// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
		public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
		{
			loggerFactory.AddConsole(Configuration.GetSection("Logging"));
			loggerFactory.AddDebug();


			app.UseMvcWithDefaultRoute();

			// Enable middleware to serve generated Swagger as a JSON endpoint.
			app.UseSwagger();

			// Enable middleware to serve swagger-ui (HTML, JS, CSS etc.), specifying the Swagger JSON endpoint.
			app.UseSwaggerUI(c =>
			{
				c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
			});

		}

		void Application_Error(object sender, EventArgs e)
		{
			// Code that runs when an unhandled error occurs

			// Get the exception object.

		}
	}

}

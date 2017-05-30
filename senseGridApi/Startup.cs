using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Autofac;
using Autofac.Core;
using Autofac.Extensions.DependencyInjection;

using Microsoft.EntityFrameworkCore;
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
using Pomelo.EntityFrameworkCore.MySql;

using Info = Swashbuckle.AspNetCore.Swagger.Info;
using Communication.Routing;
using Authentication;
using DAL.Repository;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using AspNet.Security.OpenIdConnect.Primitives;
using Microsoft.AspNetCore.SpaServices.Webpack;
using IotDomain.Iot;
using IotRepository;
using DAL.Repository.Mongo;
using Infrastracture.Dependency;

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

			services.AddDbContext<UserDbContext>(options =>
			{
				//	options.UseNpgsql(Configuration.GetConnectionString("defaultConnection"));
				// Configure the context to use an in-memory store.
				options.UseMySql("Server=localhost;Database=iotgrid;Uid=root;Pwd=;");
				options.UseOpenIddict();
			});

			// Configure Entity Framework Initializer for seeding
			services.AddTransient<IDefaultDbContextInitializer, UserContextInitializer>();

			// Configure Entity Framework Identity for Auth
			services.AddIdentity<IotApplicationUser, IdentityRole>(o =>
			{
				// Do not 302 redirect when Unauthorized; just return 401 status code (ref: http://stackoverflow.com/a/38801130/626911)
				o.Cookies.ApplicationCookie.AutomaticChallenge = false;
			})
			.AddEntityFrameworkStores<UserDbContext>()
			.AddDefaultTokenProviders();

			// Configure Identity to use the same JWT claims as OpenIddict instead
			// of the legacy WS-Federation claims it uses by default (ClaimTypes),
			// which saves you from doing the mapping in your authorization controller.

            services.Configure<IdentityOptions>(options =>
			{
				options.ClaimsIdentity.UserNameClaimType = OpenIdConnectConstants.Claims.Name;
				options.ClaimsIdentity.UserIdClaimType = OpenIdConnectConstants.Claims.Subject;
				options.ClaimsIdentity.RoleClaimType = OpenIdConnectConstants.Claims.Role;
				options.SignIn.RequireConfirmedEmail = true;
			});

			// Configure OpenIddict for JSON Web Token (JWT) generation (Ref: http://capesean.co.za/blog/asp-net-5-jwt-tokens/)
			// Register the OpenIddict services.
			// Note: use the generic overload if you need
			// to replace the default OpenIddict entities.
			services.AddOpenIddict(options =>
			{
				// Register the Entity Framework stores.
				options.AddEntityFrameworkCoreStores<UserDbContext>();

				// Register the ASP.NET Core MVC binder used by OpenIddict.
				// Note: if you don't call this method, you won't be able to
				// bind OpenIdConnectRequest or OpenIdConnectResponse parameters.
				options.AddMvcBinders();

				// Enable the token endpoint (required to use the password flow).
				options.EnableTokenEndpoint("/api/auth/login");

				// Allow client applications to use the grant_type=password flow.
				options.AllowPasswordFlow();

				// During development, you can disable the HTTPS requirement.
				options.DisableHttpsRequirement();

				options.AllowRefreshTokenFlow();
				options.UseJsonWebTokens();
				options.AddEphemeralSigningKey();
				options.SetAccessTokenLifetime(TimeSpan.FromDays(1));
			});



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

			//REQUIRED TO INJECT IConcreteRequestResponseProvider when not using  RegisterSource with IRequestResponseHandlerFactory
			//containerBuilder.RegisterType<IotDeviceDataProvider>().Named<IConcreteRequestResponseProvider>("handler");
			//containerBuilder.RegisterDecorator<IConcreteRequestResponseProvider>((c, inner) => new ConcreteRequestResponseProviderDecorator(inner),fromKey: "handler");
			
            //containerBuilder.RegisterType<RequestResponseHandlerFactory>().As<IRequestResponseHandlerFactory>();
			//containerBuilder.RegisterType<IotDeviceDataProvider>().AsImplementedInterfaces();
			//containerBuilder.RegisterType<IotDeviceUpdateHandler>().AsImplementedInterfaces();
			containerBuilder.RegisterType<IotDeviceDataProvider>();
            containerBuilder.RegisterType<IotDeviceUpdateHandler>();

            containerBuilder.RegisterType<IotDeviceServiceActivator>().AsImplementedInterfaces().InstancePerDependency();
			containerBuilder.RegisterType<MongoRepository>().AsImplementedInterfaces().InstancePerDependency();



			//containerBuilder.RegisterSource(new IotDeviceServiceActivator());

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
		public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory, IDefaultDbContextInitializer databaseInitializer)
		{
			loggerFactory.AddConsole(Configuration.GetSection("Logging"));
			loggerFactory.AddDebug();

			// Register the validation middleware, that is used to decrypt
			// the access tokens and populate the HttpContext.User property.
			app.UseOAuthValidation();
			// Register the OpenIddict middleware.
			app.UseOpenIddict();


			// Apply any pending migrations
			// Do not call EnsureCreated() b/c it does not log to _EFMigrationsHistory table (Ref: https://github.com/aspnet/EntityFramework/issues/3875)
			databaseInitializer.Migrate();

			databaseInitializer.Seed().GetAwaiter().GetResult();

			/*
			if (env.IsDevelopment())
			{
				//databaseInitializer.Seed().GetAwaiter().GetResult();

				// Configure Webpack Middleware (Ref: http://blog.stevensanderson.com/2016/05/02/angular2-react-knockout-apps-on-aspnet-core/)
				//  - Intercepts requests for webpack bundles and routes them through Webpack - this prevents needing to run Webpack file watcher separately
				//  - Enables Hot module replacement (HMR)
				app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions
				{
					HotModuleReplacement = true,
					ReactHotModuleReplacement = true,
					ConfigFile = System.IO.Path.Combine(Configuration["webClientPath"], "webpack.config.js")
				});

				app.UseDeveloperExceptionPage();
				//app.UseDatabaseErrorPage();
			}
            */

			if (env.IsDevelopment())
			{
				app.UseDeveloperExceptionPage();
				app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions
				{
					HotModuleReplacement = true
				});
			}
			else
			{
				app.UseExceptionHandler("/Home/Error");
			}



			//  app.UseMvcWithDefaultRoute();

			// Enable middleware to serve generated Swagger as a JSON endpoint.
			app.UseSwagger();

			// Enable middleware to serve swagger-ui (HTML, JS, CSS etc.), specifying the Swagger JSON endpoint.
			app.UseSwaggerUI(c =>
			{
				c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
			});

			app.UseStaticFiles();
			app.UseMvc(routes =>
    		   {
    			   routes.MapRoute(
    				   name: "default",
    				   template: "{controller=Home}/{action=Index}/{id?}");

    			   routes.MapSpaFallbackRoute(
    				   name: "spa-fallback",
    				   defaults: new { controller = "Home", action = "Index" });
    		   });

		}

		void Application_Error(object sender, EventArgs e)
		{
			// Code that runs when an unhandled error occurs

			// Get the exception object.

		}
	}

}

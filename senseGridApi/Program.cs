using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;

namespace senseGridApi
{
    public class Program
    {
        public static void Main(string[] args)
        {
            try
            {
                    /*
				    var config = new ConfigurationBuilder()
					.SetBasePath(Directory.GetCurrentDirectory())
					.AddJsonFile("appsettings.json")
					.Build();
                    */

				var host = new WebHostBuilder()
					.UseKestrel()
					.UseAutofac()
					//.UseUrls(config["serverBindingUrl"])
					.UseContentRoot(Directory.GetCurrentDirectory())
					.UseIISIntegration()
					.UseStartup<Startup>()
					.UseApplicationInsights()
					.Build();

				host.Run();
            }
            catch (Exception ex)
            {

            }

        }
    }
}

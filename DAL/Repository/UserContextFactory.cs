using System;
using ConfigurationTools;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using MySql.Data.EntityFrameworkCore;
using MySQL.Data.EntityFrameworkCore.Extensions;

namespace DAL.Repository
{
    public class UserContextFactory : IDbContextFactory<UserDbContext>
	{
        private IDataSourceDefinitionFactory _datasourceFactory;

        public UserContextFactory()
        {
            _datasourceFactory = new BasicDataSourceDefinitionFactory();
        }

        public UserContextFactory(IDataSourceDefinitionFactory datasourceFactory)
        {
            _datasourceFactory = datasourceFactory;
        }

        public UserDbContext Create()
		{
			var optionsBuilder = new DbContextOptionsBuilder<UserDbContext>();
			optionsBuilder.UseMySQL(_datasourceFactory.Create().ConnectionString);
			return new UserDbContext(optionsBuilder.Options);
		}

        public UserDbContext Create(DbContextFactoryOptions options)
        {
			var optionsBuilder = new DbContextOptionsBuilder<UserDbContext>();
            optionsBuilder.UseMySQL(_datasourceFactory.Create().ConnectionString);
			return new UserDbContext(optionsBuilder.Options);
        }
    }
}

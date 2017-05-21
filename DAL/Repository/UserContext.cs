using System;
using Authentication;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repository
{

	public class UserDbContext : IdentityDbContext<IotApplicationUser>
	{
		public UserDbContext(DbContextOptions<UserDbContext> options)
		: base(options)
		{
		}

		public DbSet<IotApplicationUser> ApplicationUsers { get; set; }

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			base.OnModelCreating(modelBuilder);
		}
	}

}

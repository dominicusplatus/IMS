using System;
using System.Threading.Tasks;
using Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repository
{
	public class UserContextInitializer : IDefaultDbContextInitializer
	{
		private readonly UserDbContext _context;
		private readonly UserManager<IotApplicationUser> _userManager;
		private readonly RoleManager<IdentityRole> _roleManager;

		public UserContextInitializer(UserDbContext context, UserManager<IotApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
		{
			_userManager = userManager;
			_context = context;
			_roleManager = roleManager;
		}

		public bool EnsureCreated()
		{
			return _context.Database.EnsureCreated();
		}

		public void Migrate()
		{
			_context.Database.Migrate();
		}

		public async Task Seed()
		{
            try
            {
				var email = "user@test.com";
				if (await _userManager.FindByEmailAsync(email) == null)
				{
					IotApplicationUser user = new IotApplicationUser
					{
						UserName = email,
						Email = email,
						EmailConfirmed = true,
						Nickname = "John Doe"
					};

					await _userManager.CreateAsync(user, "passwordComplex123#");
				}

				_context.SaveChanges();
            }
            catch (Exception ex)
            {

            }

		}
	}

	public interface IDefaultDbContextInitializer
	{
		bool EnsureCreated();
		void Migrate();
		Task Seed();

	}

}

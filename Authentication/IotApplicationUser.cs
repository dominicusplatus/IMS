using System;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace Authentication
{
    public class IotApplicationUser : IdentityUser
    {
        public string Nickname { get; set; }

        public IotApplicationUser()
        {
        }
    }
}

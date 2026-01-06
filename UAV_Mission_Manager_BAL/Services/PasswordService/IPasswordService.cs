using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UAV_Mission_Manager_DTO.Models.User;

namespace UAV_Mission_Manager_BAL.Services.PasswordService
{
    public interface IPasswordService
    {
        public string GenerateRandomPassword(int length = 8);
        public string HashPassword(string password);
        public bool VerifyPassword(string password, string hashedPassword);
    }
}

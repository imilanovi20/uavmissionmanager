using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UAV_Mission_Manager_DTO.Models.User
{
    public class CreateUserDto
    {
        public string? Username { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }
        public string? ImagePath { get; set; }
        public string? UserRoleName { get; set; }
        public string Message { get; set; }
        public bool Success { get; set; }
    }
}

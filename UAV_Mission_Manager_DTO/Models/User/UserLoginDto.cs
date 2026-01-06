using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UAV_Mission_Manager_DTO.Models.User
{
    public class UserLoginDto
    {
        public string Username { get; set; }

        public string Password { get; set; }
    }
}

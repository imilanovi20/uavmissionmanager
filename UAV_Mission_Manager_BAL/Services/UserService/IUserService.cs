using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UAV_Mission_Manager_DAL.Entities;
using UAV_Mission_Manager_DTO.Models.User;


namespace UAV_Mission_Manager_BAL.Services.UserService
{
    public interface IUserService
    {
        public Task<CreateUserDto> RegisterNewUser(UserDto userRegistration);
        public Task<UserLoginResponseDto> LoginAsync(UserLoginDto loginDto);
        Task<UserDto> GetCurrentUserAsync(string username);
        public Task<List<UserDto>> GetAllUsersAsync();
        Task<bool> DeleteUserAsync(string username);
    }
}

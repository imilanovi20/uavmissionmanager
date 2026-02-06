using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using UAV_Mission_Manager_BAL.Services.EmailService;
using UAV_Mission_Manager_BAL.Services.JwtService;
using UAV_Mission_Manager_BAL.Services.PasswordService;
using UAV_Mission_Manager_DAL;
using UAV_Mission_Manager_DAL.Entities;
using UAV_Mission_Manager_DTO.Models.User;

namespace UAV_Mission_Manager_BAL.Services.UserService
{
    public class UserService : IUserService
    {
        private readonly IRepository<User> _userRepository;
        private readonly IReadOnlyRepository<UserRole> _userRoleRepository;
        private readonly IEmailService _emailService;
        private readonly IPasswordService _passwordService;
        private readonly IJwtService _jwtService;
        private readonly ILogger<UserService> _logger;

        public UserService(
            IRepository<User> userRepository,
            IReadOnlyRepository<UserRole> userRoleRepository,
            IPasswordService passwordService,
            IEmailService emailService,
            IJwtService jwtService,
            ILogger<UserService> logger)
        {
            _userRepository = userRepository;
            _userRoleRepository = userRoleRepository;
            _passwordService = passwordService;
            _emailService = emailService;
            _jwtService = jwtService;
            _logger = logger;
        }

        public async Task<CreateUserDto> RegisterNewUser(UserDto userRegistration)
        {
            try
            {
                User? existingUserByUsername = await GetUserByUsername(userRegistration.Username);

                if (existingUserByUsername != null)
                {
                    return new CreateUserDto
                    {
                        Success = false,
                        Message = "A user with that username already exists."
                    };
                }
                User? existingUserByEmail = await GetUserByEmail(userRegistration.Email);

                if (existingUserByEmail != null)
                {
                    return new CreateUserDto
                    {
                        Success = false,
                        Message = "A user with that email already exists."
                    };
                }

                var userRole = await _userRoleRepository
                        .GetAll()
                        .FirstOrDefaultAsync(ur => ur.Name == userRegistration.Role);

                if (userRole == null)
                {
                    return new CreateUserDto
                    {
                        Success = false,
                        Message = "Invalid user role."
                    };
                }

                var tempPassword = _passwordService.GenerateRandomPassword(10);
                var hashedPassword = _passwordService.HashPassword(tempPassword);

                var newUser = new User
                {
                    Username = userRegistration.Username,
                    Password = hashedPassword,
                    FirstName = userRegistration.FirstName,
                    LastName = userRegistration.LastName,
                    Email = userRegistration.Email,
                    ImagePath = userRegistration.ImagePath,
                    UserRoleId = userRole.Id
                };

                _userRepository.Add(newUser);
                await _userRepository.SaveAsync();

                var emailSent = await _emailService.SendPasswordEmailAsync(
                    userRegistration.Email,
                    userRegistration.FirstName,
                    userRegistration.LastName,
                    userRegistration.Username,
                    tempPassword
                );

                return new CreateUserDto
                {
                    Username = newUser.Username,
                    FirstName = newUser.FirstName,
                    LastName = newUser.LastName,
                    Email = newUser.Email,
                    ImagePath = newUser.ImagePath,
                    UserRoleName = userRole.Name,
                    Success = true,
                    Message = emailSent ?
                        "User has been successfully created. Login details have been sent to your email." :
                        "The user was successfully created, but the email was not sent. Please contact the administrator."
                };
            }
            catch (Exception ex)
            {
                return new CreateUserDto
                {
                    Success = false,
                    Message = "An error occurred while creating the user."
                };
            }


        }

        public async Task<UserLoginResponseDto> LoginAsync(UserLoginDto loginDto)
        {
            try
            {
                User? user = await GetUserByUsername(loginDto.Username);

                if (user == null)
                {
                    return new UserLoginResponseDto
                    {
                        Success = false,
                        Message = "Invalid login credentials."
                    };
                }

                var isPasswordValid = _passwordService.VerifyPassword(loginDto.Password, user.Password);
                if (!isPasswordValid)
                {
                    return new UserLoginResponseDto
                    {
                        Success = false,
                        Message = "Invalid login credentials."
                    };
                }

                var role = await GetRoleById(user.UserRoleId);

                var token = _jwtService.GenerateToken(
                    user.Username,
                    role.Name);

                return new UserLoginResponseDto
                {
                    Success = true,
                    Message = "Login success.",
                    Token = token,
                };

            }
            catch (Exception ex)
            {
                return new UserLoginResponseDto
                {
                    Success = false,
                    Message = "An error occurred during the login."
                };
            }
        }

        public async Task<UserDto> GetCurrentUserAsync(string username)
        {
            try
            {
                var user = await GetUserByUsername(username);

                if (user == null)
                    return null;
                var userRole = await _userRoleRepository.GetByIdAsync(user.UserRoleId);
                string role = userRole?.Name ?? "Unknown";

                return new UserDto
                {
                    Username = user.Username,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Email = user.Email,
                    ImagePath = user.ImagePath,
                    Role = role,
                };
            }
            catch (Exception ex)
            {

                return null;
            }
        }

        public async Task<List<UserDto>> GetAllUsersAsync()
        {
            try
            {
                var users = await _userRepository.GetAll().ToListAsync();
                var userDtos = new List<UserDto>();

                foreach (var user in users)
                {
                    var userRole = await _userRoleRepository.GetByIdAsync(user.UserRoleId);
                    userDtos.Add(new UserDto
                    {
                        Username = user.Username,
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                        Email = user.Email,
                        ImagePath = user.ImagePath,
                        Role = userRole?.Name ?? "Unknown"
                    });
                }

                return userDtos;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while retrieving all users");
                return new List<UserDto>();
            }
        }

        public async Task<bool> DeleteUserAsync(string username)
        {
            try
            {
                var user = await GetUserByUsername(username);

                if (user == null)
                    return false;

                _userRepository.Delete(user);
                await _userRepository.SaveAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while deleting user: {Username}", username);
                return false;
            }
        }

        private async Task<User?> GetUserByEmail(String email)
        {
            return await _userRepository
                .GetAll()
                .FirstOrDefaultAsync(u => u.Email == email);
        }

        private async Task<User?> GetUserByUsername(String username)
        {
            return await _userRepository
                .GetAll()
                .FirstOrDefaultAsync(u => u.Username == username);
        }

        private async Task<UserRole?> GetRoleById(int roleId)
        {
            return await _userRoleRepository.GetByIdAsync(roleId);
        }
    }
}

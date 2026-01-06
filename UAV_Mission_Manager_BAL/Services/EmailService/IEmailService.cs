using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UAV_Mission_Manager_BAL.Services.EmailService
{
    public interface IEmailService
    {
        public Task<bool> SendPasswordEmailAsync(string toEmail, string firstName, string lastName, string username, string tempPassword);
        public Task<bool> SendEmailAsync(string toEmail, string subject, string body, bool isHtml = true);
    }
}

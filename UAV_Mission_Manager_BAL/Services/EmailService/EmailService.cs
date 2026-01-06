using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace UAV_Mission_Manager_BAL.Services.EmailService
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }
        public async Task<bool> SendEmailAsync(string toEmail, string subject, string body, bool isHtml = true)
        {
            try
            {
                var smtpHost = _configuration["EmailSettings:SmtpHost"];
                var smtpPort = int.Parse(_configuration["EmailSettings:SmtpPort"]);
                var smtpUsername = _configuration["EmailSettings:SmtpUsername"];
                var smtpPassword = _configuration["EmailSettings:SmtpPassword"];
                var fromEmail = _configuration["EmailSettings:FromEmail"];
                var fromName = _configuration["EmailSettings:FromName"];
                _logger.LogInformation("Podaci. " + smtpUsername);

                using var client = new SmtpClient(smtpHost, smtpPort)
                {
                    EnableSsl = true,
                    UseDefaultCredentials = false,
                    Credentials = new NetworkCredential(smtpUsername, smtpPassword)
                };

                var mailMessage = new MailMessage
                {
                    From = new MailAddress(fromEmail, fromName),
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = isHtml
                };

                mailMessage.To.Add(new MailAddress(toEmail));

                await client.SendMailAsync(mailMessage);
                _logger.LogInformation($"Email successfully sent to {toEmail}");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error sending email to {toEmail}");
                return false;
            }
        }

        public async Task<bool> SendPasswordEmailAsync(string toEmail, string firstName, string lastName, string username, string tempPassword)
        {
            var subject = "Your New User Account - UAV Mission Manager";
            var body = $@"
                <html>
                <head>
                    <style>
                        body {{ font-family: Arial, sans-serif; }}
                        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                        .header {{ background-color: #2c3e50; color: white; padding: 20px; text-align: center; }}
                        .content {{ padding: 20px; background-color: #f8f9fa; }}
                        .credentials {{ background-color: #e8f4f8; padding: 15px; margin: 20px 0; border-left: 4px solid #3498db; }}
                        .footer {{ text-align: center; color: #7f8c8d; font-size: 12px; }}
                    </style>
                </head>
                <body>
                    <div class='container'>
                        <div class='header'>
                            <h2>UAV Mission Manager</h2>
                        </div>
                        <div class='content'>
                            <h3>Hello {firstName} {lastName},</h3>
                            <p>Your user account has been successfully created in the UAV Mission Manager system.</p>
                            
                            <div class='credentials'>
                                <h4>Your login credentials:</h4>
                                <p><strong>Username:</strong> {username}</p>
                                <p><strong>Temporary Password:</strong> {tempPassword}</p>
                            </div>
                            
                            <p><strong>IMPORTANT:</strong> Please log in and change your password upon first login.</p>
                            
                            <p>Thank you for being part of our team!</p>
                        </div>
                        <div class='footer'>
                            <p>This email was automatically generated. Please do not reply to this email.</p>
                        </div>
                    </div>
                </body>
                </html>";

            return await SendEmailAsync(toEmail, subject, body, true);
        }
    }
}

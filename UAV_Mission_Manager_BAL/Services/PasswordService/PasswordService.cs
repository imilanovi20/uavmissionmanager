using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Security.Cryptography;

namespace UAV_Mission_Manager_BAL.Services.PasswordService
{
    public class PasswordService : IPasswordService
    {
        private const string PasswordChars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*";
        public string GenerateRandomPassword(int length = 8)
        {
            if (length < 4)
                throw new ArgumentException("");


            var random = new Random();
            var password = new StringBuilder(length);

            password.Append(GetRandomChar("ABCDEFGHJKLMNPQRSTUVWXYZ", random)); 
            password.Append(GetRandomChar("abcdefghijkmnpqrstuvwxyz", random)); 
            password.Append(GetRandomChar("23456789", random)); 
            password.Append(GetRandomChar("!@#$%&*", random)); 

            for (int i = 4; i < length; i++)
            {
                password.Append(GetRandomChar(PasswordChars, random));
            }

            return ShuffleString(password.ToString(), random);
        }

        private char GetRandomChar(string chars, Random random)
        {
            return chars[random.Next(chars.Length)];
        }

        private string ShuffleString(string input, Random random)
        {
            char[] array = input.ToCharArray();
            int n = array.Length;
            while (n > 1)
            {
                n--;
                int k = random.Next(n + 1);
                (array[k], array[n]) = (array[n], array[k]);
            }
            return new string(array);
        }

        public string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password, BCrypt.Net.BCrypt.GenerateSalt(12));
        }

        public bool VerifyPassword(string password, string hashedPassword)
        {
            try
            {
                return BCrypt.Net.BCrypt.Verify(password, hashedPassword);
            }
            catch
            {
                return false;
            }
        }
    }
}

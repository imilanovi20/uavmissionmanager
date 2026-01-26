using Microsoft.EntityFrameworkCore;
using UAV_Mission_Manager_DAL;
using UAV_Mission_Manager_DAL.Entities;
using UAV_Mission_Manager_BAL.Services;
using UAV_Mission_Manager_BAL.Services.EmailService;
using UAV_Mission_Manager_BAL.Services.PasswordService;
using UAV_Mission_Manager_BAL.Services.UserService;
using UAV_Mission_Manager_BAL.Services.JwtService;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using UAV_Mission_Manager_BAL.Services.AdditionalEquipmentService;
using UAV_Mission_Manager_BAL.Services.UAVService;
using UAV_Mission_Manager_BAL.Services.MissionService;
using UAV_Mission_Manager_BAL.Services.WeatherService;
using UAV_Mission_Manager_BAL.Services.WaypointService;
using UAV_Mission_Manager_BAL.Services.TaskService;
using UAV_Mission_Manager_BAL.Services.FormationService;
using UAV_Mission_Manager_BAL.Services.PathPlanningService;
using UAV_Mission_Manager_BAL.Services.PermitService;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IRepository<User>, Repository<User>>();
builder.Services.AddScoped<IReadOnlyRepository<User>, ReadOnlyRepository<User>>();
builder.Services.AddScoped<IReadOnlyRepository<UserRole>, ReadOnlyRepository<UserRole>>();
builder.Services.AddScoped<IRepository<AdditionalEquipment>, Repository<AdditionalEquipment>>();
builder.Services.AddScoped<IRepository<UAV>, Repository<UAV>>();
builder.Services.AddScoped<IRepository<UAV_AdditionalEquipment>, Repository<UAV_AdditionalEquipment>>();
builder.Services.AddScoped<IRepository<Mission>, Repository<Mission>>();
builder.Services.AddScoped<IReadOnlyRepository<Mission>, Repository<Mission>>();
builder.Services.AddScoped<IRepository<MissionUAV>, Repository<MissionUAV>>();
builder.Services.AddScoped<IReadOnlyRepository<MissionUAV>, Repository<MissionUAV>>();
builder.Services.AddScoped<IRepository<MissionUser>, Repository<MissionUser>>();
builder.Services.AddScoped<IReadOnlyRepository<MissionUser>, Repository<MissionUser>>();
builder.Services.AddScoped<IRepository<MissionTask>, Repository<MissionTask>>();
builder.Services.AddScoped<IReadOnlyRepository<MissionTask>, Repository<MissionTask>>();
builder.Services.AddScoped<IRepository<Waypoint>, Repository<Waypoint>>();
builder.Services.AddScoped<IReadOnlyRepository<Waypoint>, Repository<Waypoint>>();
builder.Services.AddScoped<IRepository<Formation>, Repository<Formation>>();
builder.Services.AddScoped<IReadOnlyRepository<Formation>, Repository<Formation>>();
builder.Services.AddScoped<IRepository<UAVPosition>, Repository<UAVPosition>>();
builder.Services.AddScoped<IReadOnlyRepository<UAVPosition>, Repository<UAVPosition>>();


builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IPasswordService, PasswordService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IAdditionalEquipmentService, AdditionalEquipmentService>();
builder.Services.AddScoped<IUAVService, UAVService>();
builder.Services.AddScoped<IMissionService, MissionService>();
builder.Services.AddHttpClient<IWeatherService, WeatherService>();
builder.Services.AddScoped<IWaypointService, WaypointService>();
builder.Services.AddScoped<ITaskService, TaskService>();
builder.Services.AddScoped<IFormationService, FormationService>();
builder.Services.AddHttpClient<IPathPlanningService, PathPlanningService>();
builder.Services.AddScoped<IPermitService, PermitService>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])),
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder => builder
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader());
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "UAV Mission Manager API", Version = "v1" });

    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: 'Bearer 12345abcdef'",
        Name = "Authorization",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowAll");

app.UseAuthentication();  
app.UseAuthorization();


app.MapControllers();

app.Run();
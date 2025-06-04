using System.Threading.Tasks;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using Microsoft.Extensions.FileProviders;
using System.IO;
using Microsoft.AspNetCore.Http;

namespace ConfiaWebApi
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
            StaticConfig = configuration;
        }

        public IConfiguration Configuration { get; }

        public static IConfiguration StaticConfig { get; private set; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddHttpContextAccessor();

            services.AddMvc();
            // Configuramos la api para respetar los nombres de los objetos (para asi tener coherencia entre los controladores y la IU)
            services.AddControllers().AddJsonOptions(jsonOptions => { jsonOptions.JsonSerializerOptions.PropertyNamingPolicy = null; }).SetCompatibilityVersion(CompatibilityVersion.Version_3_0);

            services.AddControllersWithViews(options =>
             {
                 options.AllowEmptyInputInBodyModelBinding = true;
             });
            // Agergamos swagger
            services.AddSwaggerGen(c =>
            {
                // Configure
                c.CustomSchemaIds(type => type.ToString());
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "ConfiaWebApi", Version = "v1.01" });
                c.ResolveConflictingActions(apiDescriptions => (Microsoft.AspNetCore.Mvc.ApiExplorer.ApiDescription)apiDescriptions);
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Description = "JWT Authorization header using the Bearer scheme. \r\n\r\n Enter 'Bearer' [space] and then your token in the text input below.\r\n\r\nExample: \"Bearer 12345abcdef\"",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer"
                });

                // Add a sequrity requirement
                c.AddSecurityRequirement(new OpenApiSecurityRequirement()
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            },
                            Scheme = "oauth2",
                            Name = "Bearer",
                            In = ParameterLocation.Header,

                        },
                        new List<string>()
                    }
                });

            });

            // Add authentication to the project
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(o =>
            {
                // DEBUG !! debug !!
                o.RequireHttpsMetadata = true;

                // Configurar
                 o.Authority = "https://kc.fconfia.com/realms/SistemaCV_Demo";
                //o.Authority = "https://kc.fconfia.com/realms/SistemaCV_Desarrollo";
                //o.Authority = "https://kc.fconfia.com/realms/SistemaCV";
                o.Audience = "uicv";

                // o.Events = new JwtBearerEvents()
                // {
                //     OnAuthenticationFailed = c =>
                //     {
                //         c.NoResult();
                //         c.Response.StatusCode = 500;
                //         c.Response.ContentType = "text/plain";
                //         return Task.FromResult(c.Response.Body.WriteAsync(Encoding.ASCII.GetBytes(c.Exception.ToString())));
                //     }
                // };
            });

            services.AddTransient(t =>
            {
                var httpContextAccessor = t.GetService<IHttpContextAccessor>();
                var httpContext = httpContextAccessor.HttpContext;

                // Obtén el ConnectionString de Configuration
                var connectionString = Configuration.GetConnectionString("DBConfia");

                // Construye el objeto DBConfiaContext utilizando el ConnectionString y el HttpContext
                var dbContext = DBContext.DBConfia.DBConfiaContext.BuildDatabase(connectionString, httpContext);

                return dbContext;
            });



        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            // if (env.IsDevelopment())
            // {

            app.UseDeveloperExceptionPage();
            app.UseSwagger();
            app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "ConfiaWebApi v1.01"));

            // }

            // Habilitamos todos los dominions
            app.UseCors(b => b.SetIsOriginAllowed(x => _ = true).AllowAnyHeader().AllowCredentials().AllowAnyMethod());

            // Por defecto
            app.UseHttpsRedirection();
            app.UseRouting();

            // Autorizaciones con nuestro servidor de keycloak
            app.UseAuthentication();
            app.UseAuthorization();

            // Configurar los endpoints
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(Path.Combine(env.ContentRootPath, "wwwroot/Archivos/LogoBancos")),
                RequestPath = "/wwwroot/Archivos/LogoBancos"
            });
            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(Path.Combine(env.ContentRootPath, "wwwroot/Archivos/FirmaDistribuidor")),
                RequestPath = "/wwwroot/Archivos/FirmaDistribuidor"
            });
            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(Path.Combine(env.ContentRootPath, "wwwroot/RecursosPDF")),
                RequestPath = "/pdf"
            });
        }
    }
}
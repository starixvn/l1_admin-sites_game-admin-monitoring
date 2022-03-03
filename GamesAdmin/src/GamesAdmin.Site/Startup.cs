using AutoMapper;
using Coravel;
using GamesAdminMonitoring.Site._Shared;
using GamesAdminMonitoring.Site._Shared.Configurations;
using GamesAdminMonitoring.Site._Shared.Middlewares;
using MediatR;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;

namespace GamesAdminMonitoring.Site
{
    public class Startup
    {
        readonly string MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            //services.Configure<List<AuthenticationClient>>(Configuration.GetSection("AuthenticationClients"));
            //services.Configure<HostConfiguration>(Configuration.GetSection("HostConfiguration"));
            services.AddMediatR(typeof(Startup));
            services.AddAutoMapper(typeof(Startup));

            var appSettings = new AppSettings(Configuration);
            services.AddSingleton<IAppSettings>(appSettings);

            services.AddServices(appSettings);
            services.AddHealthChecks();

            services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
                .AddCookie(options =>
                {
                    options.ExpireTimeSpan = TimeSpan.FromHours(1);
                    options.LoginPath = "/Error/NotAuthorized";
                    options.AccessDeniedPath = "/Error/NotAuthorized";
                });

            services.AddMvc(o => o.Conventions.Add(new FeatureConvention()))
                  .AddRazorOptions(options =>
                  {
                      // {0} - Action Name
                      // {1} - Controller Name
                      // {2} - Area Name
                      // {3} - Feature Name
                      // Replace normal view location entirely
                      options.ViewLocationFormats.Clear();
                      options.ViewLocationFormats.Add("/Features/{3}/{1}/{0}.cshtml");
                      options.ViewLocationFormats.Add("/Features/{3}/Views/{0}.cshtml");
                      options.ViewLocationFormats.Add("/Features/{3}/{0}.cshtml");
                      options.ViewLocationFormats.Add("/Features/_Shared/{0}.cshtml");
                      options.ViewLocationFormats.Add("/Features/_Shared/Components/{0}.cshtml");
                      options.ViewLocationExpanders.Add(new FeatureViewLocationExpander());
                  });

            services.AddScheduler();

            //services.AddCors(c => c.AddPolicy("PolicyName", policy =>
            //{
            //    policy.WithOrigins("http://localhost:7779")
            //    .AllowAnyMethod()
            //    .AllowAnyHeader();
            //}));
            //services.AddCors(); // Make sure you call this previous to AddMvc
            //services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();

            //app.UseCors("PolicyName");
            app.UseAuthentication();
            app.UseAuthorization();

            app.Use(async (context, next) =>
            {
                context.Request.EnableBuffering();
                await next();
            });

            app.UseCors(x => x
    .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader());

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapHealthChecks("/health");
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Error}");
            });
        }
    }
}
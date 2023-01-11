using GamesAdmin.Core.IdentityServer;
using Microsoft.Extensions.Configuration;
using System;
using System.ComponentModel;

namespace GamesAdminMonitoring.Site._Shared.Configurations
{
    public interface IAppSettings
    {
        string ApiHost { get; }

        string StaticResourceHost { get; }

        IdentityServerAuth IdentityServerAuth { get; }

        string Env { get; }

        string SubPath { get; }

        string SystemType { get; }
    }

    public class AppSettings : IAppSettings
    {
        private readonly IConfiguration configuration;

        public AppSettings(IConfiguration configuration)
        {
            this.configuration = configuration;

            ApiHost = GetValue<string>(nameof(ApiHost));
            StaticResourceHost = GetValue<string>(nameof(StaticResourceHost));
            IdentityServerAuth = configuration.GetSection(nameof(IdentityServerAuth)).Get<IdentityServerAuth>();
            Env = GetValue<string>(nameof(Env));
            SubPath = GetValue<string>(nameof(SubPath));
            SystemType = GetValue<string>(nameof(SystemType));
        }

        public string ApiHost { get; }

        public string StaticResourceHost { get; }

        public IdentityServerAuth IdentityServerAuth { get; }

        public string Env { get; }

        public string SubPath { get; }

        public string SystemType { get; }

        public T GetValue<T>(string key)
        {
            try
            {
                var value = configuration[key];

                TypeConverter typeConverter = TypeDescriptor.GetConverter(typeof(T));

                return (T)typeConverter.ConvertFromString(value);
            }
            catch (Exception ex)
            {
                throw new InvalidCastException($"Key: {key}", ex);
            }
        }
    }
}
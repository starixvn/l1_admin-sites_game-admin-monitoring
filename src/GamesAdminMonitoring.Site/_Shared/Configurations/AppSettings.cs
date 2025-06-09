using GamesAdmin.Core.IdentityServer;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;

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

        Dictionary<string, string> GameServers { get; }

        string GetGameServerUrl(string gameName);
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

        public Dictionary<string, string> GameServers
        {
            get
            {
                var section = configuration.GetSection("GameServers"); // Corrected to use the IConfiguration instance
                if (!section.Exists())
                    return new Dictionary<string, string>();

                return section.GetChildren()
                    .ToDictionary(x => x.Key, x => x.Value);
            }
        }

        public string GetGameServerUrl(string gameName)
        {
            if (GameServers.TryGetValue(gameName, out var url))
                return url;

            return null;
        }
    }
}
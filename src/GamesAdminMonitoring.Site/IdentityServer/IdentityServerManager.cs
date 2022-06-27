using System;
using System.Net.Http;
using System.Threading.Tasks;
using IdentityModel.Client;

namespace GamesAdmin.Core.IdentityServer
{
    public static class IdentityServerManager
    {
        private static HttpClient identityClient;
        private static readonly object lockObj = new object();
        private static IdentityServerAuth auth;
        private static TokenResponse tokenResponse;
        private static DateTime lastTokenRequest;
        private static IDiscoveryCache discoveryCache;
        private const int defaultMinutes = 5;

        public static void Initialize(IdentityServerAuth identityServerAuth)
        {
            auth = identityServerAuth;
            discoveryCache = new DiscoveryCache(identityServerAuth.Url, new DiscoveryPolicy
            {
                RequireHttps = false
            });
        }

        public static async Task<string> GetAccessToken()
        {
            if (tokenResponse == null || lastTokenRequest.AddSeconds(tokenResponse.ExpiresIn) < DateTime.Now.AddMinutes(defaultMinutes))
            {
                var client = GetIdentityClient();

                var disco = await discoveryCache.GetAsync();

                if (disco.IsError)
                {
                    throw new InvalidOperationException(disco.Error);
                }

                tokenResponse = await client.RequestClientCredentialsTokenAsync(new ClientCredentialsTokenRequest
                {
                    Address = disco.TokenEndpoint,
                    ClientId = auth.ClientId,
                    ClientSecret = auth.ClientSecret,
                    Scope = auth.SiteId,
                    Method = HttpMethod.Post
                });

                lastTokenRequest = DateTime.Now;
            }

            return tokenResponse.AccessToken;
        }

        private static HttpClient GetIdentityClient()
        {
            if (identityClient == null)
            {
                lock (lockObj)
                {
                    identityClient = new HttpClient();
                }
            }

            return identityClient;
        }
    }
}

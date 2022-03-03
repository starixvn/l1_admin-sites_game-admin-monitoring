using AutoMapper;
using GamesAdminMonitoring.Site.Database;
using GamesAdminMonitoring.Site.Entities;
using Sentry;
using System.Threading.Tasks;

namespace GamesAdminMonitoring.Site.GameSettings
{
    public interface IGameSettingsService
    {
        Task<GameConfig> GetByName(string name);
        Task<bool> IsAbleToSetSlotResult(string nickname, bool excludeUUS);
    }

    public class GameSettingsService : IGameSettingsService
    {
        private readonly IMapper mapper;
        private readonly IGenericRepository<GameConfigEntity> repository;
        private readonly IGenericRepository<AccountInfoEntity> accountInfoRepository;
        private readonly ISentryClient sentryClient;

        public GameSettingsService(
            IMapper mapper,
            IGenericRepository<GameConfigEntity> repository,
            ISentryClient sentryClient,
            IGenericRepository<AccountInfoEntity> accountInfoRepository)
        {
            this.repository = repository;
            this.mapper = mapper;
            this.sentryClient = sentryClient;
            this.accountInfoRepository = accountInfoRepository;
        }

        public async Task<GameConfig> GetByName(string name)
        {
            var gameEntity = await repository.FindOneAsync(entity => entity.Name == name);

            return gameEntity != null ? mapper.Map<GameConfig>(gameEntity) : default;
        }

        public async Task<bool> IsAbleToSetSlotResult(string nickname, bool excludeUUS)
        {
            var accountInfo = await accountInfoRepository.FindOneAsync(x => x.Name == nickname);

            sentryClient.CaptureMessage($"Unable to set board for {nickname}, currency {accountInfo?.Currency} with excludeUUS {excludeUUS}");

            return (!excludeUUS && accountInfo?.Currency == "UUS") || (accountInfo?.IsBot == true && accountInfo?.Disabled == false);
        }
    }
}
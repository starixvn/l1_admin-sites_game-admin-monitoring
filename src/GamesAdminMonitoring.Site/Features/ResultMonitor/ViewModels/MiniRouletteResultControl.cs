namespace GamesAdminMonitoring.Site.Features.ResultMonitor.ViewModels
{
    public class MiniRouletteResultControl
    {
        public MiniRouletteResultControl(bool isSuccessful)
        {
            IsSuccessful = isSuccessful;
        }

        public bool IsSuccessful { get; }
    }
}

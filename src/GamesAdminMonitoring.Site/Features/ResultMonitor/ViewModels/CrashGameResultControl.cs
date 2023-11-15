namespace GamesAdminMonitoring.Site.Features.ResultMonitor.ViewModels
{
    public class CrashGameResultControl
    {
        public CrashGameResultControl(bool isSuccessful) {
            IsSucessful = isSuccessful;
        }

        public bool IsSucessful { get; }
    }
}

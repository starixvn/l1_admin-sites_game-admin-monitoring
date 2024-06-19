namespace GamesAdminMonitoring.Site.Features.ResultMonitor.ViewModels
{
    public class BaccaratXSettlementViewModel
    {
        public BaccaratXSettlementViewModel(bool isSuccessful)
        {
            IsSuccessful = isSuccessful;
        }


        public bool IsSuccessful { get; set; }
    }
}
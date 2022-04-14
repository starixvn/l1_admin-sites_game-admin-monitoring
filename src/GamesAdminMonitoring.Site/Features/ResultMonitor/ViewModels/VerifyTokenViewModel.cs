using System.Collections.Generic;

namespace GamesAdminMonitoring.Site.Features.ResultMonitor.ViewModels
{
    public enum VerifyTokenMessage
    {
        ValidToken,
        InvalidToken,
        CannotSetResultOnPro
    }

    public class VerifyTokenViewModel
    {
        private readonly Dictionary<VerifyTokenMessage, string> Errors = new Dictionary<VerifyTokenMessage, string>()
        {
            { VerifyTokenMessage.ValidToken, string.Empty },
            { VerifyTokenMessage.InvalidToken, "Invalid Token"},
            { VerifyTokenMessage.CannotSetResultOnPro, "Can not set result on Pro."}
         };

        public VerifyTokenViewModel(VerifyTokenMessage code, string gameConfigName)
        {
            IsValid = code == 0;
            Message = Errors[code];
            GameConfigName = gameConfigName;
        }

        public bool IsValid { get; }

        public string Message { get; }

        public string GameConfigName { get; }
    }
}
using System.Text.Json.Nodes;
using MediatR;

namespace GamesAdminMonitoring.Site.Features.ResultMonitor.Requests
{
  public class SetCascadingClusterSlotRequest : IRequest<JsonNode>
  {
    public string gameConfigName { get; set; } = string.Empty;
    public string name { get; set; } = string.Empty;
    public object result { get; set; }
  }
}
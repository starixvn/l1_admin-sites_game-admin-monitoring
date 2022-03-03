using GamesAdminMonitoring.Site.Database;

namespace GamesAdminMonitoring.Site.Entities
{
    [BsonCollection("admin_users")]
    public class AdminUserEntity : MiniGameBaseEntity
    {
        public string Username { get; set; }

        public string Password { get; set; }

        public bool Isadmin { get; set; }
    }
}

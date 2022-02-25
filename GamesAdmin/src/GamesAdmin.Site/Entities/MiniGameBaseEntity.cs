using GamesAdminMonitoring.Site.Database;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace GamesAdminMonitoring.Site.Entities
{
    public abstract class MiniGameBaseEntity : Document
    {
        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime Time { get; set; }

        public int __v { get; set; }
    }
}
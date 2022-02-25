using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Linq;

namespace GamesAdminMonitoring.Site.Database
{
    public interface IDocument
    {
        [BsonId]
        [BsonRepresentation(BsonType.String)]
        [BsonElement("_id")]
        ObjectId Id { get; set; }
    }

    public class Document : IDocument
    {
        public ObjectId Id { get; set; }

        public static string GetCollectionName(Type documentType)
        {
            return ((BsonCollectionAttribute)documentType.GetCustomAttributes(
                    typeof(BsonCollectionAttribute),
                    true)
                .FirstOrDefault())?.CollectionName;
        }

        public static string GetDatabaseName(Type documentType)
        {
            return ((BsonDatabaseAttribute)documentType.GetCustomAttributes(
                    typeof(BsonDatabaseAttribute),
                    true)
                .FirstOrDefault())?.DatabaseName;
        }
    }
}
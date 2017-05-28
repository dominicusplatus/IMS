using System;
using MongoDB.Driver;
using MongoDB.Bson;

namespace DAL.Repository.Mongo
{
	public class MongoDbContext
	{
		public const string CONNECTION_STRING_NAME = "iotdev";

		public const string CONNECTION_STRING = "mongodb://localhost:27017";
		public const string DATABASE_NAME = "iotdev";

		private static readonly IMongoClient _client;
		private static readonly IMongoDatabase _database;

		static MongoDbContext()
		{
			_client = new MongoClient(CONNECTION_STRING);
			_database = _client.GetDatabase(DATABASE_NAME);
		}

		public void CreateCollection<TEntity>()
		{

			//  _database.CreateCollection()
		}


		public bool IsConnected()
		{
			//return _database.RunCommandAsync((Command<BsonDocument>)"{ping:1}").Result != null;
			return true;
		}

		/// <summary>
		/// The private GetCollection method
		/// </summary>
		/// <typeparam name="TEntity"></typeparam>
		/// <returns></returns>
		public IMongoCollection<TEntity> GetCollection<TEntity>()
		{
			return _database.GetCollection<TEntity>(typeof(TEntity).Name.ToLower() + "s");
		}




	}
}

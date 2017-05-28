using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Core.POCO.Result;
using DAL.Repository;
using DAL.Repository.Mongo;
using MongoDB.Driver;

namespace IotRepository
{
    public interface IIotDeviceRepository : IIotRepository
    {

    }

    public class IotDeviceRepository : IIotDeviceRepository
	{
		public MongoDbContext DbContext { get; set; }


		public IotDeviceRepository()
        {
            DbContext = new MongoDbContext();
        }

        public Task<GetOneResult<TEntity>> GetOne<TEntity>(string id) where TEntity : class, new()
        {
            throw new NotImplementedException();
        }

        public Task<GetOneResult<TEntity>> GetOne<TEntity>(FilterDefinition<TEntity> filter) where TEntity : class, new()
        {
            throw new NotImplementedException();
        }

        public Task<GetManyResult<TEntity>> GetMany<TEntity>(IEnumerable<string> ids) where TEntity : class, new()
        {
            throw new NotImplementedException();
        }

        public Task<GetManyResult<TEntity>> GetMany<TEntity>(FilterDefinition<TEntity> filter) where TEntity : class, new()
        {
            throw new NotImplementedException();
        }

        public IFindFluent<TEntity, TEntity> FindCursor<TEntity>(FilterDefinition<TEntity> filter) where TEntity : class, new()
        {
            throw new NotImplementedException();
        }

        public Task<GetManyResult<TEntity>> GetAll<TEntity>() where TEntity : class, new()
        {
            throw new NotImplementedException();
        }

        public Task<bool> Exists<TEntity>(string id) where TEntity : class, new()
        {
            throw new NotImplementedException();
        }

        public Task<long> Count<TEntity>(string id) where TEntity : class, new()
        {
            throw new NotImplementedException();
        }

        public Task<long> Count<TEntity>(FilterDefinition<TEntity> filter) where TEntity : class, new()
        {
            throw new NotImplementedException();
        }

        public Task<Result> AddOne<TEntity>(TEntity item) where TEntity : class, new()
        {
            throw new NotImplementedException();
        }

        public Task<Result> DeleteOne<TEntity>(string id) where TEntity : class, new()
        {
            throw new NotImplementedException();
        }

        public Task<Result> DeleteMany<TEntity>(IEnumerable<string> ids) where TEntity : class, new()
        {
            throw new NotImplementedException();
        }

        public Task<Result> UpdateOne<TEntity>(string id, UpdateDefinition<TEntity> update) where TEntity : class, new()
        {
            throw new NotImplementedException();
        }

        public Task<Result> UpdateOne<TEntity>(FilterDefinition<TEntity> filter, UpdateDefinition<TEntity> update) where TEntity : class, new()
        {
            throw new NotImplementedException();
        }

        public Task<Result> UpdateMany<TEntity>(IEnumerable<string> ids, UpdateDefinition<TEntity> update) where TEntity : class, new()
        {
            throw new NotImplementedException();
        }

        public Task<Result> UpdateMany<TEntity>(FilterDefinition<TEntity> filter, UpdateDefinition<TEntity> update) where TEntity : class, new()
        {
            throw new NotImplementedException();
        }

        public Task<GetOneResult<TEntity>> GetAndUpdateOne<TEntity>(FilterDefinition<TEntity> filter, UpdateDefinition<TEntity> update, FindOneAndUpdateOptions<TEntity, TEntity> options) where TEntity : class, new()
        {
            throw new NotImplementedException();
        }
    }



}

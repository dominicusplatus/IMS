
using System;
namespace ConfigurationTools
{
    public class BasicDataSourceDefinitionFactory : IDataSourceDefinitionFactory
    {
        public BasicDataSourceDefinitionFactory()
        {
        }

        public IDatasourceDefnition Create()
        {
            return new MysqlDataSourceDefinition(){ConnectionString = "Server=localhost;Database=iotgrid;Uid=root;Pwd=;"};
        }
    }
}

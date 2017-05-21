using System;
namespace ConfigurationTools
{
    public class MysqlDataSourceDefinition : IDatasourceDefnition
    {
        public MysqlDataSourceDefinition()
        {
        }

        public string ConnectionString { get; set; }
    }
}

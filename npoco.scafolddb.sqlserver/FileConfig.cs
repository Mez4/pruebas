using System.Collections.Generic;
using System.Linq;

namespace npoco.scafolddb.sqlserver
{
    /// <summary>
    /// File config
    /// </summary>
    public static class FileConfig
    {
        /// <summary>
        /// This dictionary is used to identify the datatype from sql server
        /// </summary>
        /// <typeparam name="string">Column type from SqlServer</typeparam>
        /// <typeparam name="string">DataType in C#</typeparam>
        public static Dictionary<string, string> ColumnTypes = new Dictionary<string, string>()
        {
            // Common stirng types
            { "varchar", "string" },
            { "nvarchar", "string" },
            { "text", "string"  },
            { "json", "string"  },
            { "mediumtext", "string"  },
            { "longtext", "string"  },

            // Common enum and file types
            { "enum", "string[]"  },
            { "binary", "byte[]"  },
            { "image", "byte[]"  },
            { "char", "string"  },
            { "nchar", "string"  },
            { "varbinary", "byte[]"  },
            { "blob", "byte[]"  },

            // Common integer types
            { "int", "int" },
            { "tinyint", "int"  },
            { "smallint", "int" },
            { "bigint", "Int64"  },

            // Common date types
            { "datetime", "DateTime"  },
            { "timestamp", "DateTime"  },
            { "date", "DateTime"  },
            { "datetime2", "DateTime"  },
            
            // Common precision types
            { "numeric", "decimal"  },
            { "float", "float"  },
            { "decimal", "decimal"  },
            { "double", "double"  },
            { "bit", "bool"  },
            { "money", "decimal"  },
            { "smallmoney", "decimal"  },

            // Custom
            { "sql_variant", "object" }
        };

        public static Dictionary<string, string> ColumnTypesTS = new Dictionary<string, string>()
        {
            // Common stirng types
            { "varchar", "string" },
            { "nvarchar", "string" },
            { "text", "string"  },
            { "json", "string"  },
            { "mediumtext", "string"  },
            { "longtext", "string"  },

            // Common enum and file types
            { "enum", "string[]"  },
            { "binary", "any"  },
            { "image", "any"  },
            { "char", "string"  },
            { "nchar", "string"  },
            { "varbinary", "any"  },
            { "blob", "any"  },

            // Common integer types
            { "int", "number" },
            { "tinyint", "number"  },
            { "smallint", "number" },
            { "bigint", "number"  },

            // Common date types
            { "datetime", "string"  },
            { "timestamp", "string"  },
            { "date", "string"  },
            { "datetime2", "string"  },
            
            // Common precision types
            { "numeric", "number"  },
            { "float", "number"  },
            { "decimal", "number"  },
            { "double", "number"  },
            { "bit", "boolean"  },
            { "money", "number"  },
            { "smallmoney", "number"  },

            // Custom
            { "sql_variant", "any" }
        };

        /// <summary>
        /// Squema template to access the DB
        /// </summary>
        public static string SquemaTemplate = @"using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Data.SqlClient;
using NPoco;

namespace __NAMESPACE__.__DATABASE__
{
    /// <summary>
    /// Class with the connection to interact with the database DBConfia
    /// </summary>
    public class __DATABASE__Context
        {
        /// <summary>
        /// NPoco database
        /// </summary>

        //get headers from request
        public static string GetHeader(HttpRequest request, string headerName)
        {
            var header = request.Headers[headerName];
            if (header.Count > 0)
            {
                return header[0];
            }
            return null;
        }
        public Database database;

        /// <summary>
        /// Generate a new conext
        /// </summary>
        /// <param name='_database'>NPoco database</param>
        public __DATABASE__Context(Database _database)
                {
            this.database = _database;
        }
        //read file .env in parent folder named uicv

        /// <summary>
        /// Generates a new DBConfiaContext instance
        /// </summary>
        /// <param name='_cs'>Connection string for sql server</param>

        public static class EnvFileReader
        {
            public static Dictionary<string, string> ReadEnvFile(string filePath)
            {
                var envVariables = new Dictionary<string, string>();

                try
                {
                    var lines = File.ReadAllLines(filePath);

                    foreach (var line in lines)
                    {
                        var trimmedLine = line.Trim();

                        if (trimmedLine.StartsWith(""#"") || string.IsNullOrEmpty(trimmedLine))
                            continue;

                        var separatorIndex = trimmedLine.IndexOf('=');

                        if (separatorIndex > 0)
                        {
                            var key = trimmedLine.Substring(0, separatorIndex).Trim();
                            var value = trimmedLine.Substring(separatorIndex + 1).Trim();

                            envVariables[key] = value;
                        }
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($""Error al leer el archivo .env: {ex.Message}"");
                }

                return envVariables;
            }
        }


        public static __DATABASE__Context BuildDatabase(string _cs, HttpContext? request)
            {
            string currentDirectory = Directory.GetCurrentDirectory();
            string parentDirectory = Directory.GetParent(currentDirectory).FullName;
            string FilePath = ""null"";
            if (RuntimeInformation.IsOSPlatform(OSPlatform.OSX))
            {

                FilePath = parentDirectory + ""//uicv//.env"";
            }
            else
            {
                FilePath = parentDirectory + ""\\uicv\\.env"";
            }
            var userID = GetHeader(request?.Request, ""UsuarioID"");
            var userName = GetHeader(request?.Request, ""UsuarioNombre"");
            var envVariables = EnvFileReader.ReadEnvFile(FilePath);
            if (envVariables.Count() == 0)
            {
                FilePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "".env"");
                envVariables = EnvFileReader.ReadEnvFile(FilePath);
            }
            var REACT_APP_VERSION = envVariables[""REACT_APP_VERSION""];
            var connectionString = _cs + "";Application Name=V."" + REACT_APP_VERSION + "" ID: "" + userID + ""-"" + userName + "";MultipleActiveResultSets=true;"";
            // Create the SQL connection
            var sqlConnection = new SqlConnection(connectionString);
            // Open the NPoco connection
            sqlConnection.Open();
            return new DBConfiaContext(new NPoco.Database(sqlConnection));
        }

        public async Task Destroy()
        {
            try
            {
                await this.database.Connection.CloseAsync();
                await this.database.Connection.DisposeAsync();
                this.database.Dispose();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }
    }
}";

        /// <summary>
        /// File template to generate the access to the DB
        /// </summary>
        public static string PlantillaTablaCSharp =
@"using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace __NAMESPACE__.__DATABASE__.__SCHEMA__
{
    [TableName(""__schema__.__table__"")]
    [ExplicitColumns]
    __KEY__
    public class __TABLE__
    {
        __COLUMNS__

        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        __FOREIGN_KEYS_PARENT__
        // ###############################################
        // <<
        // Parent foreing keys
        // ###############################################

        // ###############################################
        // Child foreing keys
        // >>
        // ###############################################
        __FOREIGN_KEYS_CHILD__
        // ###############################################
        // <<
        // Child foreing keys
        // ###############################################
        
    }
}
";

        /// <summary>
        /// File template to generate the access to the DB
        /// </summary>
        public static string PlantillaTablaTS =
@"
    export interface I__TABLE__ {
        __COLUMNS__
    }";

        public static string PlatillaEsquemaTS =
@"export namespace __DATABASE_____SCHEMA__ {
        __TABLES__
}";

        private static string ColumnTemplate =
@"      
        __COMPUTED__
        [Column(""__COLUMN__"")]
        public __DATA_TYPE____NULLABLE_TYPE__ __NAME__ { get; set; }
";

        private static string ColumnTemplateTS =
@"      
        __NAME____NULLABLE_TYPE__: __DATA_TYPE__
";

        /// <summary>
        /// Esta funcion genera una columna de C# para el proyecto de back-end
        /// </summary>
        /// <param name="_dataType"></param>
        /// <param name="_nullable"></param>
        /// <param name="_computed"></param>
        /// <param name="_columnName"></param>
        /// <param name="_propName"></param>
        /// <returns></returns>
        public static string GenerarColumnaCSharp(string _dataType, bool _nullable, bool _computed, string _columnName, string _propName)
        {
            // Get our C# Column Type
            string dataType = ColumnTypes[_dataType];

            // Should we add the "?" modificator for nullable
            string nullable_type = "";
            if (!new List<string>() { "string", "object", "byte[]", "char[]" }.Contains(dataType) && _nullable)
            {
                nullable_type = "?";
            }

            return ColumnTemplate
                .Replace("__COMPUTED__", _computed ? "[ComputedColumn(ComputedColumnType.Always)]" : "")
                .Replace("__COLUMN__", _columnName)
                .Replace("__DATA_TYPE__", dataType)
                .Replace("__NULLABLE_TYPE__", nullable_type)
                .Replace("__NAME__", _propName)
            ;
        }

        /// <summary>
        /// Esta funcion genera una columna de typescript para el proyecto de UI
        /// </summary>
        /// <param name="_dataType">Tipo de datos</param>
        /// <param name="_nullable">Es nullable ?</param>
        /// <param name="_propName">Nombre de la propiedad</param>
        /// <returns></returns>
        public static string GenerarColumnaTS(string _dataType, bool _nullable, string _propName)
        {
            // Get the TS data-type
            string dataType = ColumnTypesTS[_dataType];

            // Should we add the "?" modificator for nullable
            string nullable_type = "";
            if (_nullable)
                nullable_type = "?";
            return ColumnTemplateTS
                .Replace("__NAME__", _propName)
                .Replace("__NULLABLE_TYPE__", nullable_type)
                .Replace("__DATA_TYPE__", dataType)
            ;
        }

        private static string TemplateForeignKeyParentFunction =
@"
        public async Task<List<__NAMESPACE__.__DATABASE__.__SCHEMA__.__TABLE__>> CH____PROP_NAME__(__DATABASE__Context parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<__NAMESPACE__.__DATABASE__.__SCHEMA__.__TABLE__>(""__WHERE__"", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }
";

        public static string GenerateForeignKeyParent(DBItem _config, Table _Table, string ForeingKeyName, List<Foreignkey> _ForeignKeyColumns)
        {
            if (!ForeingKeyName.Contains("__"))
                return "";

            // Name
            string fkName = ForeingKeyName.Split("__")[1];

            // Return value
            string _Return = "";

            // Define a return variable
            /*
            if (_ForeignKeyColumns.Count == 1)
            {
                _Return += TemplateForeignKeyParentReference
                    .Replace("__NAMESPACE__", _config.Namespace)
                    .Replace("__DATABASE__", _config.Db)
                    .Replace("__SCHEMA__", _ForeignKeyColumns[0].RSchema)
                    .Replace("__TABLE__", _ForeignKeyColumns[0].RTable)

                    .Replace("__PARENT_COLUMN__", _ForeignKeyColumns[0].PColumn)
                    .Replace("__REFERENCE_COLUMN__", _ForeignKeyColumns[0].RColumn)

                    .Replace("__PROP_NAME__", fkName)
                    ;
            }
            */

            string whereQuery = "WHERE ";
            for (var f = 0; f < _ForeignKeyColumns.Count; f++)
                whereQuery += f == 0
                    ? string.Concat(_ForeignKeyColumns[f].PColumn, " = @", _ForeignKeyColumns[f].RColumn)
                    : string.Concat(" AND ", _ForeignKeyColumns[f].PColumn, " = @", _ForeignKeyColumns[f].RColumn);

            _Return += TemplateForeignKeyParentFunction
                .Replace("__NAMESPACE__", _config.Namespace)
                .Replace("__DATABASE__", _config.Db)
                .Replace("__SCHEMA__", _ForeignKeyColumns[0].RSchema)
                .Replace("__TABLE__", _ForeignKeyColumns[0].RTable)

                .Replace("__PARENT_COLUMN__", _ForeignKeyColumns[0].PColumn)
                .Replace("__REFERENCE_COLUMN__", _ForeignKeyColumns[0].RColumn)

                .Replace("__PROP_NAME__", fkName)
                .Replace("__WHERE__", whereQuery)
                ;

            return _Return;
        }

        /*
        private static string TemplateForeignKeyChildReference =
@"
        [Reference(ReferenceType.OneToOne, ColumnName = ""__REFERENCE_COLUMN__"", ReferenceMemberName = ""__PARENT_COLUMN__"")]
        public __NAMESPACE__.__DATABASE__.__SCHEMA__.__TABLE__ __PROP_NAME__ { get; set; }
";
        */

        private static string TemplateForeignKeyChildFunction =
@"
        public async Task<List<__NAMESPACE__.__DATABASE__.__SCHEMA__.__TABLE__>> PA____PROP_NAME__(__DATABASE__Context parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<__NAMESPACE__.__DATABASE__.__SCHEMA__.__TABLE__>(""__WHERE__"", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }
";

        public static string GenerateForeignKeyChild(DBItem _config, Table _Table, string ForeingKeyName, List<Foreignkey> _ForeignKeyColumns)
        {
            if (!ForeingKeyName.Contains("__"))
                return "";

            // Name
            string fkName = ForeingKeyName.Split("__")[0].Replace("FK_", "");

            // Return value
            string _Return = "";

            // Define a unique prop name
            string propName = string.Concat(_ForeignKeyColumns[0].PSchema, "___", _ForeignKeyColumns[0].PTable, "___", string.Join("__", _ForeignKeyColumns.Select(x => x.PColumn)));

            // Define a return variable
            /*
            if (_ForeignKeyColumns.Count == 1)
            {
                _Return += TemplateForeignKeyChildReference
                    .Replace("__NAMESPACE__", _config.Namespace)
                    .Replace("__DATABASE__", _config.Db)
                    .Replace("__SCHEMA__", _ForeignKeyColumns[0].PSchema)
                    .Replace("__TABLE__", _ForeignKeyColumns[0].PTable)

                    .Replace("__PARENT_COLUMN__", _ForeignKeyColumns[0].PColumn)
                    .Replace("__REFERENCE_COLUMN__", _ForeignKeyColumns[0].RColumn)

                    .Replace("__PROP_NAME__", propName)
                    ;
            }
            */

            string whereQuery = "WHERE ";
            for (var f = 0; f < _ForeignKeyColumns.Count; f++)
                whereQuery += f == 0
                    ? string.Concat(_ForeignKeyColumns[f].RColumn, " = @", _ForeignKeyColumns[f].PColumn)
                    : string.Concat(" AND ", _ForeignKeyColumns[f].PColumn, " = @", _ForeignKeyColumns[f].RColumn);

            _Return += TemplateForeignKeyChildFunction
                .Replace("__NAMESPACE__", _config.Namespace)
                .Replace("__DATABASE__", _config.Db)
                .Replace("__SCHEMA__", _ForeignKeyColumns[0].PSchema)
                .Replace("__TABLE__", _ForeignKeyColumns[0].PTable)

                .Replace("__PARENT_COLUMN__", _ForeignKeyColumns[0].PColumn)
                .Replace("__REFERENCE_COLUMN__", _ForeignKeyColumns[0].RColumn)

                .Replace("__PROP_NAME__", propName)
                .Replace("__WHERE__", whereQuery)
                ;

            return _Return;
        }
    }
}

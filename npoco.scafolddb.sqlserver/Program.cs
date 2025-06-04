using System.Runtime.CompilerServices;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using System.IO;
using System;

// Use the sqlClient
using Microsoft.Data.SqlClient;

// Json parser
using System.Text.Json;

namespace npoco.scafolddb.sqlserver
{
    /// <summary>
    /// Main class
    /// </summary>
    class Program
    {
        /// <summary>
        /// Application entry point
        /// </summary>
        /// <param name="args">dbConfig file path</param>
        static async Task<int> Main(string[] args)
        {
            try
            {
                // Get our values
                ProgramArgs programArgs = new ProgramArgs();
                CommandLineParser.CommandLineParser parser = new CommandLineParser.CommandLineParser();
                parser.ExtractArgumentAttributes(programArgs);
                parser.ParseCommandLine(args);

                // Validate
                if (string.IsNullOrEmpty(programArgs.InFile) || string.IsNullOrEmpty(programArgs.OutFolder))
                {
                    Console.WriteLine("Se requiere definir el archivo de configuración y la carpeta de destino");
                    return 1;
                }

                // Get our current directory
                var cDirectory = Directory.GetCurrentDirectory();

                // File content
                string fileContent = null;

                // Check if there is a file with our current directory and the file provided
                if (File.Exists(string.Concat(cDirectory, programArgs.InFile)))
                {
                    fileContent = await File.ReadAllTextAsync(string.Concat(cDirectory, "/", programArgs.InFile));
                }
                // Check if there is a file with our current directory and the file provided (v2)
                else if (File.Exists(string.Concat(cDirectory, "/", programArgs.InFile)))
                {
                    fileContent = await File.ReadAllTextAsync(string.Concat(cDirectory, programArgs.InFile));
                }
                // Check if there is a file with our absolute path
                else if (File.Exists(programArgs.InFile))
                {
                    fileContent = await File.ReadAllTextAsync(programArgs.InFile);
                }
                else
                {
                    Console.WriteLine(string.Format("No se encontrol el archivo de inicio: {0}", programArgs.InFile));
                    return 1;
                }

                // Directorio de salida de C#
                var directorioSalidaCSharp = new DirectoryInfo(programArgs.OutFolder);
                if (!directorioSalidaCSharp.Exists)
                {
                    try
                    {
                        // Generate the directory
                        directorioSalidaCSharp.Create();
                    }
                    catch (Exception ex)
                    {
                        // Error while creating the directory
                        Console.WriteLine(string.Format("Error al generar el directorio: {0}", ex.Message));
                        return 1;
                    }
                }
                else
                {
                    try
                    {
                        // Delete the directory recorsibly
                        directorioSalidaCSharp.Delete(true);

                    }
                    catch (Exception ex)
                    {
                        // Error de-structuring the directories
                        Console.WriteLine(string.Format("Error al limpiar el directorio de trabajo: {0}", ex.Message));
                        return 1;
                    }
                }

                // Directorio de salida de C#
                var directorioSalidaTS = new DirectoryInfo(programArgs.OutFolderTS);
                if (!directorioSalidaTS.Exists)
                {
                    try
                    {
                        // Generate the directory
                        directorioSalidaTS.Create();
                    }
                    catch (Exception ex)
                    {
                        // Error while creating the directory
                        Console.WriteLine(string.Format("Error al generar el directorio: {0}", ex.Message));
                        return 1;
                    }
                }
                else
                {
                    try
                    {
                        // Delete the directory recorsibly
                        directorioSalidaTS.Delete(true);

                    }
                    catch (Exception ex)
                    {
                        // Error de-structuring the directories
                        Console.WriteLine(string.Format("Error al limpiar el directorio de trabajo: {0}", ex.Message));
                        return 1;
                    }
                }


                // Parse the file content
                DBItem[] configuraciones = JsonSerializer.Deserialize<DBItem[]>(fileContent);

                // Iterate the configurations
                foreach (var config in configuraciones)
                {
                    // Information
                    Console.WriteLine("############################################################");
                    Console.WriteLine(string.Format("Parseando la configuración de {0}", config.Namespace));
                    Console.WriteLine("############################################################");
                    Console.WriteLine("");

                    // SqlServer connection
                    var sqlConnection = new SqlConnection(config.Cs);

                    try
                    {
                        // Open the connection
                        Console.WriteLine("Conectando a la BD");
                        await sqlConnection.OpenAsync();
                        var database = new NPoco.Database(sqlConnection);

                        // Get all the foreign keys from the BD
                        Console.WriteLine("Obteniendo catalogo de llaves foraneas");
                        string fk_query = @"
                        select
                            fks.name				as Name
                            , ps.name				as PSchema
                            , pt.name				as PTable
                            , pc.name				as PColumn
                            , rs.name				as RSchema
                            , rt.name				as RTable
                            , rc.name				as RColumn
                        from 
                            sys.foreign_key_columns as fk
                        inner join
                            sys.foreign_keys fks on fk.constraint_object_id = fks.object_id 
                        inner join 
                            sys.tables as pt on fk.parent_object_id = pt.object_id
                        inner join
                            sys.schemas ps on pt.schema_id  = ps.schema_id 
                        inner join 
                            sys.columns as pc on fk.parent_object_id = pc.object_id and fk.parent_column_id = pc.column_id
                        inner join 
                            sys.tables as rt on fk.referenced_object_id = rt.object_id    
                        inner join
                            sys.schemas rs on rt.schema_id = rs.schema_id
                        inner join 
                            sys.columns as rc on fk.referenced_object_id = rc.object_id and fk.referenced_column_id = rc.column_id
                        ORDER BY
                            ps.name, pt.name
                        ";
                        var foreign_keys = await database.QueryAsync<Foreignkey>(fk_query).GroupBy(x => new { x.Name, x.PSchema, x.PTable, x.RSchema, x.RTable }).ToListAsync();

                        // Generate the context file
                        Console.WriteLine("Generando Contexto");
                        directorioSalidaCSharp.CreateSubdirectory(config.Db);
                        directorioSalidaTS.CreateSubdirectory(config.Db);

                        // Obtenemos el directorio de la base de datos
                        DirectoryInfo directorio_csharp = new DirectoryInfo(string.Concat(directorioSalidaCSharp.FullName, "/", config.Db));
                        DirectoryInfo directorio_typescript = new DirectoryInfo(string.Concat(directorioSalidaTS.FullName, "/", config.Db));

                        // Format the file and write it
                        var dbFileContent = npoco.scafolddb.sqlserver.FileConfig.SquemaTemplate
                            .Replace("__NAMESPACE__", config.Namespace)
                            .Replace("__DATABASE__", config.Db);
                        await System.IO.File.WriteAllTextAsync(string.Concat(directorio_csharp.FullName, "/", StringToCappital(config.Db), ".cs"), dbFileContent);

                        // Fetch the tables
                        Console.WriteLine("Obteniendo las tablas");
                        var tablas = await database.FetchAsync<Table>("SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_CATALOG=@0", config.Db);
                        tablas = tablas.OrderBy(t => t.TABLE_SCHEMA).ThenBy(t => t.TABLE_NAME).ToList();

                        // Generamos la variable de tabla actual
                        string esquema_actual = tablas[0].TABLE_SCHEMA;
                        string esquema_string = "";

                        // Iterate the tables
                        for (var t = 0; t < tablas.Count; t++)
                        {
                            // ##########################################################################
                            // BASIC DATA
                            // >>
                            // ##########################################################################
                            if (tablas[t].TABLE_NAME == "Personas")
                            {
                                Console.WriteLine("DEBUG");
                            }

                            // Generamos el archivo basico de la tabla para C#
                            var archivoTablaCSharp = npoco.scafolddb.sqlserver.FileConfig.PlantillaTablaCSharp

                                // Información basica de la tabla
                                .Replace("__NAMESPACE__", config.Namespace)
                                .Replace("__DATABASE__", config.Db)
                                .Replace("__SCHEMA__", tablas[t].TABLE_SCHEMA)
                                .Replace("__TABLE__", tablas[t].TABLE_NAME)

                                // Información basica 2
                                .Replace("__schema__", tablas[t].TABLE_SCHEMA)
                                .Replace("__table__", tablas[t].TABLE_NAME)
                            ;

                            // Generamos el archivo basico de la tabla para TypeScript
                            var archivoTablaTS = npoco.scafolddb.sqlserver.FileConfig.PlantillaTablaTS

                                // Informacion basica de la tabla
                                .Replace("__DATABASE__", config.Db)
                                .Replace("__SCHEMA__", tablas[t].TABLE_SCHEMA)
                                .Replace("__TABLE__", tablas[t].TABLE_NAME)
                            ;

                            // ##########################################################################
                            // <<
                            // BASIC DATA
                            // ##########################################################################

                            // ##########################################################################
                            // COLUMNS
                            // >>
                            // ##########################################################################

                            // Obtenemos las columnas
                            string columnas_csharp = "";
                            string columnas_typescript = "";

                            // Query de columnas
                            Console.WriteLine(string.Format("Obteniendo columnas de ({0}), de tipo: {1}", tablas[t].TABLE_NAME, tablas[t].TABLE_TYPE));
                            string columns_query = @"
                          SELECT				COL.TABLE_CATALOG
                                                , COL.TABLE_SCHEMA
                                                , COL.TABLE_NAME
                                                , COL.COLUMN_NAME
                                                , COL.ORDINAL_POSITION
                                                , COL.COLUMN_DEFAULT
                                                , COL.IS_NULLABLE
                                                , CAST(IIF(COL.IS_NULLABLE = 'YES', 1, 0) AS BIT) [IS_NULLABLE_BOOL]
                                                , COL.DATA_TYPE
                                                , COL.CHARACTER_MAXIMUM_LENGTH
                                                , COL.CHARACTER_OCTET_LENGTH
                                                , COL.NUMERIC_PRECISION
                                                , COL.NUMERIC_PRECISION_RADIX
                                                , COL.NUMERIC_SCALE
                                                , COL.DATETIME_PRECISION
                                                , COL.CHARACTER_SET_CATALOG
                                                , COL.COLLATION_SCHEMA
                                                , COLUMNPROPERTY(object_id(COL.TABLE_SCHEMA+'.'+COL.TABLE_NAME), COL.COLUMN_NAME, 'IsIdentity')
                                                [IDENTITY_COLUMN]
                                                , COLUMNPROPERTY(object_id(COL.TABLE_SCHEMA+'.'+COL.TABLE_NAME), COL.COLUMN_NAME, 'IsComputed')
                                                [COMPUTED_COLUMN]
                            FROM				INFORMATION_SCHEMA.COLUMNS			COL
                            LEFT JOIN			INFORMATION_SCHEMA.TABLES			TAB
                            ON					COL.TABLE_SCHEMA					= TAB.TABLE_SCHEMA
                            AND					COL.TABLE_NAME						= TAB.TABLE_NAME
                            WHERE				TAB.TABLE_CATALOG					= @0
                            AND					TAB.TABLE_SCHEMA					= @1
                            AND					TAB.TABLE_NAME						= @2

                            ";

                            var columns = await database.FetchAsync<Column>(columns_query, config.Db, tablas[t].TABLE_SCHEMA, tablas[t].TABLE_NAME);

                            // ############################################
                            // This is a table and (most) have a primary key
                            if (tablas[t].TABLE_TYPE == "BASE TABLE")
                            {
                                try
                                {
                                    // Get the primary key constraint
                                    Console.WriteLine(string.Format("Obteniendo llaves", tablas[t].TABLE_NAME, tablas[t].TABLE_TYPE));
                                    var column_keys = await database.FetchAsync<Key>("SELECT * FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE TABLE_CATALOG=@0 AND TABLE_SCHEMA=@1 AND TABLE_NAME=@2 AND CONSTRAINT_TYPE='PRIMARY KEY'", config.Db, tablas[t].TABLE_SCHEMA, tablas[t].TABLE_NAME);

                                    if (column_keys.Count() > 0)
                                    {
                                        // Get the columns affecting the primary key
                                        var columns_key = await database.FetchAsync<KeyColumn>("SELECT * FROM INFORMATION_SCHEMA.CONSTRAINT_COLUMN_USAGE WHERE TABLE_CATALOG=@0 AND TABLE_SCHEMA=@1 AND TABLE_NAME=@2 AND CONSTRAINT_NAME=@3", config.Db, tablas[t].TABLE_SCHEMA, tablas[t].TABLE_NAME, column_keys[0].CONSTRAINT_NAME);

                                        // Check if our primary key is an incrementing one
                                        if (columns_key.Count == 1 && columns.Where(col => col.COLUMN_NAME == columns_key[0].COLUMN_NAME && col.IDENTITY_COLUMN == true).Count() > 0)
                                        {
                                            archivoTablaCSharp = archivoTablaCSharp.Replace("__KEY__", string.Format(@"[PrimaryKey(""{0}"")]", columns_key[0].COLUMN_NAME));
                                        }
                                        else
                                        {
                                            archivoTablaCSharp = archivoTablaCSharp.Replace("__KEY__", string.Format(@"[PrimaryKey(""{0}"", AutoIncrement=false)]", string.Join(",", columns_key.Select(col => col.COLUMN_NAME))));
                                        }
                                    }
                                    else
                                    {
                                        Console.WriteLine("ALERTA:: No se detectaron llaves primarias para la tabla");
                                        archivoTablaCSharp = archivoTablaCSharp.Replace("__KEY__", "// No primary key detected");
                                    }
                                }
                                catch (Exception ex)
                                {
                                    Console.WriteLine(string.Format("Errror al definir las llaves:", ex.Message));
                                }

                            }
                            else
                            {
                                archivoTablaCSharp = archivoTablaCSharp.Replace("__KEY__", "// View, no primary key needed");
                            }

                            // Iterate the columns
                            foreach (var c in columns)
                            {
                                columnas_csharp += FileConfig.GenerarColumnaCSharp(c.DATA_TYPE, c.IS_NULLABLE_BOOL, c.COMPUTED_COLUMN, c.COLUMN_NAME, c.COLUMN_NAME);
                                columnas_typescript += FileConfig.GenerarColumnaTS(c.DATA_TYPE, c.IS_NULLABLE_BOOL, c.COLUMN_NAME);
                            }

                            // Add the column info
                            archivoTablaCSharp = archivoTablaCSharp.Replace("__COLUMNS__", columnas_csharp);
                            archivoTablaTS = archivoTablaTS.Replace("__COLUMNS__", columnas_typescript);

                            // Generamos la tabla del esquema (csharp)
                            string path_esquema_csharp = string.Concat(directorio_csharp.FullName, "/", tablas[t].TABLE_SCHEMA);
                            if (!System.IO.Directory.Exists(path_esquema_csharp))
                                System.IO.Directory.CreateDirectory(path_esquema_csharp);

                            // ##########################################################################
                            // <<
                            // COLUMNS
                            // ##########################################################################

                            // ##########################################################################
                            // FOREIGN KEYS [PARENT]
                            // >>
                            // ##########################################################################

                            string parentkeyString = "";
                            var parentKeys = foreign_keys.Where(x => x.Key.PSchema == tablas[t].TABLE_SCHEMA && x.Key.PTable == tablas[t].TABLE_NAME).OrderBy(x => x.Key.PSchema).ThenBy(x => x.Key.PTable).ToList();
                            foreach (var pk in parentKeys)
                                parentkeyString += FileConfig.GenerateForeignKeyParent(config, tablas[t], pk.Key.Name, await pk.ToListAsync());


                            archivoTablaCSharp = archivoTablaCSharp.Replace("__FOREIGN_KEYS_PARENT__", parentkeyString);

                            // ##########################################################################
                            // <<
                            // FOREIGN KEYS [PARENT]
                            // ##########################################################################


                            // ##########################################################################
                            // FOREIGN KEYS [CHILD]
                            // >>
                            // ##########################################################################

                            string childkeyString = "";
                            var childKeys = foreign_keys.Where(x => x.Key.RSchema == tablas[t].TABLE_SCHEMA && x.Key.RTable == tablas[t].TABLE_NAME).OrderBy(x => x.Key.RSchema).ThenBy(x => x.Key.RTable).ToList();
                            foreach (var pk in childKeys)
                                childkeyString += FileConfig.GenerateForeignKeyChild(config, tablas[t], pk.Key.Name, await pk.ToListAsync());


                            archivoTablaCSharp = archivoTablaCSharp.Replace("__FOREIGN_KEYS_CHILD__", childkeyString);


                            // ##########################################################################
                            // <<
                            // FOREIGN KEYS [CHILD]
                            // ##########################################################################

                            // Escribimos el archivo de C#
                            await System.IO.File.WriteAllTextAsync(string.Concat(path_esquema_csharp, "/", StringToCappital(tablas[t].TABLE_NAME), ".cs"), archivoTablaCSharp);

                            // Agregamos la interfaz al string del esquema
                            esquema_string += archivoTablaTS;
                            // await System.IO.File.WriteAllTextAsync(string.Concat(path_esquema_typescript, "/", "I", tabla.TABLE_NAME, ".ts"), archivoTablaTS);

                            // Validamos si nuestro esquema es diferente
                            if (t == tablas.Count - 1 || esquema_actual != tablas[t + 1].TABLE_SCHEMA)
                            {

                                // Generamos nuestro script de typescript
                                var scriptTS = FileConfig.PlatillaEsquemaTS
                                    .Replace("__DATABASE__", config.Db)
                                    .Replace("__SCHEMA__", esquema_actual)
                                    .Replace("__TABLES__", esquema_string)
                                ;

                                // Escribimos nuestro archivo de TS
                                await System.IO.File.WriteAllTextAsync(string.Concat(directorio_typescript.FullName, "/", tablas[t].TABLE_SCHEMA, ".ts"), scriptTS);

                                // Limpiamos nuestro script
                                scriptTS = "";
                                esquema_string = "";
                            }

                            // Actualizamos nuestro esquema
                            esquema_actual = tablas[t].TABLE_SCHEMA;
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine(string.Format("Error al conectar con la base de datos: ({0})", ex.Message));
                    }
                    finally
                    {
                        await sqlConnection.CloseAsync();
                    }
                }

            }
            catch (Exception ex)
            {
                Console.WriteLine(string.Format("Error al obtener el archivo: {0}", ex.Message));
                return 1;
            }

            return 0;
        }

        private static string StringToCappital(string prev)
        {
            return CultureInfo.CurrentCulture.TextInfo.ToTitleCase(prev.ToLower().Replace("_", " ")).Replace(" ", "");
        }
    }
}
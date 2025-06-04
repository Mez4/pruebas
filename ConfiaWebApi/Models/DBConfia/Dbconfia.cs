using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Data.SqlClient;
using NPoco;

namespace DBContext.DBConfia
{
    /// <summary>
    /// Class with the connection to interact with the database DBConfia
    /// </summary>
    public class DBConfiaContext
        {
        /// <summary>
        /// NPoco database
        /// </summary>
        /// 

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
        public DBConfiaContext(Database _database)
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

                        if (trimmedLine.StartsWith("#") || string.IsNullOrEmpty(trimmedLine))
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
                    Console.WriteLine($"Error al leer el archivo .env: {ex.Message}");
                }

                return envVariables;
            }
        }
        public static DBConfiaContext BuildDatabase(string _cs, HttpContext? request)
{
    string currentDirectory = Directory.GetCurrentDirectory();
    string parentDirectory = Directory.GetParent(currentDirectory).FullName;
    string FilePath = "null";

    if (RuntimeInformation.IsOSPlatform(OSPlatform.OSX))
    {
        FilePath = parentDirectory + "//uicv//.env";
    }
    else
    {
        FilePath = parentDirectory + "\\uicv\\.env";
    }

    var userID = GetHeader(request?.Request, "UsuarioID");
    var userName = GetHeader(request?.Request, "UsuarioNombre");
    var envVariables = EnvFileReader.ReadEnvFile(FilePath);

    if (envVariables.Count() == 0)
    {
        FilePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, ".env");
        envVariables = EnvFileReader.ReadEnvFile(FilePath);
    }

    var REACT_APP_VERSION = envVariables["REACT_APP_VERSION"];
    var connectionString = _cs + ";Application Name=V." + REACT_APP_VERSION + " ID: " + userID + "-" + userName + ";MultipleActiveResultSets=true;";

    var sqlConnection = new SqlConnection(connectionString);
    sqlConnection.Open();

    var db = new NPoco.Database(sqlConnection);

    return new DBConfiaContext(db);
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
}
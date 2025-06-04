using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Sistema
{
    [TableName("Sistema.Funciones")]
    [ExplicitColumns]
    [PrimaryKey("FuncionID")]
    public class Funciones
    {
              
        
        [Column("FuncionID")]
        public int FuncionID { get; set; }
      
        
        [Column("Funcion")]
        public string Funcion { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        // ###############################################
        // <<
        // Parent foreing keys
        // ###############################################

        // ###############################################
        // Child foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.Sistema.FuncionesUsuario>> PA__Sistema___FuncionesUsuario___FuncionID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Sistema.FuncionesUsuario>("WHERE FuncionID = @FuncionID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        // ###############################################
        // <<
        // Child foreing keys
        // ###############################################
        
    }
}

using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Sistema
{
    [TableName("Sistema.FuncionesUsuario")]
    [ExplicitColumns]
    [PrimaryKey("FuncionID,UsuarioID", AutoIncrement=false)]
    public class FuncionesUsuario
    {
              
        
        [Column("FuncionID")]
        public int FuncionID { get; set; }
      
        
        [Column("Permiso")]
        public bool Permiso { get; set; }
      
        
        [Column("UsuarioID")]
        public int UsuarioID { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.Seguridad.Usuarios>> CH__SEGURIDAD_USUARIOS352CA01A(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios>("WHERE UsuarioID = @UsuarioID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Sistema.Funciones>> CH__FUNCION(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Sistema.Funciones>("WHERE FuncionID = @FuncionID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        // ###############################################
        // <<
        // Parent foreing keys
        // ###############################################

        // ###############################################
        // Child foreing keys
        // >>
        // ###############################################
        
        // ###############################################
        // <<
        // Child foreing keys
        // ###############################################
        
    }
}

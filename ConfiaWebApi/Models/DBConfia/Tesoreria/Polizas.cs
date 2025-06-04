using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Tesoreria
{
    [TableName("Tesoreria.Polizas")]
    [ExplicitColumns]
    [PrimaryKey("PolizaID")]
    public class Polizas
    {
              
        
        [Column("PolizaID")]
        public Int64 PolizaID { get; set; }
      
        
        [Column("Referencia")]
        public Int64? Referencia { get; set; }
      
        
        [Column("Numero")]
        public Int64? Numero { get; set; }
      
        
        [Column("Fecha")]
        public DateTime Fecha { get; set; }
      
        
        [Column("Concepto")]
        public string Concepto { get; set; }
      
        
        [Column("CatEstatusMovID")]
        public int? CatEstatusMovID { get; set; }
      
        
        [Column("TipoPolizaID")]
        public int? TipoPolizaID { get; set; }
      
        
        [Column("PersonaID")]
        public Int64 PersonaID { get; set; }
      
        
        [Column("UsuarioID")]
        public int UsuarioID { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.General.Personas>> CH__PERSONA(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.Personas>("WHERE PersonaID = @PersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Seguridad.Usuarios>> CH__SEGURIDAD_USUARIOS24D1FD1E(DBConfiaContext parContext)
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

        // ###############################################
        // <<
        // Parent foreing keys
        // ###############################################

        // ###############################################
        // Child foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.Bancos.MovimientosBancarios>> PA__Bancos___MovimientosBancarios___PolizaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Bancos.MovimientosBancarios>("WHERE PolizaID = @PolizaID", this).ToListAsync();
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

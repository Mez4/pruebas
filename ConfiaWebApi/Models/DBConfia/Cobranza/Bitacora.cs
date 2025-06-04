using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Cobranza
{
    [TableName("Cobranza.Bitacora")]
    [ExplicitColumns]
    // No primary key detected
    public class Bitacora
    {
              
        
        [Column("Id")]
        public int Id { get; set; }
      
        
        [Column("Usuario")]
        public int Usuario { get; set; }
      
        
        [Column("UsuarioPersona")]
        public int UsuarioPersona { get; set; }
      
        
        [Column("MesaCobranzaID")]
        public int? MesaCobranzaID { get; set; }
      
        
        [Column("GestorId")]
        public Int64? GestorId { get; set; }
      
        
        [Column("EncargadoId")]
        public Int64? EncargadoId { get; set; }
      
        
        [Column("DistribuidorID")]
        public int? DistribuidorID { get; set; }
      
        
        [Column("Clave")]
        public string Clave { get; set; }
      
        
        [Column("Fecha")]
        public DateTime Fecha { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.Cobranza.DirectorMesaCobranza>> CH__ENCARGADO(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Cobranza.DirectorMesaCobranza>("WHERE EncargadoId = @DirectorMesaCobranzaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Cobranza.Procesos>> CH__CLAVE(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Cobranza.Procesos>("WHERE Clave = @Clave", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Cobranza.MesaCobranza>> CH__MESACOBRANZA(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Cobranza.MesaCobranza>("WHERE MesaCobranzaID = @MesaCobranzaID", this).ToListAsync();
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

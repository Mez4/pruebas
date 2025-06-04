using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Prospeccion
{
    [TableName("Prospeccion.ValidacionLlamadasMesa")]
    [ExplicitColumns]
    [PrimaryKey("ValidacionLlamadasMesaID")]
    public class ValidacionLlamadasMesa
    {
              
        
        [Column("ValidacionLlamadasMesaID")]
        public int ValidacionLlamadasMesaID { get; set; }
      
        
        [Column("ProspectoID")]
        public Int64 ProspectoID { get; set; }
      
        
        [Column("AsignaAnalistaID")]
        public int AsignaAnalistaID { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.Prospeccion.AsignaAnalista>> CH__ASIGNA_ANALISTA(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.AsignaAnalista>("WHERE AsignaAnalistaID = @AsignaAnalistaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Prospeccion.Prospectos>> CH__PROSPECTO(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.Prospectos>("WHERE ProspectoID = @ProspectoID", this).ToListAsync();
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
        
        public async Task<List<DBContext.DBConfia.Prospeccion.LogMensajes>> PA__Prospeccion___LogMensajes___ValidacionLlamadasMesaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.LogMensajes>("WHERE ValidacionLlamadasMesaID = @ValidacionLlamadasMesaID", this).ToListAsync();
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

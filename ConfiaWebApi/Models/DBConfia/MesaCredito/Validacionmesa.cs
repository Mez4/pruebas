using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.MesaCredito
{
    [TableName("MesaCredito.ValidacionMesa")]
    [ExplicitColumns]
    [PrimaryKey("ValidacionMesaID")]
    public class ValidacionMesa
    {
              
        
        [Column("ValidacionMesaID")]
        public int ValidacionMesaID { get; set; }
      
        
        [Column("SolicitudMesaCreditoID")]
        public int SolicitudMesaCreditoID { get; set; }
      
        
        [Column("AsignaAnalistaID")]
        public int AsignaAnalistaID { get; set; }
      
        
        [Column("enSucursal")]
        public bool enSucursal { get; set; }
      
        
        [Column("CatValidacionMesaID")]
        public int CatValidacionMesaID { get; set; }


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
        
        public async Task<List<DBContext.DBConfia.MesaCredito.LogMensajes>> PA__MesaCredito___LogMensajes___ValidacionMesaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.MesaCredito.LogMensajes>("WHERE ValidacionMesaID = @ValidacionMesaID", this).ToListAsync();
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

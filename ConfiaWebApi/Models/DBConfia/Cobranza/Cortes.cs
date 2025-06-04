using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Cobranza
{
    [TableName("Cobranza.Cortes")]
    [ExplicitColumns]
    [PrimaryKey("corteId")]
    public class Cortes
    {
              
        
        [Column("corteId")]
        public Int64 corteId { get; set; }
      
        
        [Column("cobradorAsignado")]
        public string cobradorAsignado { get; set; }
      
        
        [Column("monto")]
        public decimal monto { get; set; }
      
        
        [Column("folioCorte")]
        public string folioCorte { get; set; }
      
        
        [Column("creacionFecha")]
        public DateTime? creacionFecha { get; set; }
      
        
        [Column("estatus")]
        public string estatus { get; set; }


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
        
        public async Task<List<DBContext.DBConfia.Cobranza.Abonos_x_Corte>> PA__Cobranza___Abonos_x_Corte___corteId(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Cobranza.Abonos_x_Corte>("WHERE corteId = @corteId", this).ToListAsync();
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

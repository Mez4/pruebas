using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Cobranza
{
    [TableName("Cobranza.Abonos")]
    [ExplicitColumns]
    [PrimaryKey("abonoId")]
    public class Abonos
    {
              
        
        [Column("abonoId")]
        public Int64 abonoId { get; set; }
      
        
        [Column("porCobrarId")]
        public Int64 porCobrarId { get; set; }
      
        
        [Column("folioAbono")]
        public string folioAbono { get; set; }
      
        
        [Column("folioCancelacion")]
        public string folioCancelacion { get; set; }
      
        
        [Column("montoPorCobrarAntesDeAbono")]
        public decimal montoPorCobrarAntesDeAbono { get; set; }
      
        
        [Column("monto")]
        public decimal monto { get; set; }
      
        
        [Column("estatus")]
        public string estatus { get; set; }
      
        
        [Column("creacionFecha")]
        public DateTime? creacionFecha { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.Cobranza.PorCobrar>> CH__Abonos(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Cobranza.PorCobrar>("WHERE porCobrarId = @porCobrarId", this).ToListAsync();
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
        
        public async Task<List<DBContext.DBConfia.Cobranza.Abonos_x_Corte>> PA__Cobranza___Abonos_x_Corte___abonoId(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Cobranza.Abonos_x_Corte>("WHERE abonoId = @abonoId", this).ToListAsync();
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

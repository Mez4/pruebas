using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Cobranza
{
    [TableName("Cobranza.FoliosCancelacion")]
    [ExplicitColumns]
    [PrimaryKey("id")]
    public class FoliosCancelacion
    {
              
        
        [Column("id")]
        public Int64 id { get; set; }
      
        
        [Column("porCobrarId")]
        public Int64 porCobrarId { get; set; }
      
        
        [Column("folioCancelacion")]
        public string folioCancelacion { get; set; }
      
        
        [Column("usuarioGeneroFolio")]
        public string usuarioGeneroFolio { get; set; }
      
        
        [Column("usuarioUtilizoFolio")]
        public string usuarioUtilizoFolio { get; set; }
      
        
        [Column("utilizado")]
        public bool? utilizado { get; set; }
      
        
        [Column("creacionFecha")]
        public DateTime creacionFecha { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.Cobranza.PorCobrar>> CH__FoliosCan(DBConfiaContext parContext)
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
        
        // ###############################################
        // <<
        // Child foreing keys
        // ###############################################
        
    }
}

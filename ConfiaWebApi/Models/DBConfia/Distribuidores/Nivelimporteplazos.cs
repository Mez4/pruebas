using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Distribuidores
{
    [TableName("Distribuidores.NivelImportePlazos")]
    [ExplicitColumns]
    [PrimaryKey("nivelImportePlazosID")]
    public class NivelImportePlazos
    {
              
        
        [Column("nivelImportePlazosID")]
        public Int64 nivelImportePlazosID { get; set; }
      
        
        [Column("distribuidorNivelId")]
        public int distribuidorNivelId { get; set; }
      
        
        [Column("importe")]
        public decimal importe { get; set; }
      
        
        [Column("plazo")]
        public int plazo { get; set; }
      
        
        [Column("activo")]
        public int activo { get; set; }
      
        
        [Column("fechaRegistro")]
        public DateTime fechaRegistro { get; set; }
      
        
        [Column("porcTasaPlazo")]
        public decimal? porcTasaPlazo { get; set; }
      
        
        [Column("cargo")]
        public decimal? cargo { get; set; }
      
        
        [Column("seguroPlazo")]
        public decimal? seguroPlazo { get; set; }
      
        
        [Column("porcIVA")]
        public decimal? porcIVA { get; set; }
      
        
        [Column("productoID")]
        public Int64? productoID { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.Distribuidores.Niveles>> CH__NivelImpo(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Niveles>("WHERE distribuidorNivelId = @DistribuidorNivelID", this).ToListAsync();
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

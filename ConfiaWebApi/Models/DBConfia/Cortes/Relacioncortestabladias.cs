using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Cortes
{
    [TableName("Cortes.RelacionCortesTablaDias")]
    [ExplicitColumns]
    [PrimaryKey("ComisionesID,Dias,DistribuidorNivelID,DistribuidorNivelIDOrigen,fechaCorte,fechaVencimiento,ProductoID", AutoIncrement=false)]
    public class RelacionCortesTablaDias
    {
              
        
        [Column("fechaCorte")]
        public DateTime fechaCorte { get; set; }
      
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }
      
        
        [Column("ComisionesID")]
        public int ComisionesID { get; set; }
      
        
        [Column("DistribuidorNivelIDOrigen")]
        public int DistribuidorNivelIDOrigen { get; set; }
      
        
        [Column("DistribuidorNivelID")]
        public int DistribuidorNivelID { get; set; }
      
        
        [Column("fechaVencimiento")]
        public DateTime fechaVencimiento { get; set; }
      
        
        [Column("Dias")]
        public int Dias { get; set; }
      
        
        [Column("DiasMin")]
        public int? DiasMin { get; set; }
      
        
        [Column("DiasMax")]
        public int? DiasMax { get; set; }
      
        
        [Column("PorcComision")]
        public decimal PorcComision { get; set; }
      
        
        [Column("PorcComisionReal")]
        public decimal PorcComisionReal { get; set; }
      
        
        [Column("PorcMonedero")]
        public decimal PorcMonedero { get; set; }
      
        
        [Column("PorcMonederoReal")]
        public decimal PorcMonederoReal { get; set; }
      
        
        [Column("Renglon")]
        public int Renglon { get; set; }
      
        [ComputedColumn(ComputedColumnType.Always)]
        [Column("FechaPago")]
        public DateTime? FechaPago { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.Distribuidores.Niveles>> CH__NIVELES(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Niveles>("WHERE DistribuidorNivelID = @DistribuidorNivelID", this).ToListAsync();
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

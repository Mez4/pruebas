using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Cortes
{
    [TableName("Cortes.RelacionCortesTablaDiasHistorico_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class RelacionCortesTablaDiasHistorico_VW
    {
              
        
        [Column("fechaCorte")]
        public string fechaCorte { get; set; }
      
        
        [Column("fecha")]
        public DateTime fecha { get; set; }
      
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }
      
        
        [Column("ComisionesID")]
        public int ComisionesID { get; set; }
      
        
        [Column("DistribuidorNivelID")]
        public int DistribuidorNivelID { get; set; }
      
        
        [Column("DistribuidorNivelIDOrigen")]
        public int DistribuidorNivelIDOrigen { get; set; }
      
        
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
      
        
        [Column("FechaPago")]
        public DateTime? FechaPago { get; set; }
      
        
        [Column("SucursalID")]
        public int SucursalID { get; set; }


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
        
        // ###############################################
        // <<
        // Child foreing keys
        // ###############################################
        
    }
}

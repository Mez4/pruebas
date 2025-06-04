using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.PasoCVVR_JC
{
    [TableName("PasoCVVR_JC.ClientesVR_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class ClientesVR_VW
    {
              
        
        [Column("DistribuidorID")]
        public Int64? DistribuidorID { get; set; }
      
        
        [Column("DistribCV")]
        public Int64? DistribCV { get; set; }
      
        
        [Column("CveCli")]
        public string CveCli { get; set; }
      
        
        [Column("Nocda")]
        public int? Nocda { get; set; }
      
        
        [Column("NombreCliente")]
        public string NombreCliente { get; set; }
      
        
        [Column("FecUltimoPago")]
        public DateTime? FecUltimoPago { get; set; }
      
        
        [Column("Importe")]
        public decimal? Importe { get; set; }
      
        
        [Column("SaldoActual")]
        public decimal? SaldoActual { get; set; }
      
        
        [Column("SaldoAtraso")]
        public decimal? SaldoAtraso { get; set; }


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

using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.RPM_ReferenciasSPEI_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class RPM_ReferenciasSPEI_VW
    {
              
        
        [Column("empresaid")]
        public int empresaid { get; set; }
      
        
        [Column("empresa")]
        public string empresa { get; set; }
      
        
        [Column("TipoReferencia")]
        public string TipoReferencia { get; set; }
      
        
        [Column("Referenciaid")]
        public Int64 Referenciaid { get; set; }
      
        
        [Column("prefijoPagoSoriana")]
        public string prefijoPagoSoriana { get; set; }
      
        
        [Column("ReferenciaSoriana")]
        public string ReferenciaSoriana { get; set; }
      
        
        [Column("Description")]
        public string Description { get; set; }
      
        
        [Column("Amount")]
        public int? Amount { get; set; }
      
        
        [Column("Account")]
        public string Account { get; set; }
      
        
        [Column("CustomerEmail")]
        public string CustomerEmail { get; set; }
      
        
        [Column("CustomerName")]
        public string CustomerName { get; set; }
      
        
        [Column("ExpirationDate")]
        public DateTime? ExpirationDate { get; set; }
      
        
        [Column("Estatus")]
        public string Estatus { get; set; }
      
        
        [Column("clabe_spei")]
        public string clabe_spei { get; set; }
      
        
        [Column("fhGeneracion")]
        public DateTime? fhGeneracion { get; set; }
      
        
        [Column("ProspectoID")]
        public Int64? ProspectoID { get; set; }


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

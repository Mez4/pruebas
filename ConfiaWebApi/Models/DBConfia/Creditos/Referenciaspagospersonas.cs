using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Creditos
{
    [TableName("Creditos.ReferenciasPagosPersonas")]
    [ExplicitColumns]
    [PrimaryKey("ReferenciaID")]
    public class ReferenciasPagosPersonas
    {
              
        
        [Column("ReferenciaID")]
        public int ReferenciaID { get; set; }
      
        
        [Column("ContratoID")]
        public Int64 ContratoID { get; set; }
      
        
        [Column("ReferenciaCV")]
        public bool ReferenciaCV { get; set; }
      
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }
      
        
        [Column("ProspectoID")]
        public Int64 ProspectoID { get; set; }
      
        
        [Column("FechaGenerada")]
        public DateTime? FechaGenerada { get; set; }
      
        
        [Column("CodigoReferencia")]
        public string CodigoReferencia { get; set; }
      
        
        [Column("ReferenciaOxxo")]
        public string ReferenciaOxxo { get; set; }
      
        
        [Column("EsRefRPM")]
        public bool? EsRefRPM { get; set; }


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

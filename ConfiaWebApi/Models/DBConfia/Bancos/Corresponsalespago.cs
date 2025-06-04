using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Bancos
{
    [TableName("Bancos.CorresponsalesPago")]
    [ExplicitColumns]
    [PrimaryKey("CorresponsalId")]
    public class CorresponsalesPago
    {
              
        
        [Column("CorresponsalId")]
        public int CorresponsalId { get; set; }
      
        
        [Column("CorresponsalDesc")]
        public string CorresponsalDesc { get; set; }
      
        
        [Column("comision")]
        public decimal comision { get; set; }
      
        
        [Column("ordenEnTabla")]
        public int ordenEnTabla { get; set; }
      
        
        [Column("mostrarEnTabla")]
        public bool mostrarEnTabla { get; set; }
      
        
        [Column("montoMaximoPago")]
        public decimal montoMaximoPago { get; set; }


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

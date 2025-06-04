using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Tesoreria
{
    [TableName("Tesoreria.Movimientopolizas")]
    [ExplicitColumns]
    [PrimaryKey("MovimientoPolizaID")]
    public class Movimientopolizas
    {
              
        
        [Column("MovimientoPolizaID")]
        public Int64 MovimientoPolizaID { get; set; }
      
        
        [Column("PolizaID")]
        public Int64 PolizaID { get; set; }
      
        
        [Column("Descripcion")]
        public string Descripcion { get; set; }
      
        
        [Column("CuentaID")]
        public int CuentaID { get; set; }
      
        
        [Column("Referencia")]
        public string Referencia { get; set; }
      
        
        [Column("CatEstatusMovID")]
        public int CatEstatusMovID { get; set; }
      
        
        [Column("Debe")]
        public decimal Debe { get; set; }
      
        
        [Column("Haber")]
        public decimal Haber { get; set; }
      
        
        [Column("PeriodoID")]
        public int PeriodoID { get; set; }


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

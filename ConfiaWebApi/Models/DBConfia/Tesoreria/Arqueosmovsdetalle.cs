using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Tesoreria
{
    [TableName("Tesoreria.ArqueosMovsDetalle")]
    [ExplicitColumns]
    [PrimaryKey("RegistroID")]
    public class ArqueosMovsDetalle
    {
              
        
        [Column("RegistroID")]
        public Int64 RegistroID { get; set; }
      
        
        [Column("ArqueoID")]
        public int ArqueoID { get; set; }
      
        
        [Column("MovimientoID")]
        public Int64 MovimientoID { get; set; }
      
        
        [Column("CuentaBancoID")]
        public int CuentaBancoID { get; set; }
      
        
        [Column("Total")]
        public decimal Total { get; set; }
      
        
        [Column("FechaCaptura")]
        public DateTime FechaCaptura { get; set; }
      
        
        [Column("CajaID")]
        public int CajaID { get; set; }


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

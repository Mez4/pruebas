using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Aclaraciones
{
    [TableName("Aclaraciones.Bitacora_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class Bitacora_VW
    {
              
        
        [Column("MovBitacoraID")]
        public Int64 MovBitacoraID { get; set; }
      
        
        [Column("AclaracionID")]
        public int AclaracionID { get; set; }
      
        
        [Column("Modifico")]
        public string Modifico { get; set; }
      
        
        [Column("TipoMovimientoID")]
        public int? TipoMovimientoID { get; set; }
      
        
        [Column("DescripcionMov")]
        public string DescripcionMov { get; set; }
      
        
        [Column("Fecha")]
        public DateTime Fecha { get; set; }


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

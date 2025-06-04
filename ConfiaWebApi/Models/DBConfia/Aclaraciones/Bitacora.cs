using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Aclaraciones
{
    [TableName("Aclaraciones.Bitacora")]
    [ExplicitColumns]
    [PrimaryKey("MovBitacoraID")]
    public class Bitacora
    {
              
        
        [Column("MovBitacoraID")]
        public Int64 MovBitacoraID { get; set; }
      
        
        [Column("AclaracionID")]
        public int AclaracionID { get; set; }
      
        
        [Column("Modifico")]
        public string Modifico { get; set; }
      
        
        [Column("Fecha")]
        public DateTime Fecha { get; set; }
      
        
        [Column("TipoMovimientoID")]
        public string TipoMovimientoID { get; set; }


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

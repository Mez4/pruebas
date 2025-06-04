using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Tesoreria
{
    [TableName("Tesoreria.Corresponsales_View")]
    [ExplicitColumns]
    // View, no primary key needed
    public class Corresponsales_View
    {
              
        
        [Column("CorresponsalID")]
        public int CorresponsalID { get; set; }
      
        
        [Column("Nombre")]
        public string Nombre { get; set; }
      
        
        [Column("TipoConciliacion")]
        public string TipoConciliacion { get; set; }
      
        
        [Column("Activo")]
        public bool? Activo { get; set; }
      
        
        [Column("Creado")]
        public DateTime Creado { get; set; }
      
        
        [Column("Modificado")]
        public DateTime? Modificado { get; set; }
      
        
        [Column("MontoFijo")]
        public decimal? MontoFijo { get; set; }
      
        
        [Column("MontoCorte")]
        public decimal? MontoCorte { get; set; }
      
        
        [Column("TipoComisionID")]
        public int TipoComisionID { get; set; }
      
        
        [Column("TipoComision")]
        public string TipoComision { get; set; }
      
        
        [Column("TipoPorcentaje")]
        public bool TipoPorcentaje { get; set; }
      
        
        [Column("TipoMontoFijo")]
        public bool TipoMontoFijo { get; set; }
      
        
        [Column("TipoMontoCorte")]
        public bool TipoMontoCorte { get; set; }


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

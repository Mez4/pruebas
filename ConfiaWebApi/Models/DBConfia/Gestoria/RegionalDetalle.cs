using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Gestoria
{
    [TableName("Gestoria.RegionalDetalle")]
    [ExplicitColumns]
    [PrimaryKey("RegionalDetalleID")]
    public class RegionalDetalle
    {
              
        
        [Column("RegionalDetalleID")]
        public int RegionalDetalleID { get; set; }
      
        [Column("RegionalID")]
        public int RegionalID { get; set; }
        
        [Column("ZonalID")]
        public int ZonalID { get; set; }
      
        
        [Column("Estatus")]
        public bool Estatus { get; set; }
      
        
        [Column("UsuarioIDAsigna")]
        public int UsuarioIDAsigna { get; set; }
      
        
        [Column("PersonaIDAsigna")]
        public Int64 PersonaIDAsigna { get; set; }
      
        
        [Column("FechaHoraAsigna")]
        public DateTime FechaHoraAsigna { get; set; }
      
        

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

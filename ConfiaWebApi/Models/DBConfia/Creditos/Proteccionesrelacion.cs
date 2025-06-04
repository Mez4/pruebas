using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Creditos
{
    [TableName("Creditos.ProteccionesRelacion")]
    [ExplicitColumns]
    [PrimaryKey("ProteccionDetalleID")]
    public class ProteccionesRelacion
    {
              
        
        [Column("ProteccionDetalleID")]
        public Int64 ProteccionDetalleID { get; set; }
      
        
        [Column("ProteccionCabeceroID")]
        public int ProteccionCabeceroID { get; set; }
      
        
        [Column("ProteccionID")]
        public Int64 ProteccionID { get; set; }
      
        
        [Column("UsuarioCaptura")]
        public int UsuarioCaptura { get; set; }
      
        
        [Column("FechaCaptura")]
        public DateTime FechaCaptura { get; set; }
      
        
        [Column("UsuarioModifica")]
        public int? UsuarioModifica { get; set; }
      
        
        [Column("FechaModifica")]
        public DateTime? FechaModifica { get; set; }


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

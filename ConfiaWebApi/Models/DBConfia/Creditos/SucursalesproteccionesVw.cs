using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Creditos
{
    [TableName("Creditos.SucursalesProtecciones_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class SucursalesProtecciones_VW
    {
              
        
        [Column("SucursalProteccionIDVista")]
        public Int64 SucursalProteccionIDVista { get; set; }
      
        
        [Column("ProductoIDVista")]
        public int? ProductoIDVista { get; set; }
      
        
        [Column("SucursalIDVista")]
        public int SucursalIDVista { get; set; }
      
        
        [Column("ProteccionCabeceroIDVista")]
        public int? ProteccionCabeceroIDVista { get; set; }
      
        
        [Column("ProductoVista")]
        public string ProductoVista { get; set; }
      
        
        [Column("DescripcionVista")]
        public string DescripcionVista { get; set; }
      
        
        [Column("SucursalVista")]
        public string SucursalVista { get; set; }
      
        
        [Column("NombreCapturaVista")]
        public string NombreCapturaVista { get; set; }
      
        
        [Column("FechaCapturaVista")]
        public DateTime FechaCapturaVista { get; set; }


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

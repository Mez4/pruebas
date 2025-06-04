using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Compras
{
    [TableName("Compras.SolicitudDetalle")]
    [ExplicitColumns]
    [PrimaryKey("SolicitudDetalleID")]
    public class SolicitudDetalle
    {
              
        
        [Column("SolicitudDetalleID")]
        public int SolicitudDetalleID { get; set; }
      
        
        [Column("SolicitudID")]
        public int? SolicitudID { get; set; }
      
        
        [Column("ProductoUniformeID")]
        public int ProductoUniformeID { get; set; }
      
        
        [Column("PiezasSolicitadas")]
        public int PiezasSolicitadas { get; set; }
      
        
        [Column("PiezasRecepcionadas")]
        public int PiezasRecepcionadas { get; set; }
      
        
        [Column("PiezasAprobadas")]
        public int PiezasAprobadas { get; set; }


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

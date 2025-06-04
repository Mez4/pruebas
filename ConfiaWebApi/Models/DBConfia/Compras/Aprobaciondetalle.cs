using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Compras
{
    [TableName("Compras.AprobacionDetalle")]
    [ExplicitColumns]
    [PrimaryKey("AprobadoDetalleID")]
    public class AprobacionDetalle
    {
              
        
        [Column("AprobadoDetalleID")]
        public int AprobadoDetalleID { get; set; }
      
        
        [Column("AprobadoID")]
        public int? AprobadoID { get; set; }
      
        
        [Column("SolicitudDetalleID")]
        public int? SolicitudDetalleID { get; set; }
      
        
        [Column("ProductoUniformeID")]
        public int ProductoUniformeID { get; set; }
      
        
        [Column("PiezasSolicitadas")]
        public int PiezasSolicitadas { get; set; }
      
        
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

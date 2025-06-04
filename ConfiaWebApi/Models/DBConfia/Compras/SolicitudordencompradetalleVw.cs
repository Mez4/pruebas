using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Compras
{
    [TableName("Compras.SolicitudOrdenCompraDetalle_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class SolicitudOrdenCompraDetalle_VW
    {
              
        
        [Column("OrdenDetalleID")]
        public int OrdenDetalleID { get; set; }
      
        
        [Column("OrdenID")]
        public int? OrdenID { get; set; }
      
        
        [Column("SolicitudUniformeDetalleID")]
        public int SolicitudUniformeDetalleID { get; set; }
      
        
        [Column("PiezasSolicitadas")]
        public int? PiezasSolicitadas { get; set; }
      
        
        [Column("PiezasAprobadas")]
        public int PiezasAprobadas { get; set; }
      
        
        [Column("PiezasAutorizadas")]
        public int? PiezasAutorizadas { get; set; }


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

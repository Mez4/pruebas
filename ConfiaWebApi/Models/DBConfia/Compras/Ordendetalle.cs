using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Compras
{
    [TableName("Compras.OrdenDetalle")]
    [ExplicitColumns]
    [PrimaryKey("OrdenDetalleID")]
    public class OrdenDetalle
    {
              
        
        [Column("OrdenDetalleID")]
        public int OrdenDetalleID { get; set; }
      
        
        [Column("OrdenID")]
        public int? OrdenID { get; set; }
      
        
        [Column("SolicitudDetalleID")]
        public int? SolicitudDetalleID { get; set; }
      
        
        [Column("AprobadoDetalleID")]
        public int? AprobadoDetalleID { get; set; }
      
        
        [Column("ProductoUniformeID")]
        public int ProductoUniformeID { get; set; }
      
        
        [Column("PiezasAprobadas")]
        public int PiezasAprobadas { get; set; }
      
        
        [Column("PiezasAutorizadas")]
        public int PiezasAutorizadas { get; set; }
      
        
        [Column("PiezasPendientes")]
        public int PiezasPendientes { get; set; }
      
        
        [Column("FechaCompromiso")]
        public string FechaCompromiso { get; set; }
      
        
        [Column("Observaciones")]
        public string Observaciones { get; set; }


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

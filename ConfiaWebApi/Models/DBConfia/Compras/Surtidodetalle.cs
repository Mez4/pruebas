using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Compras
{
    [TableName("Compras.SurtidoDetalle")]
    [ExplicitColumns]
    [PrimaryKey("SurtidoDetalleID")]
    public class SurtidoDetalle
    {
              
        
        [Column("SurtidoDetalleID")]
        public int SurtidoDetalleID { get; set; }
      
        
        [Column("SurtidoID")]
        public int? SurtidoID { get; set; }
      
        
        [Column("SolicitudDetalleID")]
        public int? SolicitudDetalleID { get; set; }
      
        
        [Column("OrdenDetalleID")]
        public int? OrdenDetalleID { get; set; }
      
        
        [Column("ProductoUniformeID")]
        public int ProductoUniformeID { get; set; }
      
        
        [Column("PiezasAutorizadas")]
        public int PiezasAutorizadas { get; set; }
      
        
        [Column("PiezasSurtidas")]
        public int PiezasSurtidas { get; set; }
      
        
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

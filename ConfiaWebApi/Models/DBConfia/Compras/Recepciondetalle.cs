using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Compras
{
    [TableName("Compras.RecepcionDetalle")]
    [ExplicitColumns]
    [PrimaryKey("RecepcionDetalleID")]
    public class RecepcionDetalle
    {
              
        
        [Column("RecepcionDetalleID")]
        public int RecepcionDetalleID { get; set; }
      
        
        [Column("RecepcionID")]
        public int? RecepcionID { get; set; }
      
        
        [Column("SolicitudDetalleID")]
        public int? SolicitudDetalleID { get; set; }
      
        
        [Column("SurtidoDetalleID")]
        public int? SurtidoDetalleID { get; set; }
      
        
        [Column("ProductoUniformeID")]
        public int ProductoUniformeID { get; set; }
      
        
        [Column("PiezasSolicitadas")]
        public int PiezasSolicitadas { get; set; }
      
        
        [Column("PiezasSurtidas")]
        public int PiezasSurtidas { get; set; }
      
        
        [Column("PiezasRecepcionadas")]
        public int PiezasRecepcionadas { get; set; }
      
        
        [Column("PiezasPendientes")]
        public int PiezasPendientes { get; set; }
      
        
        [Column("FechaCompromiso")]
        public DateTime? FechaCompromiso { get; set; }
      
        
        [Column("Observaciones")]
        public string Observaciones { get; set; }
      
        
        [Column("PiezasPendientesRecepcion")]
        public int? PiezasPendientesRecepcion { get; set; }


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

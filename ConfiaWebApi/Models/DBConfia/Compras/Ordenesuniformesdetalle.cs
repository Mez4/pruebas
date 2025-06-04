using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Compras
{
    [TableName("Compras.OrdenesUniformesDetalle")]
    [ExplicitColumns]
    [PrimaryKey("OrdenDetalleID")]
    public class OrdenesUniformesDetalle
    {
              
        
        [Column("OrdenDetalleID")]
        public int OrdenDetalleID { get; set; }
      
        
        [Column("SolicitudUniformeDetalleID")]
        public int? SolicitudUniformeDetalleID { get; set; }
      
        
        [Column("OrdenID")]
        public int? OrdenID { get; set; }
      
        
        [Column("PiezasSolicitadas")]
        public int? PiezasSolicitadas { get; set; }
      
        
        [Column("PiezasAprobadas")]
        public int? PiezasAprobadas { get; set; }
      
        
        [Column("PiezasAutorizadas")]
        public int? PiezasAutorizadas { get; set; }
      
        
        [Column("PiezasPendientes")]
        public int PiezasPendientes { get; set; }
      
        
        [Column("Cancelada")]
        public bool Cancelada { get; set; }
      
        
        [Column("FechaCompromiso")]
        public string FechaCompromiso { get; set; }
      
        
        [Column("observaciones")]
        public string observaciones { get; set; }


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

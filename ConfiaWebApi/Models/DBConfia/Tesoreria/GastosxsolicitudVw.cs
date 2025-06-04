using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Tesoreria
{
    [TableName("Tesoreria.GastosXSolicitud_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class GastosXSolicitud_VW
    {
              
        
        [Column("Clave")]
        public string Clave { get; set; }
      
        
        [Column("Descripcion")]
        public string Descripcion { get; set; }
      
        
        [Column("SolicitudDetalleID")]
        public Int64 SolicitudDetalleID { get; set; }
      
        
        [Column("SolicitudGastoID")]
        public int SolicitudGastoID { get; set; }
      
        
        [Column("RubroGastosID")]
        public int RubroGastosID { get; set; }
      
        
        [Column("Total")]
        public decimal Total { get; set; }
      
        
        [Column("Revisado")]
        public bool Revisado { get; set; }
      
        
        [Column("Aceptado")]
        public bool Aceptado { get; set; }


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

using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Compras
{
    [TableName("Compras.Orden")]
    [ExplicitColumns]
    [PrimaryKey("OrdenID")]
    public class Orden
    {
              
        
        [Column("OrdenID")]
        public int OrdenID { get; set; }
      
        
        [Column("SolicitudID")]
        public int? SolicitudID { get; set; }
      
        
        [Column("ApruebaID")]
        public int? ApruebaID { get; set; }
      
        
        [Column("AutorizaID")]
        public int? AutorizaID { get; set; }
      
        
        [Column("FechaAprobado")]
        public DateTime? FechaAprobado { get; set; }
      
        
        [Column("FechaAutorizado")]
        public DateTime? FechaAutorizado { get; set; }
      
        
        [Column("EstatusID")]
        public int? EstatusID { get; set; }
      
        
        [Column("AprobadoID")]
        public int? AprobadoID { get; set; }
      
        
        [Column("ProductoID")]
        public int? ProductoID { get; set; }
      
        
        [Column("Pendientes")]
        public bool Pendientes { get; set; }


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

using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Compras
{
    [TableName("Compras.SolicitudOrdenCompra_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class SolicitudOrdenCompra_VW
    {
              
        
        [Column("OrdenID")]
        public int OrdenID { get; set; }
      
        
        [Column("SolicitudUniformeID")]
        public int? SolicitudUniformeID { get; set; }
      
        
        [Column("SolicitanteID")]
        public int? SolicitanteID { get; set; }
      
        
        [Column("NombreSolicita")]
        public string NombreSolicita { get; set; }
      
        
        [Column("AprobadoID")]
        public int? AprobadoID { get; set; }
      
        
        [Column("NombreAprueba")]
        public string NombreAprueba { get; set; }
      
        
        [Column("AutorizadoID")]
        public int? AutorizadoID { get; set; }
      
        
        [Column("NombreAutoriza")]
        public string NombreAutoriza { get; set; }
      
        
        [Column("FechaSolicitud")]
        public DateTime? FechaSolicitud { get; set; }
      
        
        [Column("FechaAprobado")]
        public DateTime? FechaAprobado { get; set; }
      
        
        [Column("FechaAutorizado")]
        public DateTime? FechaAutorizado { get; set; }
      
        
        [Column("EstatusID")]
        public int? EstatusID { get; set; }
      
        
        [Column("EstatusDes")]
        public string EstatusDes { get; set; }


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

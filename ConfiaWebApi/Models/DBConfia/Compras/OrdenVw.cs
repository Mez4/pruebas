using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Compras
{
    [TableName("Compras.Orden_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class Orden_VW
    {
              
        
        [Column("OrdenID")]
        public int OrdenID { get; set; }
      
        
        [Column("SolicitudID")]
        public int? SolicitudID { get; set; }
      
        
        [Column("SolicitanteID")]
        public int? SolicitanteID { get; set; }
      
        
        [Column("NombreSolicita")]
        public string NombreSolicita { get; set; }
      
        
        [Column("ApruebaID")]
        public int? ApruebaID { get; set; }
      
        
        [Column("NombreAprueba")]
        public string NombreAprueba { get; set; }
      
        
        [Column("AutorizaID")]
        public int? AutorizaID { get; set; }
      
        
        [Column("NombreAutoriza")]
        public string NombreAutoriza { get; set; }
      
        
        [Column("FechaAprobado")]
        public DateTime? FechaAprobado { get; set; }
      
        
        [Column("FechaAutorizado")]
        public DateTime? FechaAutorizado { get; set; }
      
        
        [Column("EstatusID")]
        public int? EstatusID { get; set; }
      
        
        [Column("EstatusDes")]
        public string EstatusDes { get; set; }
      
        
        [Column("Pendientes")]
        public bool Pendientes { get; set; }
      
        
        [Column("AprobadoID")]
        public int? AprobadoID { get; set; }
      
        
        [Column("ProductoID")]
        public int? ProductoID { get; set; }
      
        
        [Column("EmpresaId")]
        public int? EmpresaId { get; set; }


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

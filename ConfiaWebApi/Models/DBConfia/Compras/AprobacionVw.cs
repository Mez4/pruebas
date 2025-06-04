using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Compras
{
    [TableName("Compras.Aprobacion_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class Aprobacion_VW
    {
              
        
        [Column("AprobadoID")]
        public int AprobadoID { get; set; }
      
        
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
      
        
        [Column("FechaSolicitud")]
        public DateTime FechaSolicitud { get; set; }
      
        
        [Column("FechaAprobado")]
        public DateTime? FechaAprobado { get; set; }
      
        
        [Column("EstatusID")]
        public int EstatusID { get; set; }
      
        
        [Column("EstatusDes")]
        public string EstatusDes { get; set; }
      
        
        [Column("Descripcion")]
        public string Descripcion { get; set; }
      
        
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

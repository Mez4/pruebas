using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Distribuidores
{
    [TableName("Distribuidores.SolicitudFallecida_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class SolicitudFallecida_VW
    {
              
        
        [Column("SolicitudID")]
        public Int64 SolicitudID { get; set; }
      
        
        [Column("EstatusSolicitud")]
        public string EstatusSolicitud { get; set; }
      
        
        [Column("Ruta")]
        public string Ruta { get; set; }
      
        
        [Column("DistribuidorID")]
        public Int64 DistribuidorID { get; set; }
      
        
        [Column("Observaciones")]
        public string Observaciones { get; set; }
      
        
        [Column("UsuarioRegistraID")]
        public int UsuarioRegistraID { get; set; }
      
        
        [Column("UsuarioSolicito")]
        public string UsuarioSolicito { get; set; }
      
        
        [Column("Estatus")]
        public string Estatus { get; set; }
      
        
        [Column("UsuarioAutorizaID")]
        public int? UsuarioAutorizaID { get; set; }
      
        
        [Column("PersonaAutorizaID")]
        public Int64? PersonaAutorizaID { get; set; }
      
        
        [Column("FechaRegistra")]
        public DateTime FechaRegistra { get; set; }
      
        
        [Column("FechaAutoriza")]
        public DateTime? FechaAutoriza { get; set; }
      
        
        [Column("Autorizado")]
        public bool? Autorizado { get; set; }
      
        
        [Column("NombreCompleto")]
        public string NombreCompleto { get; set; }


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

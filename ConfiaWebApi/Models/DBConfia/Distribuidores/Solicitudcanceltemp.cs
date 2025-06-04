using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Distribuidores
{
    [TableName("Distribuidores.SolicitudCancelTemp")]
    [ExplicitColumns]
    [PrimaryKey("SolicitudID")]
    public class SolicitudCancelTemp
    {
              
        
        [Column("SolicitudID")]
        public Int64 SolicitudID { get; set; }
      
        
        [Column("DistribuidorID")]
        public Int64 DistribuidorID { get; set; }
      
        
        [Column("EstatusID")]
        public int? EstatusID { get; set; }
      
        
        [Column("Observaciones")]
        public string Observaciones { get; set; }
      
        
        [Column("Autorizado")]
        public bool? Autorizado { get; set; }
      
        
        [Column("UsuarioRegistraID")]
        public int UsuarioRegistraID { get; set; }
      
        
        [Column("PersonaRegistraID")]
        public Int64 PersonaRegistraID { get; set; }
      
        
        [Column("FechaRegistra")]
        public DateTime FechaRegistra { get; set; }
      
        
        [Column("UsuarioAutorizaID")]
        public int? UsuarioAutorizaID { get; set; }
      
        
        [Column("PersonaAutorizaID")]
        public Int64? PersonaAutorizaID { get; set; }
      
        
        [Column("FechaAutoriza")]
        public DateTime? FechaAutoriza { get; set; }
      
        
        [Column("EstatusSolicitud")]
        public string EstatusSolicitud { get; set; }


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

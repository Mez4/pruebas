using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.General
{
    [TableName("General.ReporteConsultaBuro_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class ReporteConsultaBuro_VW
    {
              
        
        [Column("ConsultaBuroID")]
        public Int64 ConsultaBuroID { get; set; }
      
        
        [Column("DistribuidorID")]
        public Int64? DistribuidorID { get; set; }
      
        
        [Column("PersonaID")]
        public Int64 PersonaID { get; set; }
      
        
        [Column("NombreCompleto")]
        public string NombreCompleto { get; set; }
      
        
        [Column("Validado")]
        public int Validado { get; set; }
      
        
        [Column("UsuarioIDValida")]
        public int UsuarioIDValida { get; set; }
      
        
        [Column("PersonaIDValida")]
        public Int64 PersonaIDValida { get; set; }
      
        
        [Column("NombreUsuarioValida")]
        public string NombreUsuarioValida { get; set; }
      
        
        [Column("FechaValida")]
        public DateTime FechaValida { get; set; }
      
        
        [Column("Consolidado")]
        public int Consolidado { get; set; }
      
        
        [Column("UsuarioIDConsolida")]
        public int? UsuarioIDConsolida { get; set; }
      
        
        [Column("PersonaIDConsolida")]
        public Int64? PersonaIDConsolida { get; set; }
      
        
        [Column("NombreUsuarioConsolida")]
        public string NombreUsuarioConsolida { get; set; }
      
        
        [Column("FHConsolida")]
        public DateTime? FHConsolida { get; set; }
      
        
        [Column("fechaCreacion")]
        public DateTime fechaCreacion { get; set; }
      
        
        [Column("UsuariIDRegistra")]
        public int UsuariIDRegistra { get; set; }
      
        
        [Column("PersonaIDRegistra")]
        public Int64 PersonaIDRegistra { get; set; }
      
        
        [Column("NombreUsuarioRegistra")]
        public string NombreUsuarioRegistra { get; set; }
      
        
        [Column("EstatusBuroCredito")]
        public string EstatusBuroCredito { get; set; }
      
        
        [Column("SucursalNombre")]
        public string SucursalNombre { get; set; }


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

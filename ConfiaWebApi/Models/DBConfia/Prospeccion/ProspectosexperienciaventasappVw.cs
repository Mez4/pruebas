using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Prospeccion
{
    [TableName("Prospeccion.ProspectosExperienciaVentasApp_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class ProspectosExperienciaVentasApp_VW
    {
              
        
        [Column("ExperienciaVentasID")]
        public Int64 ExperienciaVentasID { get; set; }
      
        
        [Column("PersonaID")]
        public Int64 PersonaID { get; set; }
      
        
        [Column("TipoPersonaID")]
        public int TipoPersonaID { get; set; }
      
        
        [Column("FechaIngreso")]
        public DateTime? FechaIngreso { get; set; }
      
        
        [Column("LimiteCredito")]
        public decimal LimiteCredito { get; set; }
      
        
        [Column("CreditoDisponible")]
        public decimal CreditoDisponible { get; set; }
      
        
        [Column("Status")]
        public string Status { get; set; }
      
        
        [Column("EmpresaExperienciaID")]
        public Int64 EmpresaExperienciaID { get; set; }
      
        
        [Column("Descripcion")]
        public string Descripcion { get; set; }
      
        
        [Column("EmpresaActivo")]
        public bool EmpresaActivo { get; set; }


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

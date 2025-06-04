using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Archivo
{
    [TableName("Archivo.Personas_Dcs_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class Personas_Dcs_VW
    {
              
        
        [Column("PersonaID")]
        public Int64 PersonaID { get; set; }
      
        
        [Column("NombreCompleto")]
        public string NombreCompleto { get; set; }
      
        
        [Column("DistribuidorID")]
        public Int64? DistribuidorID { get; set; }
      
        
        [Column("ClienteID")]
        public Int64? ClienteID { get; set; }
      
        
        [Column("CoordinadorID")]
        public Int64? CoordinadorID { get; set; }
      
        
        [Column("creditoPromotorId")]
        public Int64? creditoPromotorId { get; set; }
      
        
        [Column("AnalistaID")]
        public Int64? AnalistaID { get; set; }
      
        
        [Column("DirectorMesaCreditoID")]
        public Int64? DirectorMesaCreditoID { get; set; }
      
        
        [Column("GestorCobranzaID")]
        public Int64? GestorCobranzaID { get; set; }
      
        
        [Column("DirectorMesaCobranzaID")]
        public Int64? DirectorMesaCobranzaID { get; set; }
      
        
        [Column("EstatusID")]
        public int? EstatusID { get; set; }
      
        
        [Column("NombreEstatus")]
        public string NombreEstatus { get; set; }
      
        
        [Column("Clave")]
        public string Clave { get; set; }
      
        
        [Column("Color")]
        public string Color { get; set; }
      
        
        [Column("FechaHoraRegistro")]
        public DateTime? FechaHoraRegistro { get; set; }


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

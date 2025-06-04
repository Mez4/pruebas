using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.AppVale
{
    [TableName("AppVale.AppPersonas_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class AppPersonas_VW
    {
              
        
        [Column("PersonaID")]
        public Int64 PersonaID { get; set; }
      
        
        [Column("ClienteID")]
        public Int64? ClienteID { get; set; }
      
        
        [Column("DistribuidorID")]
        public int? DistribuidorID { get; set; }
      
        
        [Column("CURP")]
        public string CURP { get; set; }
      
        
        [Column("RFC")]
        public string RFC { get; set; }
      
        
        [Column("Nombre")]
        public string Nombre { get; set; }
      
        
        [Column("primerNombre")]
        public string primerNombre { get; set; }
      
        
        [Column("segundoNombre")]
        public string segundoNombre { get; set; }
      
        
        [Column("primerApellido")]
        public string primerApellido { get; set; }
      
        
        [Column("segundoApellido")]
        public string segundoApellido { get; set; }
      
        
        [Column("FechaNacimiento")]
        public DateTime FechaNacimiento { get; set; }
      
        
        [Column("IngresosMensuales")]
        public decimal IngresosMensuales { get; set; }
      
        
        [Column("TelefonoMovil")]
        public string TelefonoMovil { get; set; }
      
        
        [Column("EscolaridadID")]
        public int? EscolaridadID { get; set; }
      
        
        [Column("NombreConyuge")]
        public string NombreConyuge { get; set; }
      
        
        [Column("identificacionTipoId")]
        public int? identificacionTipoId { get; set; }
      
        
        [Column("identificacionNumero")]
        public string identificacionNumero { get; set; }
      
        
        [Column("TelefonoDomicilio")]
        public string TelefonoDomicilio { get; set; }
      
        
        [Column("CorreoElectronico")]
        public string CorreoElectronico { get; set; }
      
        
        [Column("DependientesEconomicos")]
        public int? DependientesEconomicos { get; set; }
      
        
        [Column("Observaciones")]
        public string Observaciones { get; set; }
      
        
        [Column("edad")]
        public int? edad { get; set; }
      
        
        [Column("SexoID")]
        public string SexoID { get; set; }
      
        
        [Column("NombreCompleto")]
        public string NombreCompleto { get; set; }
      
        
        [Column("PagareEstatusId")]
        public int? PagareEstatusId { get; set; }
      
        
        [Column("ProductoID")]
        public int? ProductoID { get; set; }
      
        
        [Column("LugarNacimiento")]
        public string LugarNacimiento { get; set; }
      
        
        [Column("EstadoCivilID")]
        public string EstadoCivilID { get; set; }


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

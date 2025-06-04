using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Prospectos
{
    [TableName("Prospectos.Prospectos")]
    [ExplicitColumns]
    [PrimaryKey("id")]
    public class Prospectos
    {
              
        
        [Column("id")]
        public int id { get; set; }
      
        
        [Column("nombre")]
        public string nombre { get; set; }
      
        
        [Column("segundoNombre")]
        public string segundoNombre { get; set; }
      
        
        [Column("primerApellido")]
        public string primerApellido { get; set; }
      
        
        [Column("segundoApellido")]
        public string segundoApellido { get; set; }
      
        
        [Column("fechaNacimiento")]
        public DateTime fechaNacimiento { get; set; }
      
        
        [Column("resultadoBuroCredito")]
        public string resultadoBuroCredito { get; set; }
      
        
        [Column("idUsuario")]
        public int idUsuario { get; set; }
      
        
        [Column("idConsulta")]
        public int idConsulta { get; set; }
      
        
        [Column("idSucursal")]
        public int idSucursal { get; set; }
      
        
        [Column("idMesaCredito")]
        public int idMesaCredito { get; set; }
      
        
        [Column("comoSeEntero")]
        public string comoSeEntero { get; set; }
      
        
        [Column("idSexo")]
        public string idSexo { get; set; }
      
        
        [Column("curp")]
        public string curp { get; set; }
      
        
        [Column("rfc")]
        public string rfc { get; set; }
      
        
        [Column("correo")]
        public string correo { get; set; }
      
        
        [Column("telefono")]
        public string telefono { get; set; }
      
        
        [Column("celular")]
        public string celular { get; set; }
      
        
        [Column("idEstadoCivil")]
        public string idEstadoCivil { get; set; }
      
        
        [Column("dependientesEconomicos")]
        public int dependientesEconomicos { get; set; }
      
        
        [Column("nombreConyuge")]
        public string nombreConyuge { get; set; }
      
        
        [Column("primerApellidoConyuge")]
        public string primerApellidoConyuge { get; set; }
      
        
        [Column("segundoApellidoConyuge")]
        public string segundoApellidoConyuge { get; set; }
      
        
        [Column("tieneAutoMoto")]
        public string tieneAutoMoto { get; set; }
      
        
        [Column("tieneDependientes")]
        public string tieneDependientes { get; set; }
      
        
        [Column("tieneExperiencia")]
        public string tieneExperiencia { get; set; }
      
        
        [Column("statusProceso")]
        public string statusProceso { get; set; }
      
        
        [Column("status")]
        public string status { get; set; }
      
        
        [Column("fechaCreacion")]
        public DateTime fechaCreacion { get; set; }
      
        
        [Column("fechaUltimaActualizacion")]
        public DateTime? fechaUltimaActualizacion { get; set; }


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

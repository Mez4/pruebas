using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.MesaCredito
{
    [TableName("MesaCredito.Prospectos")]
    [ExplicitColumns]
    // No primary key detected
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
      
        
        [Column("idPromotor")]
        public int idPromotor { get; set; }
      
        
        [Column("idConsulta")]
        public int idConsulta { get; set; }
      
        
        [Column("idSucursal")]
        public int idSucursal { get; set; }
      
        
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
      
        
        [Column("dependientesEconomicos")]
        public string dependientesEconomicos { get; set; }
      
        
        [Column("nombreConyuge")]
        public string nombreConyuge { get; set; }
      
        
        [Column("tieneAuto")]
        public string tieneAuto { get; set; }
      
        
        [Column("cantidadAuto")]
        public string cantidadAuto { get; set; }
      
        
        [Column("marcaAuto")]
        public string marcaAuto { get; set; }
      
        
        [Column("modeloAuto")]
        public string modeloAuto { get; set; }
      
        
        [Column("status")]
        public string status { get; set; }
      
        
        [Column("fechaCreacion")]
        public DateTime fechaCreacion { get; set; }
      
        
        [Column("idEstadoCivil")]
        public string idEstadoCivil { get; set; }


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

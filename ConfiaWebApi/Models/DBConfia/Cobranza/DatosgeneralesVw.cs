using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Cobranza
{
    [TableName("Cobranza.DatosGenerales_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class DatosGenerales_VW
    {
              
        
        [Column("NumeroFilas")]
        public Int64? NumeroFilas { get; set; }
      
        
        [Column("PersonaID")]
        public Int64 PersonaID { get; set; }
      
        
        [Column("NombreCompleto")]
        public string NombreCompleto { get; set; }
      
        
        [Column("FechaNacimiento")]
        public DateTime FechaNacimiento { get; set; }
      
        
        [Column("Sexo")]
        public string Sexo { get; set; }
      
        
        [Column("CURP")]
        public string CURP { get; set; }
      
        
        [Column("EstadoCivil")]
        public string EstadoCivil { get; set; }
      
        
        [Column("TelefonoMovil")]
        public string TelefonoMovil { get; set; }
      
        
        [Column("CorreoElectronico")]
        public string CorreoElectronico { get; set; }
      
        
        [Column("LugarNacimiento")]
        public string LugarNacimiento { get; set; }
      
        
        [Column("TelefonoDomicilio")]
        public string TelefonoDomicilio { get; set; }
      
        
        [Column("RFC")]
        public string RFC { get; set; }
      
        
        [Column("NombreVialidad")]
        public string NombreVialidad { get; set; }
      
        
        [Column("CreacionFecha")]
        public DateTime? CreacionFecha { get; set; }
      
        
        [Column("DireccionID")]
        public Int64? DireccionID { get; set; }
      
        
        [Column("ReferenciasGeograficas")]
        public string ReferenciasGeograficas { get; set; }
      
        
        [Column("AsentamientoID")]
        public Int64? AsentamientoID { get; set; }
      
        
        [Column("NumeroExterior")]
        public string NumeroExterior { get; set; }


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

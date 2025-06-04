using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.General
{
    [TableName("General.DatoActualPersona")]
    [ExplicitColumns]
    // View, no primary key needed
    public class DatoActualPersona
    {
              
        
        [Column("PersonaID")]
        public Int64 PersonaID { get; set; }
      
        
        [Column("Nombre")]
        public string Nombre { get; set; }
      
        
        [Column("ApellidoPaterno")]
        public string ApellidoPaterno { get; set; }
      
        
        [Column("ApellidoMaterno")]
        public string ApellidoMaterno { get; set; }
      
        
        [Column("TelefonoMovil")]
        public string TelefonoMovil { get; set; }
      
        
        [Column("RFC")]
        public string RFC { get; set; }
      
        
        [Column("FechaNacimiento")]
        public DateTime FechaNacimiento { get; set; }
      
        
        [Column("NombreVialidad")]
        public string NombreVialidad { get; set; }
      
        
        [Column("NumeroInterior")]
        public string NumeroInterior { get; set; }
      
        
        [Column("NumeroExterior")]
        public string NumeroExterior { get; set; }
      
        
        [Column("CURP")]
        public string CURP { get; set; }
      
        
        [Column("codigoPostal")]
        public int? codigoPostal { get; set; }
      
        
        [Column("id_asentamiento")]
        public int? id_asentamiento { get; set; }
      
        
        [Column("Estado")]
        public string Estado { get; set; }
      
        
        [Column("Municipio")]
        public string Municipio { get; set; }
      
        
        [Column("Asentamiento")]
        public string Asentamiento { get; set; }
      
        
        [Column("Ciudad")]
        public string Ciudad { get; set; }
      
        
        [Column("Prospecto")]
        public int Prospecto { get; set; }
      
        
        [Column("AltaDireccionFecha")]
        public DateTime? AltaDireccionFecha { get; set; }
      
        
        [Column("AltaDireccionActualFecha")]
        public DateTime? AltaDireccionActualFecha { get; set; }
      
        
        [Column("AsentamientoID")]
        public Int64? AsentamientoID { get; set; }
      
        
        [Column("AsentamientoID1")]
        public Int64? AsentamientoID1 { get; set; }


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

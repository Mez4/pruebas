using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.General
{
    [TableName("General.Directores_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class Directores_VW
    {
              
        
        [Column("DirectorID")]
        public Int64 DirectorID { get; set; }
      
        
        [Column("ZonaID")]
        public int? ZonaID { get; set; }
      
        
        [Column("Nombre")]
        public string Nombre { get; set; }
      
        
        [Column("ApellidoPaterno")]
        public string ApellidoPaterno { get; set; }
      
        
        [Column("ApellidoMaterno")]
        public string ApellidoMaterno { get; set; }
      
        
        [Column("NombreCompleto")]
        public string NombreCompleto { get; set; }
      
        
        [Column("FechaNacimiento")]
        public string FechaNacimiento { get; set; }
      
        
        [Column("LugarNacimiento")]
        public string LugarNacimiento { get; set; }
      
        
        [Column("CURP")]
        public string CURP { get; set; }
      
        
        [Column("RFC")]
        public string RFC { get; set; }
      
        
        [Column("SexoID")]
        public string SexoID { get; set; }
      
        
        [Column("EstadoCivilID")]
        public string EstadoCivilID { get; set; }
      
        
        [Column("EscolaridadID")]
        public int? EscolaridadID { get; set; }
      
        
        [Column("DependientesEconomicos")]
        public int? DependientesEconomicos { get; set; }
      
        
        [Column("TelefonoDomicilio")]
        public string TelefonoDomicilio { get; set; }
      
        
        [Column("TelefonoMovil")]
        public string TelefonoMovil { get; set; }
      
        
        [Column("CorreoElectronico")]
        public string CorreoElectronico { get; set; }
      
        
        [Column("NombreConyuge")]
        public string NombreConyuge { get; set; }
      
        
        [Column("Observaciones")]
        public string Observaciones { get; set; }
      
        
        [Column("identificacionTipoId")]
        public int? identificacionTipoId { get; set; }
      
        
        [Column("identificacionNumero")]
        public string identificacionNumero { get; set; }
      
        
        [Column("AsentamientoID")]
        public Int64? AsentamientoID { get; set; }
      
        
        [Column("NombreVialidad")]
        public string NombreVialidad { get; set; }
      
        
        [Column("NumeroInterior")]
        public string NumeroInterior { get; set; }
      
        
        [Column("NumeroExterior")]
        public string NumeroExterior { get; set; }
      
        
        [Column("vialidadTipoId")]
        public int? vialidadTipoId { get; set; }
      
        
        [Column("orientacionVialidadTipoId")]
        public int? orientacionVialidadTipoId { get; set; }
      
        
        [Column("ViviendaTipoId")]
        public int? ViviendaTipoId { get; set; }
      
        
        [Column("ReferenciasGeograficas")]
        public string ReferenciasGeograficas { get; set; }
      
        
        [Column("Empresa")]
        public string Empresa { get; set; }
      
        
        [Column("Puesto")]
        public string Puesto { get; set; }
      
        
        [Column("OcupacionID")]
        public int? OcupacionID { get; set; }
      
        
        [Column("Telefono")]
        public string Telefono { get; set; }
      
        
        [Column("FechaIngreso")]
        public string FechaIngreso { get; set; }
      
        
        [Column("FechaTermino")]
        public string FechaTermino { get; set; }
      
        
        [Column("SueldoMensual")]
        public decimal? SueldoMensual { get; set; }
      
        
        [Column("vialidadTipoIdEmpleo")]
        public int? vialidadTipoIdEmpleo { get; set; }
      
        
        [Column("NombreVialidadEmpleo")]
        public string NombreVialidadEmpleo { get; set; }
      
        
        [Column("orientacionVialidadTipoIdEmpleo")]
        public int? orientacionVialidadTipoIdEmpleo { get; set; }
      
        
        [Column("NumeroExteriorEmpleo")]
        public string NumeroExteriorEmpleo { get; set; }
      
        
        [Column("NumeroInteriorEmpleo")]
        public string NumeroInteriorEmpleo { get; set; }
      
        
        [Column("ReferenciasGeograficasEmpleo")]
        public string ReferenciasGeograficasEmpleo { get; set; }
      
        
        [Column("AsentamientoIDEmpleo")]
        public Int64? AsentamientoIDEmpleo { get; set; }
      
        
        [Column("viviendaTipoIdEmpleo")]
        public int? viviendaTipoIdEmpleo { get; set; }


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

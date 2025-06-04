using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Prospeccion
{
    [TableName("Prospeccion.ProspectosDatosGenereles_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class ProspectosDatosGenereles_VW
    {
              
        
        [Column("PersonaID")]
        public Int64 PersonaID { get; set; }
      
        
        [Column("LugarNacimientoId")]
        public int? LugarNacimientoId { get; set; }
      
        
        [Column("Nombre")]
        public string Nombre { get; set; }
      
        
        [Column("ApellidoPaterno")]
        public string ApellidoPaterno { get; set; }
      
        
        [Column("ApellidoMaterno")]
        public string ApellidoMaterno { get; set; }
      
        
        [Column("NombreCompleto")]
        public string NombreCompleto { get; set; }
      
        
        [Column("FechaNacimiento")]
        public DateTime FechaNacimiento { get; set; }
      
        
        [Column("SexoID")]
        public string SexoID { get; set; }
      
        
        [Column("Sexo")]
        public string Sexo { get; set; }
      
        
        [Column("CURP")]
        public string CURP { get; set; }
      
        
        [Column("RFC")]
        public string RFC { get; set; }
      
        
        [Column("TelefonoMovil")]
        public string TelefonoMovil { get; set; }
      
        
        [Column("CorreoElectronico")]
        public string CorreoElectronico { get; set; }
      
        
        [Column("LugarNacimiento")]
        public string LugarNacimiento { get; set; }
      
        
        [Column("Observacion")]
        public string Observacion { get; set; }
      
        
        [Column("AsentamientoID")]
        public Int64? AsentamientoID { get; set; }
      
        
        [Column("CodigoPostal")]
        public int? CodigoPostal { get; set; }
      
        
        [Column("Asentamiento")]
        public string Asentamiento { get; set; }
      
        
        [Column("calle")]
        public string calle { get; set; }
      
        
        [Column("localidad")]
        public string localidad { get; set; }
      
        
        [Column("numeroExterior")]
        public string numeroExterior { get; set; }
      
        
        [Column("Municipio")]
        public string Municipio { get; set; }
      
        
        [Column("Estado")]
        public string Estado { get; set; }
      
        
        [Column("DireccionProspecto")]
        public string DireccionProspecto { get; set; }
      
        
        [Column("TelefonoDomicilio")]
        public string TelefonoDomicilio { get; set; }
      
        
        [Column("TieneEmpleo")]
        public int TieneEmpleo { get; set; }
      
        
        [Column("Empresa")]
        public string Empresa { get; set; }
      
        
        [Column("OcupacionID")]
        public int? OcupacionID { get; set; }
      
        
        [Column("Ocupacion")]
        public string Ocupacion { get; set; }
      
        
        [Column("Sueldo")]
        public decimal? Sueldo { get; set; }
      
        
        [Column("Antiguedad")]
        public string Antiguedad { get; set; }
      
        
        [Column("AsentamientoIDEmpleo")]
        public Int64? AsentamientoIDEmpleo { get; set; }
      
        
        [Column("AsentamientoEmpleo")]
        public string AsentamientoEmpleo { get; set; }
      
        
        [Column("CodigoPostalEmpleo")]
        public int? CodigoPostalEmpleo { get; set; }
      
        
        [Column("calleEmpleo")]
        public string calleEmpleo { get; set; }
      
        
        [Column("localidadEmpleo")]
        public string localidadEmpleo { get; set; }
      
        
        [Column("numeroExteriorEmpleo")]
        public string numeroExteriorEmpleo { get; set; }
      
        
        [Column("DireccionEmpresaProspecto")]
        public string DireccionEmpresaProspecto { get; set; }
      
        
        [Column("TelefonoEmpleo")]
        public string TelefonoEmpleo { get; set; }
      
        
        [Column("EstadoCivilID")]
        public string EstadoCivilID { get; set; }
      
        
        [Column("EstadoCivil")]
        public string EstadoCivil { get; set; }
      
        
        [Column("TieneConyuge")]
        public int TieneConyuge { get; set; }
      
        
        [Column("NombreConyuge")]
        public string NombreConyuge { get; set; }
      
        
        [Column("TieneEmpleoConyuge")]
        public int TieneEmpleoConyuge { get; set; }
      
        
        [Column("EmpresaConyuge")]
        public string EmpresaConyuge { get; set; }
      
        
        [Column("OcupacionIDConyuge")]
        public int? OcupacionIDConyuge { get; set; }
      
        
        [Column("OcupacionConyuge")]
        public string OcupacionConyuge { get; set; }
      
        
        [Column("SueldoConyuge")]
        public decimal? SueldoConyuge { get; set; }
      
        
        [Column("AntiguedadConyuge")]
        public string AntiguedadConyuge { get; set; }
      
        
        [Column("AsentamientoIDEmpresaConyuge")]
        public Int64? AsentamientoIDEmpresaConyuge { get; set; }
      
        
        [Column("CodigoPostalEmpleoConyuge")]
        public int? CodigoPostalEmpleoConyuge { get; set; }
      
        
        [Column("localidadEmpresaConyuge")]
        public string localidadEmpresaConyuge { get; set; }
      
        
        [Column("calleEmpresaConyuge")]
        public string calleEmpresaConyuge { get; set; }
      
        
        [Column("NumeroExteriorEmpresaConyuge")]
        public string NumeroExteriorEmpresaConyuge { get; set; }
      
        
        [Column("DireccionEmpresaConyuge")]
        public string DireccionEmpresaConyuge { get; set; }
      
        
        [Column("TelefonoEmpresaConyuge")]
        public string TelefonoEmpresaConyuge { get; set; }
      
        
        [Column("EstatusConsultaBuroID")]
        public int EstatusConsultaBuroID { get; set; }
      
        
        [Column("StatusProcesoID")]
        public Int64? StatusProcesoID { get; set; }
      
        
        [Column("Contrato")]
        public string Contrato { get; set; }
      
        
        [Column("Pagare")]
        public string Pagare { get; set; }
      
        
        [Column("PagareReverso")]
        public string PagareReverso { get; set; }


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

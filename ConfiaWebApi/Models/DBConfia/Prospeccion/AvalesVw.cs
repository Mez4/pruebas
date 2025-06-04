using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Prospeccion
{
    [TableName("Prospeccion.Avales_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class Avales_VW
    {
              
        
        [Column("AvalID")]
        public Int64 AvalID { get; set; }
      
        
        [Column("ProspectoID")]
        public Int64 ProspectoID { get; set; }
      
        
        [Column("Activo")]
        public bool Activo { get; set; }
      
        
        [Column("Validado")]
        public bool? Validado { get; set; }
      
        
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
      
        
        [Column("TelefonoMovil")]
        public string TelefonoMovil { get; set; }
      
        
        [Column("TelefonoDomicilio")]
        public string TelefonoDomicilio { get; set; }
      
        
        [Column("CorreoElectronico")]
        public string CorreoElectronico { get; set; }
      
        
        [Column("LugarNacimiento")]
        public string LugarNacimiento { get; set; }
      
        
        [Column("Observacion")]
        public string Observacion { get; set; }
      
        
        [Column("CodigoPostal")]
        public int CodigoPostal { get; set; }
      
        
        [Column("AsentamientoID")]
        public Int64 AsentamientoID { get; set; }
      
        
        [Column("localidad")]
        public string localidad { get; set; }
      
        
        [Column("calle")]
        public string calle { get; set; }
      
        
        [Column("numeroExterior")]
        public string numeroExterior { get; set; }
      
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }
      
        
        [Column("DireccionAval")]
        public string DireccionAval { get; set; }
      
        
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
      
        
        [Column("TelefonoEmpresa")]
        public string TelefonoEmpresa { get; set; }
      
        
        [Column("AsentamientoIDEmpleo")]
        public Int64? AsentamientoIDEmpleo { get; set; }
      
        
        [Column("calleEmpleo")]
        public string calleEmpleo { get; set; }
      
        
        [Column("NumeroExteriorEmpleo")]
        public string NumeroExteriorEmpleo { get; set; }
      
        
        [Column("localidadEmpleo")]
        public string localidadEmpleo { get; set; }
      
        
        [Column("DireccionEmpresaAval")]
        public string DireccionEmpresaAval { get; set; }
      
        
        [Column("TieneConyuge")]
        public int TieneConyuge { get; set; }
      
        
        [Column("EstadoCivilID")]
        public string EstadoCivilID { get; set; }
      
        
        [Column("EstadoCivil")]
        public string EstadoCivil { get; set; }
      
        
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
      
        
        [Column("TelefonoEmpresaConyuge")]
        public string TelefonoEmpresaConyuge { get; set; }
      
        
        [Column("AsentamientoIDEmpresaConyuge")]
        public Int64? AsentamientoIDEmpresaConyuge { get; set; }
      
        
        [Column("calleEmpresaConyuge")]
        public string calleEmpresaConyuge { get; set; }
      
        
        [Column("NumeroExteriorEmpresaConyuge")]
        public string NumeroExteriorEmpresaConyuge { get; set; }
      
        
        [Column("localidadEmpresaConyuge")]
        public string localidadEmpresaConyuge { get; set; }
      
        
        [Column("DireccionEmpresaConyugeAval")]
        public string DireccionEmpresaConyugeAval { get; set; }
      
        
        [Column("CodigoPostalEmpresaAval")]
        public int? CodigoPostalEmpresaAval { get; set; }
      
        
        [Column("CodigoPostalEmpresaConyuge")]
        public int? CodigoPostalEmpresaConyuge { get; set; }


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

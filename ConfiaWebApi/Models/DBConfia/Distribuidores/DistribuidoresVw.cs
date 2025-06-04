using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Distribuidores
{
    [TableName("Distribuidores.Distribuidores_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class Distribuidores_VW
    {
              
        
        [Column("DistribuidorID")]
        public Int64 DistribuidorID { get; set; }
      
        
        [Column("DistribuidoresEstatusID")]
        public string DistribuidoresEstatusID { get; set; }
      
        
        [Column("Estatus_AsignaUsuario")]
        public bool? Estatus_AsignaUsuario { get; set; }
      
        
        [Column("Estatus_Convenio")]
        public bool? Estatus_Convenio { get; set; }
      
        
        [Column("Estatus_DistribuidoresEstatus")]
        public string Estatus_DistribuidoresEstatus { get; set; }
      
        
        [Column("Estatus_Especial")]
        public bool? Estatus_Especial { get; set; }
      
        
        [Column("Estatus_Orden")]
        public int? Estatus_Orden { get; set; }
      
        
        [Column("Estatus_PuedeCanjear")]
        public bool? Estatus_PuedeCanjear { get; set; }
      
        
        [Column("DistribuidorNivelID")]
        public int DistribuidorNivelID { get; set; }
      
        
        [Column("Nivel_CapitalColocadoMaximo")]
        public decimal? Nivel_CapitalColocadoMaximo { get; set; }
      
        
        [Column("Nivel_CapitalColocadoMinimo")]
        public decimal? Nivel_CapitalColocadoMinimo { get; set; }
      
        
        [Column("Nivel_DistribuidorNivel")]
        public string Nivel_DistribuidorNivel { get; set; }
      
        
        [Column("Nivel_importeMaxCanje")]
        public decimal? Nivel_importeMaxCanje { get; set; }
      
        
        [Column("Nivel_ImporteProteccionSaldo")]
        public decimal? Nivel_ImporteProteccionSaldo { get; set; }
      
        
        [Column("Nivel_maximoImporteCanjeAval")]
        public decimal? Nivel_maximoImporteCanjeAval { get; set; }
      
        
        [Column("Nivel_maximoImporteCanjeCliente")]
        public decimal? Nivel_maximoImporteCanjeCliente { get; set; }
      
        
        [Column("Nivel_maximoPrestamoPersonal")]
        public decimal? Nivel_maximoPrestamoPersonal { get; set; }
      
        
        [Column("Nivel_PorcComisionBase")]
        public decimal? Nivel_PorcComisionBase { get; set; }
      
        
        [Column("NoCreditosActivos")]
        public int NoCreditosActivos { get; set; }
      
        
        [Column("FechaHoraRegistro")]
        public DateTime FechaHoraRegistro { get; set; }
      
        
        [Column("UsuarioIDRegistro")]
        public int UsuarioIDRegistro { get; set; }
      
        
        [Column("SucursalID")]
        public int SucursalID { get; set; }
      
        
        [Column("SucursalIDVR")]
        public Int64? SucursalIDVR { get; set; }
      
        
        [Column("Sucursal_Nombre")]
        public string Sucursal_Nombre { get; set; }
      
        
        [Column("DireccionID")]
        public Int64 DireccionID { get; set; }
      
        
        [Column("NombreVialidad")]
        public string NombreVialidad { get; set; }
      
        
        [Column("vialidadTipo")]
        public string vialidadTipo { get; set; }
      
        
        [Column("orientacionVialidadTipo")]
        public string orientacionVialidadTipo { get; set; }
      
        
        [Column("NumeroExterior")]
        public string NumeroExterior { get; set; }
      
        
        [Column("NumeroInterior")]
        public string NumeroInterior { get; set; }
      
        
        [Column("codigoPostal")]
        public string codigoPostal { get; set; }
      
        
        [Column("Asentamiento")]
        public string Asentamiento { get; set; }
      
        
        [Column("Tipo_asenta")]
        public string Tipo_asenta { get; set; }
      
        
        [Column("Municipio")]
        public string Municipio { get; set; }
      
        
        [Column("Ciudad")]
        public string Ciudad { get; set; }
      
        
        [Column("Estado")]
        public string Estado { get; set; }
      
        
        [Column("ZonaID")]
        public int ZonaID { get; set; }
      
        
        [Column("ZonaNombre")]
        public string ZonaNombre { get; set; }
      
        
        [Column("NumeroDist")]
        public string NumeroDist { get; set; }
      
        
        [Column("DistAntNumero")]
        public int? DistAntNumero { get; set; }
      
        
        [Column("DistAntNumero2")]
        public int? DistAntNumero2 { get; set; }
      
        
        [Column("GestorID")]
        public Int64? GestorID { get; set; }
      
        
        [Column("ValidaContrato")]
        public bool ValidaContrato { get; set; }
      
        
        [Column("tipoRelacionID")]
        public int tipoRelacionID { get; set; }
      
        
        [Column("ReferenciaContable")]
        public int ReferenciaContable { get; set; }
      
        
        [Column("creditoPromotorId")]
        public Int64? creditoPromotorId { get; set; }
      
        
        [Column("validaContratoUsuarioId")]
        public int? validaContratoUsuarioId { get; set; }
      
        
        [Column("fechaHoraValidaContrato")]
        public DateTime? fechaHoraValidaContrato { get; set; }
      
        
        [Column("usuarioIdValidaContrato")]
        public int? usuarioIdValidaContrato { get; set; }
      
        
        [Column("numCreditosPersonales")]
        public int numCreditosPersonales { get; set; }
      
        
        [Column("PersonaIDRegistro")]
        public Int64 PersonaIDRegistro { get; set; }
      
        
        [Column("PlazosEspeciales")]
        public bool? PlazosEspeciales { get; set; }
      
        
        [Column("PersonaIDValidaContrato")]
        public Int64? PersonaIDValidaContrato { get; set; }
      
        
        [Column("PersonaID")]
        public Int64? PersonaID { get; set; }
      
        
        [Column("PersonaNombre")]
        public string PersonaNombre { get; set; }
      
        
        [Column("GrupoID")]
        public int? GrupoID { get; set; }
      
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }
      
        
        [Column("EmpresaId")]
        public int? EmpresaId { get; set; }
      
        
        [Column("TelefonoMovil")]
        public string TelefonoMovil { get; set; }
      
        
        [Column("FechaNacimiento")]
        public DateTime? FechaNacimiento { get; set; }
      
        
        [Column("CorreoElectronico")]
        public string CorreoElectronico { get; set; }
      
        
        [Column("DistribuidorNivelOrigenID")]
        public int DistribuidorNivelOrigenID { get; set; }
      
        
        [Column("DistribuidorNivel")]
        public string DistribuidorNivel { get; set; }
      
        
        [Column("LineaCredito")]
        public decimal? LineaCredito { get; set; }
      
        
        [Column("Reference")]
        public string Reference { get; set; }
      
        
        [Column("FechaPrimerCanje")]
        public DateTime? FechaPrimerCanje { get; set; }
      
        
        [Column("IDExterno")]
        public string IDExterno { get; set; }


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

using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Creditos
{
    [TableName("Creditos.CondicionesDetalle_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class CondicionesDetalle_VW
    {
              
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }
      
        
        [Column("CondicionesID")]
        public int CondicionesID { get; set; }
      
        
        [Column("Descripcion")]
        public string Descripcion { get; set; }
      
        
        [Column("Activo")]
        public bool Activo { get; set; }
      
        
        [Column("RegistroFecha")]
        public DateTime RegistroFecha { get; set; }
      
        
        [Column("RegistroUsuarioId")]
        public int RegistroUsuarioId { get; set; }
      
        
        [Column("ModificoFecha")]
        public DateTime ModificoFecha { get; set; }
      
        
        [Column("ModificoUsuarioId")]
        public int ModificoUsuarioId { get; set; }
      
        
        [Column("SucursalId")]
        public int SucursalId { get; set; }
      
        
        [Column("ModificaUsuarioId")]
        public int ModificaUsuarioId { get; set; }
      
        
        [Column("ModificaFecha")]
        public DateTime ModificaFecha { get; set; }
      
        
        [Column("RenglonId")]
        public int RenglonId { get; set; }
      
        
        [Column("DistribuidorNivelId")]
        public int DistribuidorNivelId { get; set; }
      
        
        [Column("DistribuidorNivelOrigenID")]
        public int DistribuidorNivelOrigenID { get; set; }
      
        
        [Column("PlazosMinimos")]
        public int PlazosMinimos { get; set; }
      
        
        [Column("PlazosMaximos")]
        public int PlazosMaximos { get; set; }
      
        
        [Column("ImporteMinimo")]
        public decimal ImporteMinimo { get; set; }
      
        
        [Column("ImporteMaximo")]
        public decimal ImporteMaximo { get; set; }
      
        
        [Column("ImporteMaximo1erCanje")]
        public decimal ImporteMaximo1erCanje { get; set; }
      
        
        [Column("ImporteMaximo2doCanje")]
        public decimal ImporteMaximo2doCanje { get; set; }
      
        
        [Column("PorcTasaPlazo")]
        public decimal PorcTasaPlazo { get; set; }
      
        
        [Column("SeguroPlazo")]
        public decimal SeguroPlazo { get; set; }
      
        
        [Column("PorcIVA")]
        public decimal PorcIVA { get; set; }
      
        
        [Column("Cargo")]
        public decimal Cargo { get; set; }
      
        
        [Column("ManejoCuenta")]
        public decimal ManejoCuenta { get; set; }
      
        
        [Column("PlazosFijos")]
        public int PlazosFijos { get; set; }
      
        
        [Column("fhRegistro")]
        public DateTime fhRegistro { get; set; }
      
        
        [Column("fhModificacion")]
        public DateTime? fhModificacion { get; set; }
      
        
        [Column("PorcTasaMensual")]
        public decimal PorcTasaMensual { get; set; }
      
        
        [Column("PorcTasaAnual")]
        public decimal PorcTasaAnual { get; set; }
      
        
        [Column("PagoXMilMinimo")]
        public decimal PagoXMilMinimo { get; set; }
      
        
        [Column("PagoXMilMaximo")]
        public decimal PagoXMilMaximo { get; set; }
      
        
        [Column("PlazosEspeciales")]
        public bool PlazosEspeciales { get; set; }
      
        
        [Column("DistribuidorID")]
        public Int64? DistribuidorID { get; set; }
      
        
        [Column("DistribuidoresEstatusID")]
        public string DistribuidoresEstatusID { get; set; }
      
        
        [Column("NoCreditosActivos")]
        public int? NoCreditosActivos { get; set; }
      
        
        [Column("FechaHoraRegistro")]
        public DateTime? FechaHoraRegistro { get; set; }
      
        
        [Column("UsuarioIDRegistro")]
        public int? UsuarioIDRegistro { get; set; }
      
        
        [Column("NumeroDist")]
        public string NumeroDist { get; set; }
      
        
        [Column("GestorID")]
        public Int64? GestorID { get; set; }
      
        
        [Column("ValidaContrato")]
        public bool? ValidaContrato { get; set; }
      
        
        [Column("tipoRelacionID")]
        public int? tipoRelacionID { get; set; }
      
        
        [Column("ReferenciaContable")]
        public int? ReferenciaContable { get; set; }
      
        
        [Column("numCreditosPersonales")]
        public int? numCreditosPersonales { get; set; }
      
        
        [Column("DistribuidorNivel")]
        public string DistribuidorNivel { get; set; }
      
        
        [Column("PorcComisionBase")]
        public decimal? PorcComisionBase { get; set; }
      
        
        [Column("CapitalColocadoMinimo")]
        public decimal? CapitalColocadoMinimo { get; set; }
      
        
        [Column("CapitalColocadoMaximo")]
        public decimal? CapitalColocadoMaximo { get; set; }
      
        
        [Column("ImporteProteccionSaldo")]
        public decimal? ImporteProteccionSaldo { get; set; }
      
        
        [Column("importeMaxCanje")]
        public decimal? importeMaxCanje { get; set; }
      
        
        [Column("maximoPrestamoPersonal")]
        public decimal? maximoPrestamoPersonal { get; set; }
      
        
        [Column("maximoImporteCanjeCliente")]
        public decimal? maximoImporteCanjeCliente { get; set; }
      
        
        [Column("maximoImporteCanjeAval")]
        public decimal? maximoImporteCanjeAval { get; set; }
      
        
        [Column("CapitalCorte")]
        public decimal? CapitalCorte { get; set; }


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

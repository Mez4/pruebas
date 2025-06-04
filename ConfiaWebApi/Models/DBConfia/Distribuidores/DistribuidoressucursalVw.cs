using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Distribuidores
{
    [TableName("Distribuidores.DistribuidoresSucursal_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class DistribuidoresSucursal_VW
    {
              
        
        [Column("DistribuidorID")]
        public Int64 DistribuidorID { get; set; }
      
        
        [Column("Distribuidor")]
        public string Distribuidor { get; set; }
      
        
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
      
        
        [Column("Sucursal_Nombre")]
        public string Sucursal_Nombre { get; set; }
      
        
        [Column("ZonaID")]
        public int ZonaID { get; set; }
      
        
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
      
        
        [Column("numCreditosPersonales")]
        public int numCreditosPersonales { get; set; }
      
        
        [Column("PersonaIDRegistro")]
        public Int64 PersonaIDRegistro { get; set; }
      
        
        [Column("PersonaID")]
        public Int64? PersonaID { get; set; }
      
        
        [Column("PersonaNombre")]
        public string PersonaNombre { get; set; }
      
        
        [Column("GrupoID")]
        public int? GrupoID { get; set; }
      
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }
      
        
        [Column("TelefonoMovil")]
        public string TelefonoMovil { get; set; }


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

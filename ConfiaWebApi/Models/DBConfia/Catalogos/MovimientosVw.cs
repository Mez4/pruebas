using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Catalogos
{
    [TableName("Catalogos.Movimientos_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class Movimientos_VW
    {
              
        
        [Column("MovimientoID")]
        public Int64 MovimientoID { get; set; }
      
        
        [Column("CuentaID")]
        public int CuentaID { get; set; }
      
        
        [Column("SucursalId")]
        public int SucursalId { get; set; }
      
        
        [Column("CuentaDestinoID")]
        public int? CuentaDestinoID { get; set; }
      
        
        [Column("FechaAfectacion")]
        public DateTime? FechaAfectacion { get; set; }
      
        
        [Column("FechaCaptura")]
        public DateTime FechaCaptura { get; set; }
      
        
        [Column("Importe")]
        public decimal Importe { get; set; }
      
        
        [Column("Observaciones")]
        public string Observaciones { get; set; }
      
        
        [Column("TipoMovimientoID")]
        public int TipoMovimientoID { get; set; }
      
        
        [Column("ProductoId")]
        public int? ProductoId { get; set; }
      
        
        [Column("RefApl")]
        public Int64? RefApl { get; set; }
      
        
        [Column("gastoSucursal")]
        public int? gastoSucursal { get; set; }
      
        
        [Column("movimientoIdTraspaso")]
        public Int64? movimientoIdTraspaso { get; set; }
      
        
        [Column("cancelacionObservacion")]
        public string cancelacionObservacion { get; set; }
      
        
        [Column("cancelacionUsuario")]
        public Int64? cancelacionUsuario { get; set; }
      
        
        [Column("cancelacionImporte")]
        public decimal? cancelacionImporte { get; set; }
      
        
        [Column("cancelacionFhRegistro")]
        public DateTime? cancelacionFhRegistro { get; set; }
      
        
        [Column("cancelacionTipMovimiento")]
        public int? cancelacionTipMovimiento { get; set; }
      
        
        [Column("PolizaId")]
        public Int64? PolizaId { get; set; }
      
        
        [Column("Estatus")]
        public string Estatus { get; set; }
      
        
        [Column("Contabilizado")]
        public bool? Contabilizado { get; set; }
      
        
        [Column("CajaId")]
        public int? CajaId { get; set; }
      
        
        [Column("PersonaIDRegistro")]
        public Int64? PersonaIDRegistro { get; set; }
      
        
        [Column("UsuarioIDRegistra")]
        public int UsuarioIDRegistra { get; set; }
      
        
        [Column("TipoMovimiento")]
        public string TipoMovimiento { get; set; }
      
        
        [Column("CveMovimientoID")]
        public string CveMovimientoID { get; set; }
      
        
        [Column("NumeroCuenta")]
        public string NumeroCuenta { get; set; }
      
        
        [Column("Descripcion")]
        public string Descripcion { get; set; }
      
        
        [Column("Producto")]
        public string Producto { get; set; }
      
        
        [Column("capturo")]
        public string capturo { get; set; }
      
        
        [Column("CreditoID")]
        public Int64? CreditoID { get; set; }
      
        
        [Column("GrupoID")]
        public int? GrupoID { get; set; }
      
        
        [Column("NombreGrupo")]
        public string NombreGrupo { get; set; }
      
        
        [Column("Cliente")]
        public string Cliente { get; set; }
      
        
        [Column("ClienteID")]
        public Int64? ClienteID { get; set; }
      
        
        [Column("RequiereGrupo")]
        public bool RequiereGrupo { get; set; }
      
        
        [Column("CreditosActivos")]
        public int? CreditosActivos { get; set; }
      
        
        [Column("CreditosTotales")]
        public int? CreditosTotales { get; set; }
      
        
        [Column("Logo")]
        public byte[] Logo { get; set; }
      
        
        [Column("NombreCompleto")]
        public string NombreCompleto { get; set; }


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

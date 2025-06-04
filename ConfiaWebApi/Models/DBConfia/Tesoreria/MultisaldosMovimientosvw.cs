using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Tesoreria
{
    [TableName("Tesoreria.Multisaldos_MovimientosVW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class Multisaldos_MovimientosVW
    {
              
        
        [Column("MovimientoID")]
        public Int64 MovimientoID { get; set; }
      
        
        [Column("CuentaID")]
        public int CuentaID { get; set; }
      
        
        [Column("NumeroCuenta")]
        public string NumeroCuenta { get; set; }
      
        
        [Column("SucursalId")]
        public int SucursalId { get; set; }
      
        
        [Column("SucursalNombre")]
        public string SucursalNombre { get; set; }
      
        
        [Column("Importe")]
        public decimal Importe { get; set; }
      
        
        [Column("Observaciones")]
        public string Observaciones { get; set; }
      
        
        [Column("TipoMovimientoID")]
        public int TipoMovimientoID { get; set; }
      
        
        [Column("TipoMovimiento")]
        public string TipoMovimiento { get; set; }
      
        
        [Column("ProductoId")]
        public int? ProductoId { get; set; }
      
        
        [Column("CajaId")]
        public int? CajaId { get; set; }
      
        
        [Column("CajaNombre")]
        public string CajaNombre { get; set; }
      
        
        [Column("PeriodoID")]
        public int PeriodoID { get; set; }
      
        
        [Column("UsuarioIDRegistra")]
        public int UsuarioIDRegistra { get; set; }
      
        
        [Column("FechaCaptura")]
        public DateTime FechaCaptura { get; set; }
      
        
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

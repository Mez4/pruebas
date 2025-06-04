using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Tesoreria
{
    [TableName("Tesoreria.TipoOperacion_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class TipoOperacion_VW
    {
              
        
        [Column("CajaTipoOperacionID")]
        public int CajaTipoOperacionID { get; set; }
      
        
        [Column("CuentaBancoId")]
        public int? CuentaBancoId { get; set; }
      
        
        [Column("NumeroCuenta")]
        public string NumeroCuenta { get; set; }
      
        
        [Column("CajaID")]
        public int CajaID { get; set; }
      
        
        [Column("NombreCaja")]
        public string NombreCaja { get; set; }
      
        
        [Column("Id")]
        public int? Id { get; set; }
      
        
        [Column("TipoMovimiento")]
        public string TipoMovimiento { get; set; }
      
        
        [Column("CveMovimientoID")]
        public string CveMovimientoID { get; set; }
      
        
        [Column("Cargo")]
        public bool? Cargo { get; set; }
      
        
        [Column("usuario")]
        public bool? usuario { get; set; }
      
        
        [Column("Activa")]
        public bool? Activa { get; set; }
      
        
        [Column("PuedeRecibir")]
        public bool PuedeRecibir { get; set; }
      
        
        [Column("PuedeSacar")]
        public bool PuedeSacar { get; set; }
      
        
        [Column("Estatus")]
        public int Estatus { get; set; }
      
        
        [Column("CuentaBancoIdNueva")]
        public int CuentaBancoIdNueva { get; set; }
      
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }
      
        
        [Column("ProductoIDMov")]
        public int? ProductoIDMov { get; set; }
      
        
        [Column("ProductoMovimiento")]
        public string ProductoMovimiento { get; set; }
      
        
        [Column("SucursalID")]
        public int? SucursalID { get; set; }
      
        
        [Column("ZonaID")]
        public int? ZonaID { get; set; }


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

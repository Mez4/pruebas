using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Tesoreria
{
    [TableName("Tesoreria.MovimientosCuentasRetiros_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class MovimientosCuentasRetiros_VW
    {
              
        
        [Column("Id")]
        public int? Id { get; set; }
      
        
        [Column("CveMovimientoID")]
        public string CveMovimientoID { get; set; }
      
        
        [Column("TipoMovimiento")]
        public string TipoMovimiento { get; set; }
      
        
        [Column("AceptaRetiros")]
        public bool? AceptaRetiros { get; set; }
      
        
        [Column("AceptaDepositos")]
        public bool? AceptaDepositos { get; set; }
      
        
        [Column("DeSistema")]
        public bool? DeSistema { get; set; }
      
        
        [Column("CuentaBancoID")]
        public int? CuentaBancoID { get; set; }
      
        
        [Column("NumeroCuenta")]
        public string NumeroCuenta { get; set; }
      
        
        [Column("empresaId")]
        public int? empresaId { get; set; }
      
        
        [Column("empresaNombre")]
        public string empresaNombre { get; set; }
      
        
        [Column("ProductoID")]
        public int? ProductoID { get; set; }
      
        
        [Column("Producto")]
        public string Producto { get; set; }
      
        
        [Column("CajaID")]
        public int? CajaID { get; set; }
      
        
        [Column("Descripcion")]
        public string Descripcion { get; set; }
      
        
        [Column("Estatus")]
        public bool? Estatus { get; set; }
      
        
        [Column("SucursalID")]
        public int? SucursalID { get; set; }
      
        
        [Column("Nombre")]
        public string Nombre { get; set; }


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

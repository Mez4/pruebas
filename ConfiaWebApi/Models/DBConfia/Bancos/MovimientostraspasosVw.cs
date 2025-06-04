using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Bancos
{
    [TableName("Bancos.MovimientosTraspasos_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class MovimientosTraspasos_VW
    {
              
        
        [Column("TraspasoID")]
        public Int64 TraspasoID { get; set; }
      
        
        [Column("SucursalID")]
        public int SucursalID { get; set; }
      
        
        [Column("SucursalNombre")]
        public string SucursalNombre { get; set; }
      
        
        [Column("CajaID")]
        public int CajaID { get; set; }
      
        
        [Column("NombreCaja")]
        public string NombreCaja { get; set; }
      
        
        [Column("Monto")]
        public decimal Monto { get; set; }
      
        
        [Column("SaldoOrigenNvo")]
        public decimal SaldoOrigenNvo { get; set; }
      
        
        [Column("SaldoDestinoNvo")]
        public decimal SaldoDestinoNvo { get; set; }
      
        
        [Column("Concepto")]
        public string Concepto { get; set; }
      
        
        [Column("CuentaOrigenID")]
        public int CuentaOrigenID { get; set; }
      
        
        [Column("NumeroCuentaOrigen")]
        public string NumeroCuentaOrigen { get; set; }
      
        
        [Column("CuentaDestinoID")]
        public int CuentaDestinoID { get; set; }
      
        
        [Column("NumeroCuentaDestino")]
        public string NumeroCuentaDestino { get; set; }
      
        
        [Column("UsuarioID")]
        public int UsuarioID { get; set; }
      
        
        [Column("FechaTraspaso")]
        public DateTime FechaTraspaso { get; set; }
      
        
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

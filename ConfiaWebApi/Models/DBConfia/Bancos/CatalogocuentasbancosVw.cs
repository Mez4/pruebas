using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Bancos
{
    [TableName("Bancos.CatalogoCuentasBancos_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class CatalogoCuentasBancos_VW
    {
              
        
        [Column("CuentaBancariaPrincipalID")]
        public int CuentaBancariaPrincipalID { get; set; }
      
        
        [Column("TipoCuenta")]
        public string TipoCuenta { get; set; }
      
        
        [Column("NumeroCuentaPrincipal")]
        public string NumeroCuentaPrincipal { get; set; }
      
        
        [Column("DescripcionCuentaPrincipal")]
        public string DescripcionCuentaPrincipal { get; set; }
      
        
        [Column("CuentaBancoID")]
        public int CuentaBancoID { get; set; }
      
        
        [Column("NumeroCuenta")]
        public string NumeroCuenta { get; set; }
      
        
        [Column("DescripcionCuenta")]
        public string DescripcionCuenta { get; set; }
      
        
        [Column("CuentaContableID")]
        public int? CuentaContableID { get; set; }
      
        
        [Column("Cuenta")]
        public string Cuenta { get; set; }
      
        
        [Column("Nombre")]
        public string Nombre { get; set; }
      
        
        [Column("BancoID")]
        public int? BancoID { get; set; }
      
        
        [Column("NombreBanco")]
        public string NombreBanco { get; set; }
      
        
        [Column("CuentaBancoActiva")]
        public bool CuentaBancoActiva { get; set; }
      
        
        [Column("DispersionConvenio")]
        public string DispersionConvenio { get; set; }
      
        
        [Column("CobranzaConvenio")]
        public string CobranzaConvenio { get; set; }
      
        
        [Column("Global")]
        public bool Global { get; set; }
      
        
        [Column("PuedeDispersar")]
        public bool PuedeDispersar { get; set; }
      
        
        [Column("SaldoMinimo")]
        public decimal SaldoMinimo { get; set; }
      
        
        [Column("SaldoMaximo")]
        public decimal SaldoMaximo { get; set; }
      
        
        [Column("ExcedenteSaldo")]
        public decimal ExcedenteSaldo { get; set; }
      
        
        [Column("SaldoActual")]
        public decimal SaldoActual { get; set; }
      
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }
      
        
        [Column("Activo")]
        public bool Activo { get; set; }
      
        
        [Column("EsBoveda")]
        public bool EsBoveda { get; set; }
      
        
        [Column("Disponible")]
        public bool Disponible { get; set; }
      
        
        [Column("Producto")]
        public string Producto { get; set; }
      
        
        [Column("sucursalId")]
        public int? sucursalId { get; set; }
      
        
        [Column("sucursal")]
        public string sucursal { get; set; }


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

using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Tesoreria
{
    [TableName("Tesoreria.CatalogoCajasUsuariosSaldos_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class CatalogoCajasUsuariosSaldos_VW
    {
              
        
        [Column("UsuarioID")]
        public int UsuarioID { get; set; }
      
        
        [Column("CajaID")]
        public int CajaID { get; set; }
      
        
        [Column("Descripcion")]
        public string Descripcion { get; set; }
      
        
        [Column("SucursalID")]
        public int SucursalID { get; set; }
      
        
        [Column("Estatus")]
        public bool Estatus { get; set; }
      
        
        [Column("Nombre")]
        public string Nombre { get; set; }
      
        
        [Column("Clave")]
        public string Clave { get; set; }
      
        
        [Column("BovedaID")]
        public int BovedaID { get; set; }
      
        
        [Column("CuentaID")]
        public int? CuentaID { get; set; }
      
        
        [Column("PersonaID")]
        public Int64 PersonaID { get; set; }
      
        
        [Column("ResponsableID")]
        public Int64? ResponsableID { get; set; }
      
        
        [Column("IdCuentaODP")]
        public int? IdCuentaODP { get; set; }
      
        
        [Column("IdCuentaSpei")]
        public int? IdCuentaSpei { get; set; }
      
        
        [Column("Cerrada")]
        public bool Cerrada { get; set; }
      
        
        [Column("CanalesCobranza")]
        public bool? CanalesCobranza { get; set; }
      
        
        [Column("Convenia")]
        public bool? Convenia { get; set; }
      
        
        [Column("Restructura")]
        public bool? Restructura { get; set; }
      
        
        [Column("Sucursal")]
        public string Sucursal { get; set; }
      
        
        [Column("Activo")]
        public bool Activo { get; set; }
      
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }
      
        
        [Column("SaldoActual")]
        public decimal? SaldoActual { get; set; }


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

using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Tesoreria
{
    [TableName("Tesoreria.CatalogoMovimientosCaja")]
    [ExplicitColumns]
    [PrimaryKey("MovimientoCajaID")]
    public class CatalogoMovimientosCaja
    {
              
        
        [Column("MovimientoCajaID")]
        public int MovimientoCajaID { get; set; }
      
        
        [Column("MovimientoClave")]
        public string MovimientoClave { get; set; }
      
        
        [Column("Descripcion")]
        public string Descripcion { get; set; }
      
        
        [Column("VistaEnSaldo")]
        public bool VistaEnSaldo { get; set; }
      
        
        [Column("AceptaDepositos")]
        public bool AceptaDepositos { get; set; }
      
        
        [Column("AceptaRetiros")]
        public bool AceptaRetiros { get; set; }
      
        
        [Column("AplicaIva")]
        public bool AplicaIva { get; set; }
      
        
        [Column("ManejaCuentasDeOrden")]
        public bool ManejaCuentasDeOrden { get; set; }
      
        
        [Column("AplicaIde")]
        public bool AplicaIde { get; set; }
      
        
        [Column("PagaInteres")]
        public bool PagaInteres { get; set; }
      
        
        [Column("TasaInteres")]
        public decimal? TasaInteres { get; set; }
      
        
        [Column("RetieneIsr")]
        public bool RetieneIsr { get; set; }
      
        
        [Column("MontoApertura")]
        public decimal? MontoApertura { get; set; }
      
        
        [Column("MontoMaximo")]
        public decimal? MontoMaximo { get; set; }
      
        
        [Column("AplicaComision")]
        public bool AplicaComision { get; set; }
      
        
        [Column("MontoComision")]
        public decimal MontoComision { get; set; }
      
        
        [Column("SaldosComision")]
        public decimal? SaldosComision { get; set; }
      
        
        [Column("Retiro")]
        public int? Retiro { get; set; }
      
        
        [Column("Deposito")]
        public int? Deposito { get; set; }
      
        
        [Column("Comision")]
        public int? Comision { get; set; }
      
        
        [Column("Iva")]
        public int? Iva { get; set; }
      
        
        [Column("Activa")]
        public bool Activa { get; set; }


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

using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Bancos
{
    [TableName("Bancos.TiposMovimientos")]
    [ExplicitColumns]
    [PrimaryKey("Id")]
    public class TiposMovimientos
    {
              
        
        [Column("Id")]
        public int Id { get; set; }
      
        
        [Column("CveMovimientoID")]
        public string CveMovimientoID { get; set; }
      
        
        [Column("TipoMovimiento")]
        public string TipoMovimiento { get; set; }
      
        
        [Column("Cargo")]
        public bool Cargo { get; set; }
      
        [ComputedColumn(ComputedColumnType.Always)]
        [Column("Factor")]
        public int Factor { get; set; }
      
        
        [Column("usuario")]
        public bool? usuario { get; set; }
      
        
        [Column("CorresponsalId")]
        public int? CorresponsalId { get; set; }
      
        
        [Column("gastosRubroID")]
        public int? gastosRubroID { get; set; }
      
        
        [Column("AceptaDepositos")]
        public bool? AceptaDepositos { get; set; }
      
        
        [Column("AceptaRetiros")]
        public bool? AceptaRetiros { get; set; }
      
        
        [Column("AplicaIva")]
        public bool? AplicaIva { get; set; }
      
        
        [Column("ManejaCuentasdeOrden")]
        public bool? ManejaCuentasdeOrden { get; set; }
      
        
        [Column("AplicaIde")]
        public bool? AplicaIde { get; set; }
      
        
        [Column("PagaInteres")]
        public bool? PagaInteres { get; set; }
      
        
        [Column("TasaInteres")]
        public decimal? TasaInteres { get; set; }
      
        
        [Column("RetieneIsr")]
        public bool? RetieneIsr { get; set; }
      
        
        [Column("MontoApertura")]
        public decimal? MontoApertura { get; set; }
      
        
        [Column("MontoMaximo")]
        public decimal? MontoMaximo { get; set; }
      
        
        [Column("AplicaComision")]
        public bool? AplicaComision { get; set; }
      
        
        [Column("MontoComision")]
        public decimal? MontoComision { get; set; }
      
        
        [Column("RetiroId")]
        public int? RetiroId { get; set; }
      
        
        [Column("DepositoId")]
        public int? DepositoId { get; set; }
      
        
        [Column("ComisionId")]
        public int? ComisionId { get; set; }
      
        
        [Column("IvaId")]
        public int? IvaId { get; set; }
      
        
        [Column("Activa")]
        public bool Activa { get; set; }
      
        
        [Column("MovAgrupaID")]
        public int MovAgrupaID { get; set; }
      
        
        [Column("ProductoId")]
        public int? ProductoId { get; set; }
      
        
        [Column("Transfiere")]
        public bool? Transfiere { get; set; }
      
        
        [Column("DeSistema")]
        public bool DeSistema { get; set; }
      
        
        [Column("ManejaEfectivo")]
        public bool? ManejaEfectivo { get; set; }
      
        
        [Column("GenerarBalance")]
        public bool GenerarBalance { get; set; }
      
        
        [Column("AfectaCaja")]
        public bool? AfectaCaja { get; set; }


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

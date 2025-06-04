using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Bancos
{
    [TableName("Bancos.MovimientosDetalle")]
    [ExplicitColumns]
    [PrimaryKey("MovimientoDetalleID,MovimientoID", AutoIncrement=false)]
    public class MovimientosDetalle
    {
              
        
        [Column("MovimientoID")]
        public Int64 MovimientoID { get; set; }
      
        
        [Column("MovimientoDetalleID")]
        public Int64 MovimientoDetalleID { get; set; }
      
        
        [Column("CreditoID")]
        public Int64? CreditoID { get; set; }
      
        
        [Column("NoPago")]
        public int? NoPago { get; set; }
      
        
        [Column("Capital")]
        public decimal Capital { get; set; }
      
        
        [Column("Interes")]
        public decimal Interes { get; set; }
      
        
        [Column("Comision")]
        public decimal Comision { get; set; }
      
        
        [Column("ManejoCuenta")]
        public decimal ManejoCuenta { get; set; }
      
        
        [Column("Seguro")]
        public decimal Seguro { get; set; }
      
        
        [Column("Cargo")]
        public decimal Cargo { get; set; }
      
        
        [Column("IVA")]
        public decimal IVA { get; set; }
      
        [ComputedColumn(ComputedColumnType.Always)]
        [Column("Importe")]
        public decimal? Importe { get; set; }
      
        
        [Column("noPagoCan")]
        public int? noPagoCan { get; set; }
      
        
        [Column("capitalCan")]
        public decimal? capitalCan { get; set; }
      
        
        [Column("interesCan")]
        public decimal? interesCan { get; set; }
      
        
        [Column("comisionCan")]
        public decimal? comisionCan { get; set; }
      
        
        [Column("manejoCuentaCan")]
        public decimal? manejoCuentaCan { get; set; }
      
        
        [Column("seguroCan")]
        public decimal? seguroCan { get; set; }
      
        
        [Column("cargoCan")]
        public decimal? cargoCan { get; set; }
      
        
        [Column("IVACan")]
        public decimal? IVACan { get; set; }
      
        
        [Column("PolizaMovId")]
        public Int64? PolizaMovId { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.Bancos.Movimientos>> CH__MOVIMIENTO(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Bancos.Movimientos>("WHERE MovimientoID = @MovimientoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.Creditos>> CH__CREDITO(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.Creditos>("WHERE CreditoID = @CreditoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

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

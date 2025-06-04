using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Creditos
{
    [TableName("Creditos.Abonos")]
    [ExplicitColumns]
    [PrimaryKey("AbonoID")]
    public class Abonos
    {
              
        
        [Column("AplicacionID")]
        public Int64 AplicacionID { get; set; }
      
        
        [Column("AbonoID")]
        public Int64 AbonoID { get; set; }
      
        
        [Column("CreditoID")]
        public Int64 CreditoID { get; set; }
      
        
        [Column("NoPago")]
        public int NoPago { get; set; }
      
        
        [Column("Fecha")]
        public DateTime? Fecha { get; set; }
      
        
        [Column("FechaHoraAbono")]
        public DateTime FechaHoraAbono { get; set; }
      
        
        [Column("Capital")]
        public decimal Capital { get; set; }
      
        
        [Column("Interes")]
        public decimal Interes { get; set; }
      
        
        [Column("ManejoCuenta")]
        public decimal ManejoCuenta { get; set; }
      
        
        [Column("Seguro")]
        public decimal Seguro { get; set; }
      
        
        [Column("Cargo")]
        public decimal Cargo { get; set; }
      
        
        [Column("IVA")]
        public decimal IVA { get; set; }
      
        
        [Column("Comision")]
        public decimal Comision { get; set; }
      
        
        [Column("Abono")]
        public decimal Abono { get; set; }
      
        
        [Column("PagoPPI")]
        public decimal? PagoPPI { get; set; }
      
        [ComputedColumn(ComputedColumnType.Always)]
        [Column("ImporteTotal")]
        public decimal? ImporteTotal { get; set; }
      
        
        [Column("fechaCorte")]
        public DateTime? fechaCorte { get; set; }
      
        
        [Column("FechaHoraUltimoPagoAnt")]
        public DateTime? FechaHoraUltimoPagoAnt { get; set; }
      
        
        [Column("FechaVencimiento")]
        public DateTime? FechaVencimiento { get; set; }
      
        
        [Column("PagoAtrasado")]
        public bool? PagoAtrasado { get; set; }
      
        
        [Column("PagoAnticipado")]
        public bool? PagoAnticipado { get; set; }
      
        
        [Column("AbonoCliente")]
        public bool? AbonoCliente { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.Creditos.Aplicaciones>> CH__APLICACION(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.Aplicaciones>("WHERE AplicacionID = @AplicacionID", this).ToListAsync();
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

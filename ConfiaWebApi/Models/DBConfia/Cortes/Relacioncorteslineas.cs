using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Cortes
{
    [TableName("Cortes.RelacionCortesLineas")]
    [ExplicitColumns]
    [PrimaryKey("ContratoID,DistribuidorID,fechaCorte,LineaAdicionalTipoID", AutoIncrement=false)]
    public class RelacionCortesLineas
    {
              
        
        [Column("fechaCorte")]
        public DateTime fechaCorte { get; set; }
      
        
        [Column("fechaVencimiento")]
        public DateTime? fechaVencimiento { get; set; }
      
        
        [Column("ContratoID")]
        public Int64 ContratoID { get; set; }
      
        
        [Column("LineaAdicionalTipoID")]
        public int LineaAdicionalTipoID { get; set; }
      
        
        [Column("LineaCredito")]
        public decimal? LineaCredito { get; set; }
      
        
        [Column("LineaCreditoDisponible")]
        public decimal? LineaCreditoDisponible { get; set; }
      
        
        [Column("NoCreditosActivos")]
        public int? NoCreditosActivos { get; set; }
      
        
        [Column("SaldoActual")]
        public decimal? SaldoActual { get; set; }
      
        
        [Column("CapitalColocado")]
        public decimal? CapitalColocado { get; set; }
      
        
        [Column("DistribuidorID")]
        public Int64 DistribuidorID { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.Distribuidores.Distribuidores>> CH__DISTRIBUIDOR(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Distribuidores>("WHERE DistribuidorID = @DistribuidorID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.Contratos>> CH__CONTRATO(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.Contratos>("WHERE ContratoID = @ContratoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Catalogos.LineasAdicionalesTipos>> CH__LINEA_ADICIONAL_TIPO(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Catalogos.LineasAdicionalesTipos>("WHERE LineaAdicionalTipoID = @Id", this).ToListAsync();
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

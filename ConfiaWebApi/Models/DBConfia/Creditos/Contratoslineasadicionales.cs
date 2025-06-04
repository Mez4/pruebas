using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Creditos
{
    [TableName("Creditos.ContratosLineasAdicionales")]
    [ExplicitColumns]
    [PrimaryKey("ContratoID,LineaAdicionalTipoID", AutoIncrement=false)]
    public class ContratosLineasAdicionales
    {
              
        
        [Column("ContratoID")]
        public Int64 ContratoID { get; set; }
      
        
        [Column("LineaAdicionalTipoID")]
        public int LineaAdicionalTipoID { get; set; }
      
        
        [Column("LineaCredito")]
        public decimal LineaCredito { get; set; }
      
        
        [Column("LineaCreditoDisponible")]
        public decimal LineaCreditoDisponible { get; set; }
      
        
        [Column("SaldoActual")]
        public decimal SaldoActual { get; set; }
      
        
        [Column("NoCreditosActivos")]
        public int NoCreditosActivos { get; set; }
      
        
        [Column("CapitalColocado")]
        public decimal CapitalColocado { get; set; }
      
        
        [Column("FechaHoraRegistro")]
        public DateTime FechaHoraRegistro { get; set; }
      
        
        [Column("PersonaIDRegistro")]
        public Int64 PersonaIDRegistro { get; set; }
      
        
        [Column("UsuarioIDRegistro")]
        public int UsuarioIDRegistro { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
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

        public async Task<List<DBContext.DBConfia.General.Personas>> CH__PERSONA_REGISTRO(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.Personas>("WHERE PersonaIDRegistro = @PersonaID", this).ToListAsync();
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

        public async Task<List<DBContext.DBConfia.Seguridad.Usuarios>> CH__SEGURIDAD_USUARIOSB9E30BA5(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios>("WHERE UsuarioIDRegistro = @UsuarioID", this).ToListAsync();
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
        
        public async Task<List<DBContext.DBConfia.Creditos.ContratosLineasAdicionalesLogCambios>> PA__Creditos___ContratosLineasAdicionalesLogCambios___ContratoID__LineaAdicionalTipoID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.ContratosLineasAdicionalesLogCambios>("WHERE ContratoID = @ContratoID AND LineaAdicionalTipoID = @LineaAdicionalTipoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        // ###############################################
        // <<
        // Child foreing keys
        // ###############################################
        
    }
}

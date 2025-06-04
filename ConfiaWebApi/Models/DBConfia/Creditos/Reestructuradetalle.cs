using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Creditos
{
    [TableName("Creditos.ReestructuraDetalle")]
    [ExplicitColumns]
    [PrimaryKey("ReestructuraDetalleID")]
    public class ReestructuraDetalle
    {
              
        
        [Column("ReestructuraDetalleID")]
        public Int64 ReestructuraDetalleID { get; set; }
      
        
        [Column("ReestructuraID")]
        public Int64? ReestructuraID { get; set; }
      
        
        [Column("CreditoID")]
        public Int64? CreditoID { get; set; }
      
        
        [Column("FechaCreacion")]
        public DateTime? FechaCreacion { get; set; }
      
        
        [Column("FechaCorte")]
        public DateTime? FechaCorte { get; set; }
      
        
        [Column("TipoReestructuraID")]
        public int? TipoReestructuraID { get; set; }
      
        
        [Column("saldoLiquidado")]
        public decimal? saldoLiquidado { get; set; }
      
        
        [Column("MontoReestructura")]
        public decimal? MontoReestructura { get; set; }
      
        
        [Column("PersonaID")]
        public Int64? PersonaID { get; set; }
      
        
        [Column("UsuarioID")]
        public int? UsuarioID { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.General.Personas>> CH__PERSONA(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.Personas>("WHERE PersonaID = @PersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Seguridad.Usuarios>> CH__USUARIO(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios>("WHERE UsuarioID = @UsuarioID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.Reestructura>> CH__REESTRUCTURA(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.Reestructura>("WHERE ReestructuraID = @ReestructuraID", this).ToListAsync();
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

        public async Task<List<DBContext.DBConfia.Creditos.TipoReestructura>> CH__TIPO(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.TipoReestructura>("WHERE TipoReestructuraID = @TipoReestructuraID", this).ToListAsync();
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

using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Catalogos
{
    [TableName("Catalogos.LineasAdicionalesTipos")]
    [ExplicitColumns]
    [PrimaryKey("Id")]
    public class LineasAdicionalesTipos
    {
              
        
        [Column("Id")]
        public int Id { get; set; }
      
        
        [Column("LineaAdicionalTipoDesc")]
        public string LineaAdicionalTipoDesc { get; set; }


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
        
        public async Task<List<DBContext.DBConfia.Cortes.RelacionCortesLineas>> PA__Cortes___RelacionCortesLineas___LineaAdicionalTipoID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Cortes.RelacionCortesLineas>("WHERE Id = @LineaAdicionalTipoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.ContratosLineasAdicionales>> PA__Creditos___ContratosLineasAdicionales___LineaAdicionalTipoID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.ContratosLineasAdicionales>("WHERE Id = @LineaAdicionalTipoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.ContratosLineasAdicionalesHistorico>> PA__Creditos___ContratosLineasAdicionalesHistorico___LineaAdicionalTipoID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.ContratosLineasAdicionalesHistorico>("WHERE Id = @LineaAdicionalTipoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.ContratosLineasAdicionalesLogCambios>> PA__Creditos___ContratosLineasAdicionalesLogCambios___LineaAdicionalTipoID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.ContratosLineasAdicionalesLogCambios>("WHERE Id = @LineaAdicionalTipoID", this).ToListAsync();
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

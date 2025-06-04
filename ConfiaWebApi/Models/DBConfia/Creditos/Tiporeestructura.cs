using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Creditos
{
    [TableName("Creditos.TipoReestructura")]
    [ExplicitColumns]
    [PrimaryKey("TipoReestructuraID")]
    public class TipoReestructura
    {
              
        
        [Column("TipoReestructuraID")]
        public int TipoReestructuraID { get; set; }
      
        
        [Column("Tipo")]
        public string Tipo { get; set; }


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
        
        public async Task<List<DBContext.DBConfia.Creditos.Reestructura>> PA__Creditos___Reestructura___TipoReestructuraID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.Reestructura>("WHERE TipoReestructuraID = @TipoReestructuraID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.ReestructuraDetalle>> PA__Creditos___ReestructuraDetalle___TipoReestructuraID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.ReestructuraDetalle>("WHERE TipoReestructuraID = @TipoReestructuraID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.SolicitudReestructura>> PA__Creditos___SolicitudReestructura___TipoReestructuraID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.SolicitudReestructura>("WHERE TipoReestructuraID = @TipoReestructuraID", this).ToListAsync();
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

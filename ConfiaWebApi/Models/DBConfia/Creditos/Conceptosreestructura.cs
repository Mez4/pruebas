using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Creditos
{
    [TableName("Creditos.ConceptosReestructura")]
    [ExplicitColumns]
    [PrimaryKey("ConceptoReestructuraID")]
    public class ConceptosReestructura
    {
              
        
        [Column("ConceptoReestructuraID")]
        public int ConceptoReestructuraID { get; set; }
      
        
        [Column("Concepto")]
        public string Concepto { get; set; }


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
        
        public async Task<List<DBContext.DBConfia.Creditos.SolicitudReestructura>> PA__Creditos___SolicitudReestructura___ConceptoReestructuraID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.SolicitudReestructura>("WHERE ConceptoReestructuraID = @ConceptoReestructuraID", this).ToListAsync();
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

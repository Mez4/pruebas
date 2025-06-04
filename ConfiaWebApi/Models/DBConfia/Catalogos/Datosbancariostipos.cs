using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Catalogos
{
    [TableName("Catalogos.DatosBancariosTipos")]
    [ExplicitColumns]
    [PrimaryKey("datoTipoID")]
    public class DatosBancariosTipos
    {
              
        
        [Column("datoTipoID")]
        public int datoTipoID { get; set; }
      
        
        [Column("datoTipoDesc")]
        public string datoTipoDesc { get; set; }
      
        
        [Column("dispersion")]
        public bool dispersion { get; set; }
      
        
        [Column("cobranza")]
        public bool cobranza { get; set; }
      
        
        [Column("EnApp")]
        public bool? EnApp { get; set; }


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
        
        public async Task<List<DBContext.DBConfia.General.PersonasDatosBancarios>> PA__General___PersonasDatosBancarios___datoTipoID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.PersonasDatosBancarios>("WHERE datoTipoID = @datoTipoID", this).ToListAsync();
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

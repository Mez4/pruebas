using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Prospeccion
{
    [TableName("Prospeccion.Mensajes")]
    [ExplicitColumns]
    [PrimaryKey("MensajeID")]
    public class Mensajes
    {
              
        
        [Column("MensajeID")]
        public int MensajeID { get; set; }
      
        
        [Column("Mensaje")]
        public string Mensaje { get; set; }


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
        
        public async Task<List<DBContext.DBConfia.Prospeccion.MensajesRelacion>> PA__Prospeccion___MensajesRelacion___MensajeID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.MensajesRelacion>("WHERE MensajeID = @MensajeID", this).ToListAsync();
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

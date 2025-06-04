using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Distribuidores
{
    [TableName("Distribuidores.ValeraEvidenciaDocs")]
    [ExplicitColumns]
    [PrimaryKey("ValeraDocsEntregaID")]
    public class ValeraEvidenciaDocs
    {
              
        
        [Column("ValeraDocsEntregaID")]
        public Int64 ValeraDocsEntregaID { get; set; }
      
        
        [Column("CatalogoImagenID")]
        public int? CatalogoImagenID { get; set; }
      
        
        [Column("ValeraID")]
        public Int64 ValeraID { get; set; }
      
        
        [Column("Ruta")]
        public string Ruta { get; set; }
      
        
        [Column("Autorizado")]
        public bool? Autorizado { get; set; }
      
        
        [Column("FechaCreacion")]
        public DateTime FechaCreacion { get; set; }
      
        
        [Column("FechaAutoriza")]
        public DateTime? FechaAutoriza { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.Distribuidores.Valera>> CH__VALERA(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Valera>("WHERE ValeraID = @ValeraID", this).ToListAsync();
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

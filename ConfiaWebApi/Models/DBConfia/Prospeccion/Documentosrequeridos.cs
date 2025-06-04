using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Prospeccion
{
    [TableName("Prospeccion.DocumentosRequeridos")]
    [ExplicitColumns]
    [PrimaryKey("DocumentoRequeridoID")]
    public class DocumentosRequeridos
    {
              
        
        [Column("DocumentoRequeridoID")]
        public Int64 DocumentoRequeridoID { get; set; }
      
        
        [Column("TipoDocumentoID")]
        public Int64 TipoDocumentoID { get; set; }
      
        
        [Column("Status")]
        public string Status { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.Catalogos.TipoDocumento>> CH__TIPO_DOCUMENTO(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Catalogos.TipoDocumento>("WHERE TipoDocumentoID = @TipoDocumentoID", this).ToListAsync();
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

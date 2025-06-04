using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Prospeccion
{
    [TableName("Prospeccion.DocumentosRegresados")]
    [ExplicitColumns]
    [PrimaryKey("DocumentoRegresadoID")]
    public class DocumentosRegresados
    {
              
        
        [Column("DocumentoRegresadoID")]
        public Int64 DocumentoRegresadoID { get; set; }
      
        
        [Column("DocumentoID")]
        public Int64? DocumentoID { get; set; }
      
        
        [Column("Observacion")]
        public string Observacion { get; set; }
      
        
        [Column("Fecha")]
        public DateTime Fecha { get; set; }
      
        
        [Column("DocumentoAvalID")]
        public Int64? DocumentoAvalID { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.Prospeccion.Documentos>> CH__DOCUMENTO(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.Documentos>("WHERE DocumentoID = @DocumentoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Prospeccion.DocumentosAval>> CH__DOCUMENTO_AVAL(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.DocumentosAval>("WHERE DocumentoAvalID = @DocumentoAvalID", this).ToListAsync();
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

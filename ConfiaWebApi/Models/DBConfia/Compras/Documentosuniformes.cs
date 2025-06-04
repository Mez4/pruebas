using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Compras
{
    [TableName("Compras.DocumentosUniformes")]
    [ExplicitColumns]
    [PrimaryKey("DocumentoID")]
    public class DocumentosUniformes
    {
              
        
        [Column("DocumentoID")]
        public Int64 DocumentoID { get; set; }
      
        
        [Column("SurtidoID")]
        public int? SurtidoID { get; set; }
      
        
        [Column("Ruta")]
        public string Ruta { get; set; }
      
        
        [Column("Autorizado")]
        public bool Autorizado { get; set; }
      
        
        [Column("Firmado")]
        public bool? Firmado { get; set; }
      
        
        [Column("RecepcionID")]
        public int? RecepcionID { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.Compras.Surtido>> CH__Documento(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Compras.Surtido>("WHERE SurtidoID = @SurtidoID", this).ToListAsync();
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

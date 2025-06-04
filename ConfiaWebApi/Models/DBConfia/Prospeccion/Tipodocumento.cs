using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Prospeccion
{
    [TableName("Prospeccion.TipoDocumento")]
    [ExplicitColumns]
    [PrimaryKey("TipoDocumentoID")]
    public class TipoDocumento
    {
              
        
        [Column("TipoDocumentoID")]
        public Int64 TipoDocumentoID { get; set; }
      
        
        [Column("CatalogoTipoDocumentoID")]
        public Int64 CatalogoTipoDocumentoID { get; set; }
      
        
        [Column("Orden")]
        public int? Orden { get; set; }
      
        
        [Column("Activo")]
        public bool Activo { get; set; }
      
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }
      
        
        [Column("ConsultaBuro")]
        public bool ConsultaBuro { get; set; }
      
        
        [Column("Opcional")]
        public bool? Opcional { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.Creditos.Productos>> CH__PRODUCTO(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.Productos>("WHERE ProductoID = @ProductoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Catalogos.TipoDocumento>> CH__TIPO_DOCUMENTO(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Catalogos.TipoDocumento>("WHERE CatalogoTipoDocumentoID = @TipoDocumentoID", this).ToListAsync();
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
        
        public async Task<List<DBContext.DBConfia.Prospeccion.Documentos>> PA__Prospeccion___Documentos___TipoDocumentoID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.Documentos>("WHERE TipoDocumentoID = @TipoDocumentoID", this).ToListAsync();
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

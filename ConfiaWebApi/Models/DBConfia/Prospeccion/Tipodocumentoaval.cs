using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Prospeccion
{
    [TableName("Prospeccion.TipoDocumentoAval")]
    [ExplicitColumns]
    [PrimaryKey("TipoDocumentoAvalID")]
    public class TipoDocumentoAval
    {
              
        
        [Column("TipoDocumentoAvalID")]
        public Int64 TipoDocumentoAvalID { get; set; }
      
        
        [Column("CatalogoTipoDocumentoID")]
        public Int64 CatalogoTipoDocumentoID { get; set; }
      
        
        [Column("Orden")]
        public int? Orden { get; set; }
      
        
        [Column("Activo")]
        public bool Activo { get; set; }
      
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
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

        // ###############################################
        // <<
        // Parent foreing keys
        // ###############################################

        // ###############################################
        // Child foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.Prospeccion.DocumentosAval>> PA__Prospeccion___DocumentosAval___TipoDocumentoAvalID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.DocumentosAval>("WHERE TipoDocumentoAvalID = @TipoDocumentoAvalID", this).ToListAsync();
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

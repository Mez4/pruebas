using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Cobranza
{
    [TableName("Cobranza.tabDiasMora")]
    [ExplicitColumns]
    [PrimaryKey("idTabMora")]
    public class tabDiasMora
    {
              
        
        [Column("idTabMora")]
        public int idTabMora { get; set; }
      
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }
      
        
        [Column("limInferiorDias")]
        public int limInferiorDias { get; set; }
      
        
        [Column("limSuperiorDias")]
        public int limSuperiorDias { get; set; }
      
        
        [Column("diasMoraCartera")]
        public int? diasMoraCartera { get; set; }
      
        
        [Column("Activo")]
        public bool Activo { get; set; }


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

        // ###############################################
        // <<
        // Parent foreing keys
        // ###############################################

        // ###############################################
        // Child foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.Cobranza.RelacionMesaProducto>> PA__Cobranza___RelacionMesaProducto___idTabMora(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Cobranza.RelacionMesaProducto>("WHERE idTabMora = @idTabMora", this).ToListAsync();
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

using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Prospeccion
{
    [TableName("Prospeccion.ProductoMesaCredito")]
    [ExplicitColumns]
    [PrimaryKey("ProductoMesaCreditoID")]
    public class ProductoMesaCredito
    {
              
        
        [Column("ProductoMesaCreditoID")]
        public int ProductoMesaCreditoID { get; set; }
      
        
        [Column("MesaCreditoID")]
        public int MesaCreditoID { get; set; }
      
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }
      
        
        [Column("Activo")]
        public bool Activo { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.Prospeccion.MesaCredito>> CH__MESA_CREDITO(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.MesaCredito>("WHERE MesaCreditoID = @MesaCreditoID", this).ToListAsync();
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
        
        // ###############################################
        // <<
        // Child foreing keys
        // ###############################################
        
    }
}

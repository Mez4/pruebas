using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Cobranza
{
    [TableName("Cobranza.RelacionMesaProducto")]
    [ExplicitColumns]
    [PrimaryKey("idRelMesaCredProd")]
    public class RelacionMesaProducto
    {
              
        
        [Column("idRelMesaCredProd")]
        public int idRelMesaCredProd { get; set; }
      
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }
      
        
        [Column("idTabMora")]
        public int idTabMora { get; set; }
      
        
        [Column("MesaCobranzaID")]
        public int MesaCobranzaID { get; set; }
      
        
        [Column("Activo")]
        public bool Activo { get; set; }
      
        
        [Column("verifDom")]
        public bool verifDom { get; set; }
      
        
        [Column("Monitoreo")]
        public bool Monitoreo { get; set; }
      
        
        [Column("Cobranza")]
        public bool Cobranza { get; set; }
      
        
        [Column("Coordinador")]
        public bool Coordinador { get; set; }
      
        
        [Column("Legal")]
        public bool Legal { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.Cobranza.MesaCobranza>> CH__MESA_COB(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Cobranza.MesaCobranza>("WHERE MesaCobranzaID = @MesaCobranzaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Cobranza.tabDiasMora>> CH__MORA(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Cobranza.tabDiasMora>("WHERE idTabMora = @idTabMora", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.Productos>> CH__PRODUCTO_R(DBConfiaContext parContext)
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

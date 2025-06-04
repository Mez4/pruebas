using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.MesaCredito
{
    [TableName("MesaCredito.ProductosCredMesa")]
    [ExplicitColumns]
    [PrimaryKey("ProdCredMesaID")]
    public class ProductosCredMesa
    {
              
        
        [Column("ProdCredMesaID")]
        public int ProdCredMesaID { get; set; }
      
        
        [Column("MesaCreditoID")]
        public int MesaCreditoID { get; set; }
      
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }
      
        
        [Column("Activo")]
        public bool? Activo { get; set; }


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
        
        // ###############################################
        // <<
        // Child foreing keys
        // ###############################################
        
    }
}

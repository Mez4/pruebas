using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Aclaraciones
{
    [TableName("Aclaraciones.ProductoMesaAclaracion_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class ProductoMesaAclaracion_VW
    {
              
        
        [Column("ProductoMesaAclaracionID")]
        public int ProductoMesaAclaracionID { get; set; }
      
        
        [Column("MesaAclaracionID")]
        public int? MesaAclaracionID { get; set; }
      
        
        [Column("NombreMesaAclaracion")]
        public string NombreMesaAclaracion { get; set; }
      
        
        [Column("ProductoID")]
        public int? ProductoID { get; set; }
      
        
        [Column("Producto")]
        public string Producto { get; set; }
      
        
        [Column("Activo")]
        public bool Activo { get; set; }


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

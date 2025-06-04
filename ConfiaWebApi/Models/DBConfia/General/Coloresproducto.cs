using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.General
{
    [TableName("General.ColoresProducto")]
    [ExplicitColumns]
    [PrimaryKey("ColorProductoID")]
    public class ColoresProducto
    {
              
        
        [Column("ColorProductoID")]
        public int ColorProductoID { get; set; }
      
        
        [Column("idTipoEmpresa")]
        public int? idTipoEmpresa { get; set; }
      
        
        [Column("NombreColor")]
        public string NombreColor { get; set; }
      
        
        [Column("ValorColor")]
        public Int64? ValorColor { get; set; }


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

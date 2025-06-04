using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.InventarioUniformes")]
    [ExplicitColumns]
    [PrimaryKey("Id", AutoIncrement=false)]
    public class InventarioUniformes
    {
              
        
        [Column("Id")]
        public string Id { get; set; }
      
        
        [Column("Usuario")]
        public Int64 Usuario { get; set; }
      
        
        [Column("Producto")]
        public int Producto { get; set; }
      
        
        [Column("IdProfesor")]
        public string IdProfesor { get; set; }
      
        
        [Column("NumeroPiezas")]
        public int NumeroPiezas { get; set; }
      
        
        [Column("FechaPedido")]
        public DateTime FechaPedido { get; set; }


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

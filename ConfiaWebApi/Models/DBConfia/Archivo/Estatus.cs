using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Archivo
{
    [TableName("Archivo.Estatus")]
    [ExplicitColumns]
    [PrimaryKey("EstatusID")]
    public class Estatus
    {
              
        
        [Column("EstatusID")]
        public int EstatusID { get; set; }
      
        
        [Column("NombreEstatus")]
        public string NombreEstatus { get; set; }
      
        
        [Column("Clave")]
        public string Clave { get; set; }
      
        
        [Column("Color")]
        public string Color { get; set; }
      
        
        [Column("Descripcion")]
        public string Descripcion { get; set; }


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

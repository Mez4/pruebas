using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Sistema
{
    [TableName("Sistema.Pantallas_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class Pantallas_VW
    {
              
        
        [Column("ModuloID")]
        public int ModuloID { get; set; }
      
        
        [Column("ModuloNombre")]
        public string ModuloNombre { get; set; }
      
        
        [Column("ModuloRuta")]
        public string ModuloRuta { get; set; }
      
        
        [Column("ModuloColorFondo")]
        public string ModuloColorFondo { get; set; }
      
        
        [Column("ModuloColorBorde")]
        public string ModuloColorBorde { get; set; }
      
        
        [Column("ModuloColorFuente")]
        public string ModuloColorFuente { get; set; }
      
        
        [Column("PantallaID")]
        public int PantallaID { get; set; }
      
        
        [Column("PantallaNombre")]
        public string PantallaNombre { get; set; }
      
        
        [Column("PantallaDescripcion")]
        public string PantallaDescripcion { get; set; }
      
        
        [Column("PantallaRuta")]
        public string PantallaRuta { get; set; }


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

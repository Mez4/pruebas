using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Creditos
{
    [TableName("Creditos.Comisiones_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class Comisiones_VW
    {
              
        
        [Column("ComisionesID")]
        public int ComisionesID { get; set; }
      
        
        [Column("Descripcion")]
        public string Descripcion { get; set; }
      
        
        [Column("Activo")]
        public bool Activo { get; set; }
      
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }
      
        
        [Column("Producto")]
        public string Producto { get; set; }
      
        
        [Column("RegistroUsuarioId")]
        public int RegistroUsuarioId { get; set; }
      
        
        [Column("ModificaUsuarioId")]
        public int ModificaUsuarioId { get; set; }
      
        
        [Column("RegistroFecha")]
        public DateTime RegistroFecha { get; set; }
      
        
        [Column("ModificaFecha")]
        public DateTime ModificaFecha { get; set; }
      
        
        [Column("identifier")]
        public Int64? identifier { get; set; }


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

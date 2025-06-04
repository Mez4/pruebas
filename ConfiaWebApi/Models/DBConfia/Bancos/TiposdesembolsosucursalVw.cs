using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Bancos
{
    [TableName("Bancos.TiposDesembolsoSucursal_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class TiposDesembolsoSucursal_VW
    {
              
        
        [Column("SucursalID")]
        public int SucursalID { get; set; }
      
        
        [Column("Nombre")]
        public string Nombre { get; set; }
      
        
        [Column("TipoDesembolsoID")]
        public int TipoDesembolsoID { get; set; }
      
        
        [Column("TipoDesembolso")]
        public string TipoDesembolso { get; set; }
      
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }
      
        
        [Column("Producto")]
        public string Producto { get; set; }
      
        
        [Column("RegistroUsuarioId")]
        public int RegistroUsuarioId { get; set; }
      
        
        [Column("RegistroFecha")]
        public DateTime RegistroFecha { get; set; }
      
        
        [Column("ModificaUsuarioId")]
        public int? ModificaUsuarioId { get; set; }
      
        
        [Column("ModificaFecha")]
        public DateTime? ModificaFecha { get; set; }


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

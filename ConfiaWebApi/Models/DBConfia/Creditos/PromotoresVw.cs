using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Creditos
{
    [TableName("Creditos.Promotores_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class Promotores_VW
    {
              
        
        [Column("creditoPromotorId")]
        public Int64 creditoPromotorId { get; set; }
      
        
        [Column("creditoPromotorNombre")]
        public string creditoPromotorNombre { get; set; }
      
        
        [Column("fhRegistro")]
        public DateTime fhRegistro { get; set; }
      
        
        [Column("activo")]
        public bool activo { get; set; }
      
        
        [Column("ProductoID")]
        public int? ProductoID { get; set; }
      
        
        [Column("NombreProducto")]
        public string NombreProducto { get; set; }
      
        
        [Column("SucursalID")]
        public int? SucursalID { get; set; }
      
        
        [Column("ZonaNombre")]
        public string ZonaNombre { get; set; }
      
        
        [Column("SucursalNombre")]
        public string SucursalNombre { get; set; }
      
        
        [Column("UsuarioRegistro")]
        public string UsuarioRegistro { get; set; }


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

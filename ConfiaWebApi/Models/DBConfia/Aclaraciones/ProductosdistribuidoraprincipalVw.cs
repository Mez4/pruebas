using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Aclaraciones
{
    [TableName("Aclaraciones.ProductosDistribuidoraPrincipal_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class ProductosDistribuidoraPrincipal_VW
    {
              
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }
      
        
        [Column("Producto")]
        public string Producto { get; set; }
      
        
        [Column("empresaId")]
        public int? empresaId { get; set; }
      
        
        [Column("empresaNombre")]
        public string empresaNombre { get; set; }
      
        
        [Column("SucursalID2")]
        public int? SucursalID2 { get; set; }
      
        
        [Column("NombreSucursal")]
        public string NombreSucursal { get; set; }
      
        
        [Column("Principal")]
        public bool? Principal { get; set; }
      
        
        [Column("DistribuidorID")]
        public Int64? DistribuidorID { get; set; }
      
        
        [Column("NombreCompleto")]
        public string NombreCompleto { get; set; }
      
        
        [Column("Activo")]
        public bool Activo { get; set; }
      
        
        [Column("GrupoID")]
        public int? GrupoID { get; set; }
      
        
        [Column("SucursalID")]
        public int? SucursalID { get; set; }
      
        
        [Column("CoordinadorID")]
        public Int64? CoordinadorID { get; set; }


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

using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Aclaraciones
{
    [TableName("Aclaraciones.SucursalMesas_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class SucursalMesas_VW
    {
              
        
        [Column("MesaSucursalID")]
        public int MesaSucursalID { get; set; }
      
        
        [Column("MesaAclaracionID")]
        public int? MesaAclaracionID { get; set; }
      
        
        [Column("NombreMesaAclaracion")]
        public string NombreMesaAclaracion { get; set; }
      
        
        [Column("SucursalID")]
        public int? SucursalID { get; set; }
      
        
        [Column("NombreSucursal")]
        public string NombreSucursal { get; set; }
      
        
        [Column("Activa")]
        public bool Activa { get; set; }
      
        
        [Column("Eliminado")]
        public bool? Eliminado { get; set; }
      
        
        [Column("Nueva")]
        public bool? Nueva { get; set; }
      
        
        [Column("Existe")]
        public bool? Existe { get; set; }


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

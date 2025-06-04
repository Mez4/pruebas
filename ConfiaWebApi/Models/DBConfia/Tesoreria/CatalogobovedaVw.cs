using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Tesoreria
{
    [TableName("Tesoreria.CatalogoBoveda_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class CatalogoBoveda_VW
    {
              
        
        [Column("BovedaID")]
        public int BovedaID { get; set; }
      
        
        [Column("BancoID")]
        public int? BancoID { get; set; }
      
        
        [Column("PersonaID")]
        public Int64 PersonaID { get; set; }
      
        
        [Column("NombreBoveda")]
        public string NombreBoveda { get; set; }
      
        
        [Column("Clave")]
        public string Clave { get; set; }
      
        
        [Column("Activa")]
        public bool? Activa { get; set; }
      
        
        [Column("CuentaID")]
        public int? CuentaID { get; set; }
      
        
        [Column("NombreCuentaContable")]
        public string NombreCuentaContable { get; set; }
      
        
        [Column("NombreSucursal")]
        public string NombreSucursal { get; set; }
      
        
        [Column("SucursalID")]
        public int? SucursalID { get; set; }
      
        
        [Column("NombreResponsble")]
        public string NombreResponsble { get; set; }
      
        
        [Column("Cerrada")]
        public bool Cerrada { get; set; }


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

using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Bancos
{
    [TableName("Bancos.CatalogoCuentasBancosSucursales")]
    [ExplicitColumns]
    [PrimaryKey("CuentaBancoID,ProductoID,SucursalID", AutoIncrement=false)]
    public class CatalogoCuentasBancosSucursales
    {
              
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }
      
        
        [Column("SucursalID")]
        public int SucursalID { get; set; }
      
        
        [Column("CuentaBancoID")]
        public int CuentaBancoID { get; set; }
      
        
        [Column("Activo")]
        public bool? Activo { get; set; }
      
        
        [Column("RegistraPersonaId")]
        public int? RegistraPersonaId { get; set; }
      
        
        [Column("RegistraUsuarioId")]
        public int? RegistraUsuarioId { get; set; }
      
        
        [Column("RegistraFecha")]
        public DateTime? RegistraFecha { get; set; }
      
        
        [Column("ActualizaPersonaId")]
        public int? ActualizaPersonaId { get; set; }
      
        
        [Column("ActualizaUsuarioId")]
        public int? ActualizaUsuarioId { get; set; }
      
        
        [Column("ActualizaFecha")]
        public DateTime? ActualizaFecha { get; set; }


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

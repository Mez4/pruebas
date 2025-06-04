using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Seguridad
{
    [TableName("Seguridad.UsuariosPromotores_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class UsuariosPromotores_VW
    {
              
        
        [Column("UUID")]
        public string UUID { get; set; }
      
        
        [Column("AccesoAppPromotor")]
        public bool? AccesoAppPromotor { get; set; }
      
        
        [Column("UsuarioID")]
        public int UsuarioID { get; set; }
      
        
        [Column("Contrasena")]
        public string Contrasena { get; set; }
      
        
        [Column("CorreoElectronico")]
        public string CorreoElectronico { get; set; }
      
        
        [Column("Bloqueado")]
        public bool Bloqueado { get; set; }
      
        
        [Column("BloqueadoPermanente")]
        public bool BloqueadoPermanente { get; set; }
      
        
        [Column("PersonaPersonaID")]
        public Int64 PersonaPersonaID { get; set; }
      
        
        [Column("NombreCompleto")]
        public string NombreCompleto { get; set; }
      
        
        [Column("PersonaTelefonoMovil")]
        public string PersonaTelefonoMovil { get; set; }
      
        
        [Column("usuario_empresaId")]
        public int? usuario_empresaId { get; set; }
      
        
        [Column("creditoPromotorId")]
        public Int64 creditoPromotorId { get; set; }
      
        
        [Column("SucursalIDPromotor")]
        public int SucursalIDPromotor { get; set; }
      
        
        [Column("ProductoIDPromotor")]
        public int ProductoIDPromotor { get; set; }
      
        
        [Column("PromotorActivo")]
        public bool PromotorActivo { get; set; }


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

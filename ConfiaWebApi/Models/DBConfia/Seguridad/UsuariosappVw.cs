using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Seguridad
{
    [TableName("Seguridad.UsuariosApp_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class UsuariosApp_VW
    {
              
        
        [Column("GestorCobranzaID")]
        public Int64? GestorCobranzaID { get; set; }
      
        
        [Column("UUID")]
        public string UUID { get; set; }
      
        
        [Column("AccesoAppValesPS")]
        public bool? AccesoAppValesPS { get; set; }
      
        
        [Column("AccesoAppCobranzaPS")]
        public bool? AccesoAppCobranzaPS { get; set; }
      
        
        [Column("DistribuidorID")]
        public Int64? DistribuidorID { get; set; }
      
        
        [Column("DistribuidorValidado")]
        public int DistribuidorValidado { get; set; }
      
        
        [Column("AccesoAppVales")]
        public bool? AccesoAppVales { get; set; }
      
        
        [Column("AccesoAppCobranza")]
        public bool? AccesoAppCobranza { get; set; }
      
        
        [Column("empresaId")]
        public int? empresaId { get; set; }
      
        
        [Column("empresaNombre")]
        public string empresaNombre { get; set; }
      
        
        [Column("Producto")]
        public string Producto { get; set; }
      
        
        [Column("ProductoID")]
        public int? ProductoID { get; set; }
      
        
        [Column("GrupoID")]
        public int? GrupoID { get; set; }
      
        
        [Column("CambioNIP")]
        public bool? CambioNIP { get; set; }
      
        
        [Column("SociaNIP")]
        public string SociaNIP { get; set; }
      
        
        [Column("UsuarioID")]
        public int UsuarioID { get; set; }
      
        
        [Column("Usuario")]
        public string Usuario { get; set; }
      
        
        [Column("Nombre")]
        public string Nombre { get; set; }
      
        
        [Column("NombreCompleto")]
        public string NombreCompleto { get; set; }
      
        
        [Column("Correo")]
        public string Correo { get; set; }
      
        
        [Column("Contrasena")]
        public string Contrasena { get; set; }
      
        
        [Column("CorreoElectronico")]
        public string CorreoElectronico { get; set; }
      
        
        [Column("Validacion")]
        public bool Validacion { get; set; }
      
        
        [Column("Bloqueado")]
        public bool Bloqueado { get; set; }
      
        
        [Column("Acceso")]
        public bool? Acceso { get; set; }
      
        
        [Column("BloqueadoPermanente")]
        public bool BloqueadoPermanente { get; set; }
      
        
        [Column("MasterUser")]
        public bool MasterUser { get; set; }
      
        
        [Column("SupportUser")]
        public bool SupportUser { get; set; }
      
        
        [Column("SystemUser")]
        public bool SystemUser { get; set; }
      
        
        [Column("PersonaID")]
        public Int64? PersonaID { get; set; }
      
        
        [Column("PersonaPersonaID")]
        public Int64? PersonaPersonaID { get; set; }
      
        
        [Column("PersonaNombre")]
        public string PersonaNombre { get; set; }
      
        
        [Column("PersonaApellidoPaterno")]
        public string PersonaApellidoPaterno { get; set; }
      
        
        [Column("PersonaApellidoMaterno")]
        public string PersonaApellidoMaterno { get; set; }
      
        
        [Column("PersonaTelefonoMovil")]
        public string PersonaTelefonoMovil { get; set; }
      
        
        [Column("ContratantePagos")]
        public int? ContratantePagos { get; set; }
      
        
        [Column("MasterPagos")]
        public bool? MasterPagos { get; set; }
      
        
        [Column("usuario_empresaId")]
        public int? usuario_empresaId { get; set; }
      
        
        [Column("usuario_empresaNombre")]
        public string usuario_empresaNombre { get; set; }
      
        
        [Column("usuario_empresaPrefijoApp")]
        public string usuario_empresaPrefijoApp { get; set; }
      
        
        [Column("creditoPromotorId")]
        public Int64 creditoPromotorId { get; set; }
      
        
        [Column("SucursalIDPromotor")]
        public int SucursalIDPromotor { get; set; }
      
        
        [Column("Sucursal")]
        public string Sucursal { get; set; }
      
        
        [Column("ProductoIDPromotor")]
        public int? ProductoIDPromotor { get; set; }
      
        
        [Column("CambiarContrasena")]
        public bool CambiarContrasena { get; set; }
      
        
        [Column("AccesoAppPromotoria")]
        public bool? AccesoAppPromotoria { get; set; }


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

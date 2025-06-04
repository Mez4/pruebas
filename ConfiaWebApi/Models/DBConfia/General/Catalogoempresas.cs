using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.General
{
    [TableName("General.CatalogoEmpresas")]
    [ExplicitColumns]
    [PrimaryKey("CatEmpresaID")]
    public class CatalogoEmpresas
    {
              
        
        [Column("CatEmpresaID")]
        public int CatEmpresaID { get; set; }
      
        
        [Column("NombreEmpresa")]
        public string NombreEmpresa { get; set; }
      
        
        [Column("FechaRegistro")]
        public DateTime FechaRegistro { get; set; }
      
        
        [Column("PersonaRegistraID")]
        public Int64 PersonaRegistraID { get; set; }
      
        
        [Column("UsuarioRegistraID")]
        public int UsuarioRegistraID { get; set; }
      
        
        [Column("FechaModifica")]
        public DateTime? FechaModifica { get; set; }
      
        
        [Column("PersonaModificaID")]
        public Int64? PersonaModificaID { get; set; }
      
        
        [Column("UsuarioModificaID")]
        public int? UsuarioModificaID { get; set; }


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

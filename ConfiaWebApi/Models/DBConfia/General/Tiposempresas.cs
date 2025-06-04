using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.General
{
    [TableName("General.TiposEmpresas")]
    [ExplicitColumns]
    [PrimaryKey("TipoEmpresaID")]
    public class TiposEmpresas
    {
              
        
        [Column("TipoEmpresaID")]
        public int TipoEmpresaID { get; set; }
      
        
        [Column("TipoEmpresa")]
        public string TipoEmpresa { get; set; }
      
        
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
      
        
        [Column("Color1")]
        public string Color1 { get; set; }
      
        
        [Column("Color2")]
        public string Color2 { get; set; }
      
        
        [Column("Color3")]
        public string Color3 { get; set; }
      
        
        [Column("Color4")]
        public string Color4 { get; set; }


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

using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Creditos
{
    [TableName("Creditos.MotivosCancelacion")]
    [ExplicitColumns]
    [PrimaryKey("MotivoCancelacionID")]
    public class MotivosCancelacion
    {
              
        
        [Column("MotivoCancelacionID")]
        public int MotivoCancelacionID { get; set; }
      
        
        [Column("MotivoCancelacion")]
        public string MotivoCancelacion { get; set; }
      
        
        [Column("genMovBanco")]
        public bool genMovBanco { get; set; }
      
        
        [Column("UsuarioRegistro")]
        public int? UsuarioRegistro { get; set; }
      
        
        [Column("UsuarioModifico")]
        public int? UsuarioModifico { get; set; }


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

using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Creditos
{
    [TableName("Creditos.Protecciones")]
    [ExplicitColumns]
    [PrimaryKey("ProteccionID")]
    public class Protecciones
    {
              
        
        [Column("ProteccionID")]
        public Int64 ProteccionID { get; set; }
      
        
        [Column("Minimo")]
        public decimal Minimo { get; set; }
      
        
        [Column("Maximo")]
        public decimal Maximo { get; set; }
      
        
        [Column("Monto")]
        public decimal? Monto { get; set; }
      
        
        [Column("DistribuidorNivelID")]
        public int DistribuidorNivelID { get; set; }
      
        
        [Column("OrigenNivelID")]
        public int OrigenNivelID { get; set; }
      
        
        [Column("UsuarioCaptura")]
        public int UsuarioCaptura { get; set; }
      
        
        [Column("UsuarioModifica")]
        public int? UsuarioModifica { get; set; }


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

using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Aclaraciones
{
    [TableName("Aclaraciones.MesaAclaracion")]
    [ExplicitColumns]
    [PrimaryKey("MesaAclaracionID")]
    public class MesaAclaracion
    {
              
        
        [Column("MesaAclaracionID")]
        public int MesaAclaracionID { get; set; }
      
        
        [Column("NombreMesaAclaracion")]
        public string NombreMesaAclaracion { get; set; }
      
        
        [Column("Clave")]
        public string Clave { get; set; }
      
        
        [Column("Activo")]
        public bool? Activo { get; set; }


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

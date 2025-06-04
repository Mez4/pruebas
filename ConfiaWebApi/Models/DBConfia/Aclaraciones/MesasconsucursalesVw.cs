using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Aclaraciones
{
    [TableName("Aclaraciones.MesasConSucursales_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class MesasConSucursales_VW
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

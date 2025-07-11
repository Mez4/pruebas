using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Tesoreria
{
    [TableName("Tesoreria.RubrosGastos_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class RubrosGastos_VW
    {
              
        
        [Column("Nombre")]
        public string Nombre { get; set; }
      
        
        [Column("RubroGastosID")]
        public int RubroGastosID { get; set; }
      
        
        [Column("Clave")]
        public string Clave { get; set; }
      
        
        [Column("Descripcion")]
        public string Descripcion { get; set; }
      
        
        [Column("Activo")]
        public bool Activo { get; set; }
      
        
        [Column("RegistraID")]
        public int RegistraID { get; set; }
      
        
        [Column("AfectaUtilidad")]
        public bool AfectaUtilidad { get; set; }
      
        
        [Column("GastoCorporativo")]
        public bool GastoCorporativo { get; set; }
      
        
        [Column("Cargo")]
        public bool Cargo { get; set; }
      
        
        [Column("Factor")]
        public int Factor { get; set; }


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

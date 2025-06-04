using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.General
{
    [TableName("General.EstatusBuroInterno")]
    [ExplicitColumns]
    [PrimaryKey("Tipo", AutoIncrement=false)]
    public class EstatusBuroInterno
    {
              
        
        [Column("Tipo")]
        public string Tipo { get; set; }
      
        
        [Column("Descri")]
        public string Descri { get; set; }
      
        
        [Column("Mostrar_en_Buro")]
        public bool Mostrar_en_Buro { get; set; }


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

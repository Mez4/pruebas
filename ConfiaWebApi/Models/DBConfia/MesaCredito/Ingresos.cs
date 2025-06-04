using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.MesaCredito
{
    [TableName("MesaCredito.Ingresos")]
    [ExplicitColumns]
    // No primary key detected
    public class Ingresos
    {
              
        
        [Column("id")]
        public int id { get; set; }
      
        
        [Column("idPersona")]
        public int idPersona { get; set; }
      
        
        [Column("idTipoPersona")]
        public int idTipoPersona { get; set; }
      
        
        [Column("ingresoSueldo")]
        public float ingresoSueldo { get; set; }
      
        
        [Column("gananciasDV")]
        public float gananciasDV { get; set; }
      
        
        [Column("ingresoConyuge")]
        public float ingresoConyuge { get; set; }
      
        
        [Column("otrosIngresos")]
        public float otrosIngresos { get; set; }
      
        
        [Column("ingresoTotal")]
        public float ingresoTotal { get; set; }


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

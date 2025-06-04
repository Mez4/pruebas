using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Prospectos
{
    [TableName("Prospectos.Ingresos")]
    [ExplicitColumns]
    [PrimaryKey("id")]
    public class Ingresos
    {
              
        
        [Column("id")]
        public int id { get; set; }
      
        
        [Column("idPersona")]
        public int idPersona { get; set; }
      
        
        [Column("idMesaCredito")]
        public int idMesaCredito { get; set; }
      
        
        [Column("idTipoPersona")]
        public int idTipoPersona { get; set; }
      
        
        [Column("ingresoSueldo")]
        public decimal ingresoSueldo { get; set; }
      
        
        [Column("gananciasDV")]
        public decimal gananciasDV { get; set; }
      
        
        [Column("ingresoConyuge")]
        public decimal ingresoConyuge { get; set; }
      
        
        [Column("otrosIngresos")]
        public decimal otrosIngresos { get; set; }
      
        
        [Column("ingresoTotal")]
        public decimal ingresoTotal { get; set; }


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

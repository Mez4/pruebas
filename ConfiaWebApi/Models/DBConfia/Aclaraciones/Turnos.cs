using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Aclaraciones
{
    [TableName("Aclaraciones.Turnos")]
    [ExplicitColumns]
    [PrimaryKey("IdTurnos")]
    public class Turnos
    {
              
        
        [Column("IdTurnos")]
        public int IdTurnos { get; set; }
      
        
        [Column("Turno")]
        public string Turno { get; set; }
      
        
        [Column("HoraEntrada")]
        public string HoraEntrada { get; set; }
      
        
        [Column("HoraSalida")]
        public string HoraSalida { get; set; }


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

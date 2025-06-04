using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Creditos
{
    [TableName("Creditos.TasasTipos")]
    [ExplicitColumns]
    [PrimaryKey("TasaTipoId", AutoIncrement=false)]
    public class TasasTipos
    {
              
        
        [Column("TasaTipoId")]
        public string TasaTipoId { get; set; }
      
        
        [Column("TasaTipo")]
        public string TasaTipo { get; set; }
      
        
        [Column("capitalizacionesPorMes")]
        public int capitalizacionesPorMes { get; set; }
      
        
        [Column("capitalizacionesPorAnio")]
        public int capitalizacionesPorAnio { get; set; }
      
        
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

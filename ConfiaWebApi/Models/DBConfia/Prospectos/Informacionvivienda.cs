using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Prospectos
{
    [TableName("Prospectos.InformacionVivienda")]
    [ExplicitColumns]
    [PrimaryKey("id")]
    public class InformacionVivienda
    {
              
        
        [Column("id")]
        public int id { get; set; }
      
        
        [Column("idPersona")]
        public int idPersona { get; set; }
      
        
        [Column("idMesaCredito")]
        public int idMesaCredito { get; set; }
      
        
        [Column("idTipoPersona")]
        public int idTipoPersona { get; set; }
      
        
        [Column("idTipoVivienda")]
        public int idTipoVivienda { get; set; }
      
        
        [Column("tieneOtraVivienda")]
        public string tieneOtraVivienda { get; set; }
      
        
        [Column("numeroPersonasHabitan")]
        public string numeroPersonasHabitan { get; set; }
      
        
        [Column("valorAproximado")]
        public decimal valorAproximado { get; set; }


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

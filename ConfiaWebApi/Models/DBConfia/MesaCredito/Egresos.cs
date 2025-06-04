using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.MesaCredito
{
    [TableName("MesaCredito.Egresos")]
    [ExplicitColumns]
    [PrimaryKey("id")]
    public class Egresos
    {
              
        
        [Column("id")]
        public int id { get; set; }
      
        
        [Column("idPersona")]
        public int idPersona { get; set; }
      
        
        [Column("idTipoPersona")]
        public int idTipoPersona { get; set; }
      
        
        [Column("egresos")]
        public decimal egresos { get; set; }
      
        
        [Column("alimentacion")]
        public decimal alimentacion { get; set; }
      
        
        [Column("tarjetaCreido")]
        public decimal tarjetaCreido { get; set; }
      
        
        [Column("rentaPagoVivienda")]
        public decimal rentaPagoVivienda { get; set; }
      
        
        [Column("serviciosDomesticos")]
        public decimal serviciosDomesticos { get; set; }
      
        
        [Column("otros")]
        public decimal otros { get; set; }
      
        
        [Column("egresoTotal")]
        public decimal egresoTotal { get; set; }


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

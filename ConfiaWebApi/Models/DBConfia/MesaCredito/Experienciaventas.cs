using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.MesaCredito
{
    [TableName("MesaCredito.ExperienciaVentas")]
    [ExplicitColumns]
    [PrimaryKey("id")]
    public class ExperienciaVentas
    {
              
        
        [Column("id")]
        public int id { get; set; }
      
        
        [Column("idPersona")]
        public int idPersona { get; set; }
      
        
        [Column("idTipoPersona")]
        public int idTipoPersona { get; set; }
      
        
        [Column("nombreEmpresa")]
        public string nombreEmpresa { get; set; }
      
        
        [Column("fechaIngreso")]
        public DateTime fechaIngreso { get; set; }
      
        
        [Column("limiteCredito")]
        public decimal limiteCredito { get; set; }
      
        
        [Column("creditoDisponible")]
        public decimal creditoDisponible { get; set; }
      
        
        [Column("status")]
        public string status { get; set; }


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

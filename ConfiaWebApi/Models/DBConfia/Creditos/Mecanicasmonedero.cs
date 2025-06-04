using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Creditos
{
    [TableName("Creditos.MecanicasMonedero")]
    [ExplicitColumns]
    [PrimaryKey("MecanicaID")]
    public class MecanicasMonedero
    {
              
        
        [Column("MecanicaID")]
        public int MecanicaID { get; set; }
      
        
        [Column("Descripcion")]
        public string Descripcion { get; set; }
      
        
        [Column("MontoBase")]
        public decimal? MontoBase { get; set; }
      
        
        [Column("MontoRecompensa")]
        public decimal? MontoRecompensa { get; set; }
      
        
        [Column("FechaInicio")]
        public DateTime? FechaInicio { get; set; }
      
        
        [Column("FechaFin")]
        public DateTime? FechaFin { get; set; }
      
        
        [Column("UsuarioIDRegistro")]
        public int? UsuarioIDRegistro { get; set; }
      
        
        [Column("FechaRegistro")]
        public DateTime? FechaRegistro { get; set; }
      
        
        [Column("UsuarioModificacion")]
        public int? UsuarioModificacion { get; set; }
      
        
        [Column("FechaModificacion")]
        public DateTime? FechaModificacion { get; set; }


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

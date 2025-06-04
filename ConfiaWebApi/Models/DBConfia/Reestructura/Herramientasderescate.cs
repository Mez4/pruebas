using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Reestructura
{
    [TableName("Reestructura.HerramientasDeRescate")]
    [ExplicitColumns]
    [PrimaryKey("HDRID")]
    public class HerramientasDeRescate
    {
              
        
        [Column("HDRID")]
        public int HDRID { get; set; }
      
        
        [Column("MontoIntencion")]
        public decimal MontoIntencion { get; set; }
      
        
        [Column("ComentariosSolicitud")]
        public string ComentariosSolicitud { get; set; }
      
        
        [Column("ComentariosCancelacion")]
        public string ComentariosCancelacion { get; set; }
      
        
        [Column("CanceladoBit")]
        public bool? CanceladoBit { get; set; }
      
        
        [Column("SaldoActual")]
        public decimal SaldoActual { get; set; }
      
        
        [Column("SaldoAtrasado")]
        public decimal SaldoAtrasado { get; set; }
      
        
        [Column("Plazos")]
        public int Plazos { get; set; }
      
        
        [Column("FechaRegistro")]
        public DateTime FechaRegistro { get; set; }
      
        
        [Column("UsuarioRegistra")]
        public int UsuarioRegistra { get; set; }
      
        
        [Column("PersonaRegistra")]
        public Int64 PersonaRegistra { get; set; }
      
        
        [Column("DistribuidorID")]
        public Int64 DistribuidorID { get; set; }
      
        
        [Column("TipoHerramientaID")]
        public int TipoHerramientaID { get; set; }


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

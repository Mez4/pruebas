using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.General
{
    [TableName("General.BitacoraCambios")]
    [ExplicitColumns]
    [PrimaryKey("BitacoraID")]
    public class BitacoraCambios
    {
              
        
        [Column("BitacoraID")]
        public Int64 BitacoraID { get; set; }
      
        
        [Column("FechaAfectacion")]
        public DateTime? FechaAfectacion { get; set; }
      
        
        [Column("Accion")]
        public string Accion { get; set; }
      
        
        [Column("PersonaID")]
        public Int64 PersonaID { get; set; }
      
        
        [Column("Modulo")]
        public string Modulo { get; set; }
      
        
        [Column("Dato")]
        public string Dato { get; set; }
      
        
        [Column("DatoAnt")]
        public string DatoAnt { get; set; }
      
        
        [Column("DatoNvo")]
        public string DatoNvo { get; set; }


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

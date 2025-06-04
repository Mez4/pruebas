using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Tesoreria
{
    [TableName("Tesoreria.ContratosHist")]
    [ExplicitColumns]
    [PrimaryKey("IdContrato", AutoIncrement=false)]
    public class ContratosHist
    {
              
        
        [Column("IdSucursal")]
        public int IdSucursal { get; set; }
      
        
        [Column("IdContrato")]
        public int IdContrato { get; set; }
      
        
        [Column("ContDesc")]
        public string ContDesc { get; set; }
      
        
        [Column("CostoRenta")]
        public decimal? CostoRenta { get; set; }
      
        
        [Column("FechaIniCont")]
        public DateTime? FechaIniCont { get; set; }
      
        
        [Column("FechaFinCont")]
        public DateTime? FechaFinCont { get; set; }
      
        
        [Column("FechaCarga")]
        public DateTime? FechaCarga { get; set; }
      
        
        [Column("DOcCont")]
        public string DOcCont { get; set; }
      
        
        [Column("NombreSuc")]
        public string NombreSuc { get; set; }


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

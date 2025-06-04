using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Tesoreria
{
    [TableName("Tesoreria.ArchivoDispersion")]
    [ExplicitColumns]
    [PrimaryKey("ArchivoDispersionID")]
    public class ArchivoDispersion
    {
              
        
        [Column("ArchivoDispersionID")]
        public int ArchivoDispersionID { get; set; }
      
        
        [Column("FechaRegistro")]
        public DateTime FechaRegistro { get; set; }
      
        
        [Column("ConsecutivoDia")]
        public int ConsecutivoDia { get; set; }
      
        
        [Column("TotalDispersion")]
        public decimal TotalDispersion { get; set; }
      
        
        [Column("CantidadMovimientos")]
        public int CantidadMovimientos { get; set; }
      
        
        [Column("EstatusArchivoID")]
        public int EstatusArchivoID { get; set; }
      
        
        [Column("CatConciliacionID")]
        public int CatConciliacionID { get; set; }
      
        
        [Column("CreditoID")]
        public Int64 CreditoID { get; set; }
      
        
        [Column("ReasignadoID")]
        public int? ReasignadoID { get; set; }


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

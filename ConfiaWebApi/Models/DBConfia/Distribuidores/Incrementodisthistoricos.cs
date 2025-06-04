using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Distribuidores
{
    [TableName("Distribuidores.IncrementoDistHistoricos")]
    [ExplicitColumns]
    [PrimaryKey("Id")]
    public class IncrementoDistHistoricos
    {
              
        
        [Column("Id")]
        public Int64 Id { get; set; }
      
        
        [Column("ContratoID")]
        public Int64? ContratoID { get; set; }
      
        
        [Column("ProductoID")]
        public int? ProductoID { get; set; }
      
        
        [Column("DistribuidorID")]
        public Int64? DistribuidorID { get; set; }
      
        
        [Column("FechaInc")]
        public DateTime? FechaInc { get; set; }
      
        
        [Column("LineaCreditoAnt")]
        public decimal? LineaCreditoAnt { get; set; }
      
        
        [Column("MontoInc")]
        public decimal? MontoInc { get; set; }
      
        
        [Column("LineaCreditoNueva")]
        public decimal? LineaCreditoNueva { get; set; }
      
        
        [Column("UsuarioID")]
        public int? UsuarioID { get; set; }
      
        
        [Column("FechaRegistro")]
        public DateTime? FechaRegistro { get; set; }


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

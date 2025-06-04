using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Indicadores
{
    [TableName("Indicadores.Historicos_Socias_Detalle")]
    [ExplicitColumns]
    [PrimaryKey("DistribuidorID,Fecha,ProductoID,SucursalID", AutoIncrement=false)]
    public class Historicos_Socias_Detalle
    {
              
        
        [Column("Fecha")]
        public DateTime Fecha { get; set; }
      
        
        [Column("DistribuidorID")]
        public Int64 DistribuidorID { get; set; }
      
        
        [Column("SucursalID")]
        public int SucursalID { get; set; }
      
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }
      
        
        [Column("Limite")]
        public decimal? Limite { get; set; }
      
        
        [Column("Disponible")]
        public decimal? Disponible { get; set; }
      
        
        [Column("Saldo")]
        public decimal? Saldo { get; set; }
      
        
        [Column("Vencido")]
        public decimal? Vencido { get; set; }
      
        
        [Column("Cobranza")]
        public decimal? Cobranza { get; set; }
      
        
        [Column("Comision")]
        public decimal? Comision { get; set; }
      
        [ComputedColumn(ComputedColumnType.Always)]
        [Column("Pendiente")]
        public decimal? Pendiente { get; set; }
      
        
        [Column("Reestructura")]
        public decimal? Reestructura { get; set; }
      
        
        [Column("Convenio")]
        public decimal? Convenio { get; set; }
      
        
        [Column("Colocacion")]
        public decimal? Colocacion { get; set; }


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

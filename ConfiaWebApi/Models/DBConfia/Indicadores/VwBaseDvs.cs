using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Indicadores
{
    [TableName("Indicadores.VW_Base_DVs")]
    [ExplicitColumns]
    // View, no primary key needed
    public class VW_Base_DVs
    {
              
        
        [Column("Fecha")]
        public DateTime Fecha { get; set; }
      
        
        [Column("DistribuidorID")]
        public Int64 DistribuidorID { get; set; }
      
        
        [Column("SucursalID")]
        public int SucursalID { get; set; }
      
        
        [Column("GrupoID")]
        public int GrupoID { get; set; }
      
        
        [Column("CoordinadorID")]
        public Int64 CoordinadorID { get; set; }
      
        
        [Column("DiasAtraso")]
        public int? DiasAtraso { get; set; }
      
        
        [Column("DiasAtrasoCierre")]
        public int? DiasAtrasoCierre { get; set; }
      
        
        [Column("TipoPago")]
        public string TipoPago { get; set; }
      
        
        [Column("TipoPago1")]
        public string TipoPago1 { get; set; }
      
        
        [Column("DistribuidoresEstatusID")]
        public string DistribuidoresEstatusID { get; set; }
      
        
        [Column("DistAntSistema")]
        public string DistAntSistema { get; set; }
      
        
        [Column("DistAntNumero")]
        public int? DistAntNumero { get; set; }
      
        
        [Column("DistAntSistema2")]
        public string DistAntSistema2 { get; set; }
      
        
        [Column("DistAntNumero2")]
        public int? DistAntNumero2 { get; set; }


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

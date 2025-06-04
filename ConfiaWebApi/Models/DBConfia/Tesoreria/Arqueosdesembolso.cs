using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Tesoreria
{
    [TableName("Tesoreria.ArqueosDesembolso")]
    [ExplicitColumns]
    [PrimaryKey("ArqueosDesembolsoID")]
    public class ArqueosDesembolso
    {
              
        
        [Column("ArqueosDesembolsoID")]
        public int ArqueosDesembolsoID { get; set; }
      
        
        [Column("SucursalID")]
        public int SucursalID { get; set; }
      
        
        [Column("ValesCapturados")]
        public int ValesCapturados { get; set; }
      
        
        [Column("ValesDesembolsados")]
        public int ValesDesembolsados { get; set; }
      
        
        [Column("DiferenciaVales")]
        public int DiferenciaVales { get; set; }
      
        
        [Column("FechaReporte")]
        public DateTime FechaReporte { get; set; }
      
        
        [Column("ImporteDesembolsado")]
        public decimal ImporteDesembolsado { get; set; }
      
        
        [Column("ImporteDesembolsadoSistema")]
        public decimal ImporteDesembolsadoSistema { get; set; }
      
        
        [Column("DiferenciaImporte")]
        public decimal DiferenciaImporte { get; set; }
      
        
        [Column("Observaciones")]
        public string Observaciones { get; set; }
      
        
        [Column("UsuarioRegistraID")]
        public int UsuarioRegistraID { get; set; }
      
        
        [Column("PersonaRegistraID")]
        public Int64 PersonaRegistraID { get; set; }
      
        
        [Column("FechaRegistra")]
        public DateTime FechaRegistra { get; set; }
      
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }

        [Column("Cancelado")]
        public bool Cancelado { get; set; }


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

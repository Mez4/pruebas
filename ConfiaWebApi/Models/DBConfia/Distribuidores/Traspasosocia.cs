using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Distribuidores
{
    [TableName("Distribuidores.TraspasoSocia")]
    [ExplicitColumns]
    [PrimaryKey("TraspasoSociaID")]
    public class TraspasoSocia
    {
              
        
        [Column("TraspasoSociaID")]
        public int TraspasoSociaID { get; set; }
      
        
        [Column("Colocado")]
        public decimal Colocado { get; set; }
      
        
        [Column("Distribuidoras")]
        public int Distribuidoras { get; set; }
      
        
        [Column("CoordinadorID_emisor")]
        public Int64 CoordinadorID_emisor { get; set; }
      
        
        [Column("SucursalID_emisor")]
        public int? SucursalID_emisor { get; set; }
      
        
        [Column("CoordinadorID_receptor")]
        public Int64 CoordinadorID_receptor { get; set; }
      
        
        [Column("SucursalID_receptor")]
        public int SucursalID_receptor { get; set; }
      
        
        [Column("Fecha_registro")]
        public DateTime Fecha_registro { get; set; }
      
        
        [Column("UsuarioCreador")]
        public int UsuarioCreador { get; set; }
      
        
        [Column("tipoTraspasoID")]
        public int? tipoTraspasoID { get; set; }
      
        
        [Column("observaciones")]
        public string observaciones { get; set; }


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

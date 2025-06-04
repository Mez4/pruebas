using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Cobranza
{
    [TableName("Cobranza.ConvenioDetalle")]
    [ExplicitColumns]
    [PrimaryKey("ConvenioID,NoPago", AutoIncrement=false)]
    public class ConvenioDetalle
    {
              
        
        [Column("ConvenioID")]
        public Int64 ConvenioID { get; set; }
      
        
        [Column("NoPago")]
        public int NoPago { get; set; }
      
        
        [Column("FechaVencimiento")]
        public DateTime FechaVencimiento { get; set; }
      
        
        [Column("Importe")]
        public decimal Importe { get; set; }
      
        
        [Column("Saldo_Dep")]
        public decimal Saldo_Dep { get; set; }
      
        [ComputedColumn(ComputedColumnType.Always)]
        [Column("DiasAtraso")]
        public int? DiasAtraso { get; set; }
      
        [ComputedColumn(ComputedColumnType.Always)]
        [Column("Saldo_Plazo")]
        public decimal? Saldo_Plazo { get; set; }
      
        
        [Column("UsuarioID")]
        public int? UsuarioID { get; set; }
      
        
        [Column("FechaRegistro")]
        public DateTime? FechaRegistro { get; set; }
      
        
        [Column("UsuarioDeposito")]
        public int? UsuarioDeposito { get; set; }
      
        
        [Column("FechaDeposito")]
        public DateTime? FechaDeposito { get; set; }


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

using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Bancos
{
    [TableName("Bancos.CatalogoTipoBanco")]
    [ExplicitColumns]
    [PrimaryKey("TipoBancoId")]
    public class CatalogoTipoBanco
    {
              
        
        [Column("TipoBancoId")]
        public int TipoBancoId { get; set; }
      
        [ComputedColumn(ComputedColumnType.Always)]
        [Column("Clave")]
        public string Clave { get; set; }
      
        
        [Column("Descripcion")]
        public string Descripcion { get; set; }


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

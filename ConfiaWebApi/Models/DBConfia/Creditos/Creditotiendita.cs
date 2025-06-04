using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Creditos
{
    [TableName("Creditos.CreditoTiendita")]
    [ExplicitColumns]
    [PrimaryKey("CreditoTienditaID")]
    public class CreditoTiendita
    {
              
        
        [Column("CreditoTienditaID")]
        public Int64 CreditoTienditaID { get; set; }
      
        
        [Column("CreditoID")]
        public Int64 CreditoID { get; set; }
      
        
        [Column("SKU")]
        public string SKU { get; set; }
      
        
        [Column("Unidades")]
        public int Unidades { get; set; }
      
        
        [Column("PrecioUnitario")]
        public decimal PrecioUnitario { get; set; }
      
        
        [Column("Descripcion")]
        public string Descripcion { get; set; }
      
        
        [Column("FechaRegistra")]
        public DateTime? FechaRegistra { get; set; }
      
        
        [Column("UsuarioRegistra")]
        public int? UsuarioRegistra { get; set; }
      
        
        [Column("PersonaRegistra")]
        public Int64? PersonaRegistra { get; set; }
      
        [ComputedColumn(ComputedColumnType.Always)]
        [Column("ImporteTotal")]
        public decimal? ImporteTotal { get; set; }
      
        
        [Column("EstructuraID")]
        public int? EstructuraID { get; set; }

        [Column("CodigoSKU")]
        public string? CodigoSKU { get; set; }


        [Column("PrecioOriginal")]
        public decimal? PrecioOriginal { get; set; }


        [Column("PrecioDescuento")]
        public decimal? PrecioDescuento { get; set; }


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

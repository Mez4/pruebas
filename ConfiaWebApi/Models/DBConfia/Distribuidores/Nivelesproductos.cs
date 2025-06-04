using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Distribuidores
{
    [TableName("Distribuidores.NivelesProductos")]
    [ExplicitColumns]
    [PrimaryKey("DistribuidorNivelID,ProductoID", AutoIncrement=false)]
    public class NivelesProductos
    {
              
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }
      
        
        [Column("DistribuidorNivelID")]
        public int DistribuidorNivelID { get; set; }
      
        
        [Column("PorcComisionBase")]
        public decimal PorcComisionBase { get; set; }
      
        
        [Column("CapitalColocadoMinimo")]
        public decimal CapitalColocadoMinimo { get; set; }
      
        
        [Column("CapitalColocadoMaximo")]
        public decimal CapitalColocadoMaximo { get; set; }
      
        
        [Column("ImporteProteccionSaldo")]
        public decimal ImporteProteccionSaldo { get; set; }
      
        
        [Column("importeMaxCanje")]
        public decimal importeMaxCanje { get; set; }
      
        
        [Column("maximoPrestamoPersonal")]
        public decimal maximoPrestamoPersonal { get; set; }
      
        
        [Column("maximoImporteCanjeCliente")]
        public decimal maximoImporteCanjeCliente { get; set; }
      
        
        [Column("maximoImporteCanjeAval")]
        public decimal maximoImporteCanjeAval { get; set; }
      
        
        [Column("monto")]
        public decimal monto { get; set; }
      
        
        [Column("IncrementoQuincena")]
        public decimal IncrementoQuincena { get; set; }
      
        
        [Column("IncrementoQuincenaCalidadBaja")]
        public decimal IncrementoQuincenaCalidadBaja { get; set; }


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

using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Bancos
{
    [TableName("Bancos.CatalogoConvenios")]
    [ExplicitColumns]
    [PrimaryKey("BancoID,convenio,ConvenioID,ProductoID", AutoIncrement=false)]
    public class CatalogoConvenios
    {
              
        
        [Column("ConvenioID")]
        public int ConvenioID { get; set; }
      
        
        [Column("descripcion")]
        public string descripcion { get; set; }
      
        
        [Column("ProductoID")]
        public Int64 ProductoID { get; set; }
      
        
        [Column("convenio")]
        public string convenio { get; set; }
      
        
        [Column("fhRegistro")]
        public DateTime fhRegistro { get; set; }
      
        
        [Column("nombreComercialEmpresa")]
        public string nombreComercialEmpresa { get; set; }
      
        
        [Column("cuentaBancaria")]
        public string cuentaBancaria { get; set; }
      
        
        [Column("activo")]
        public bool activo { get; set; }
      
        
        [Column("BancoID")]
        public int BancoID { get; set; }


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

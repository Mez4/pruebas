using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.STP
{
    [TableName("STP.ConciliacionV2Detalle")]
    [ExplicitColumns]
    [PrimaryKey("ConciliacionDetalleID")]
    public class ConciliacionV2Detalle
    {
              
        
        [Column("ConciliacionDetalleID")]
        public int ConciliacionDetalleID { get; set; }
      
        
        [Column("ConciliacionID")]
        public int ConciliacionID { get; set; }
      
        
        [Column("idEF")]
        public int idEF { get; set; }
      
        
        [Column("claveRastreo")]
        public string claveRastreo { get; set; }
      
        
        [Column("claveRastreoDevolucion")]
        public string claveRastreoDevolucion { get; set; }
      
        
        [Column("conceptoPago")]
        public string conceptoPago { get; set; }
      
        
        [Column("cuentaBeneficiario")]
        public string cuentaBeneficiario { get; set; }
      
        
        [Column("cuentaOrdenante")]
        public string cuentaOrdenante { get; set; }
      
        
        [Column("empresa")]
        public string empresa { get; set; }
      
        
        [Column("estado")]
        public string estado { get; set; }
      
        
        [Column("fechaOperacion")]
        public string fechaOperacion { get; set; }
      
        
        [Column("institucionContraparte")]
        public string institucionContraparte { get; set; }
      
        
        [Column("institucionOperante")]
        public string institucionOperante { get; set; }
      
        
        [Column("medioEntrega")]
        public string medioEntrega { get; set; }
      
        
        [Column("monto")]
        public string monto { get; set; }
      
        
        [Column("nombreBeneficiario")]
        public string nombreBeneficiario { get; set; }
      
        
        [Column("nombreOrdenante")]
        public string nombreOrdenante { get; set; }
      
        
        [Column("nombreCep")]
        public string nombreCep { get; set; }
      
        
        [Column("rfcCep")]
        public string rfcCep { get; set; }
      
        
        [Column("sello")]
        public string sello { get; set; }
      
        
        [Column("rfcCurpBeneficiario")]
        public string rfcCurpBeneficiario { get; set; }
      
        
        [Column("referenciaNumerica")]
        public string referenciaNumerica { get; set; }
      
        
        [Column("rfcCurpOrdenante")]
        public string rfcCurpOrdenante { get; set; }
      
        
        [Column("tipoCuentaBeneficiario")]
        public string tipoCuentaBeneficiario { get; set; }
      
        
        [Column("tipoCuentaOrdenante")]
        public string tipoCuentaOrdenante { get; set; }
      
        
        [Column("tsCaptura")]
        public string tsCaptura { get; set; }
      
        
        [Column("tsLiquidacion")]
        public string tsLiquidacion { get; set; }
      
        
        [Column("causaDevolucion")]
        public string causaDevolucion { get; set; }
      
        
        [Column("urlCEP")]
        public string urlCEP { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.STP.ConciliacionV2>> CH__Conciliac(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.STP.ConciliacionV2>("WHERE ConciliacionID = @ConciliacionID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

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

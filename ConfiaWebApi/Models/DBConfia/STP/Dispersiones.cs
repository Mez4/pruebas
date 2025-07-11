using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.STP
{
    [TableName("STP.Dispersiones")]
    [ExplicitColumns]
    [PrimaryKey("DispersionID")]
    public class Dispersiones
    {
              
        
        [Column("DispersionID")]
        public Int64 DispersionID { get; set; }
      
        
        [Column("ClaveDispersionSTP")]
        public int ClaveDispersionSTP { get; set; }
      
        
        [Column("ClaveRastreo")]
        public string ClaveRastreo { get; set; }
      
        
        [Column("ConceptoPago")]
        public string ConceptoPago { get; set; }
      
        
        [Column("CuentaBeneficiario")]
        public string CuentaBeneficiario { get; set; }
      
        
        [Column("CuentaOrdenante")]
        public string CuentaOrdenante { get; set; }
      
        
        [Column("Empresa")]
        public string Empresa { get; set; }
      
        
        [Column("FechaOperacion")]
        public string FechaOperacion { get; set; }
      
        
        [Column("FechaRegistro")]
        public DateTime FechaRegistro { get; set; }
      
        
        [Column("FechaActualizacion")]
        public DateTime? FechaActualizacion { get; set; }
      
        
        [Column("Firma")]
        public string Firma { get; set; }
      
        
        [Column("FolioOrigen")]
        public string FolioOrigen { get; set; }
      
        
        [Column("InstitucionContraparte")]
        public int InstitucionContraparte { get; set; }
      
        
        [Column("InstitucionOperante")]
        public int InstitucionOperante { get; set; }
      
        
        [Column("Monto")]
        public decimal Monto { get; set; }
      
        
        [Column("NombreBeneficiario")]
        public string NombreBeneficiario { get; set; }
      
        
        [Column("NombreOrdenante")]
        public string NombreOrdenante { get; set; }
      
        
        [Column("ReferenciaNumerica")]
        public string ReferenciaNumerica { get; set; }
      
        
        [Column("CurpRfcBeneficiario")]
        public string CurpRfcBeneficiario { get; set; }
      
        
        [Column("CurpRfcOrdenante")]
        public string CurpRfcOrdenante { get; set; }
      
        
        [Column("TipoCuentaBeneficiario")]
        public int TipoCuentaBeneficiario { get; set; }
      
        
        [Column("TipoCuentaOrdenante")]
        public int TipoCuentaOrdenante { get; set; }
      
        
        [Column("TipoPago")]
        public int TipoPago { get; set; }
      
        
        [Column("UsuarioDispersaID")]
        public int UsuarioDispersaID { get; set; }
      
        
        [Column("ClaveEstatus")]
        public string ClaveEstatus { get; set; }
      
        
        [Column("CausaDevolucion")]
        public string CausaDevolucion { get; set; }
      
        
        [Column("CreditoID")]
        public Int64 CreditoID { get; set; }
      
        
        [Column("BancoClaveSTP")]
        public int? BancoClaveSTP { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.Creditos.Creditos>> CH__Dispersio(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.Creditos>("WHERE CreditoID = @CreditoID", this).ToListAsync();
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

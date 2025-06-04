using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.STP
{
    [TableName("STP.ConsultaOrdenesDetalle")]
    [ExplicitColumns]
    [PrimaryKey("OrdenDetalle")]
    public class ConsultaOrdenesDetalle
    {
              
        
        [Column("OrdenDetalle")]
        public Int64 OrdenDetalle { get; set; }
      
        
        [Column("OrdenID")]
        public int OrdenID { get; set; }
      
        
        [Column("CLavePago")]
        public string CLavePago { get; set; }
      
        
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
      
        
        [Column("Estado")]
        public string Estado { get; set; }
      
        
        [Column("FechaOperacion")]
        public string FechaOperacion { get; set; }
      
        
        [Column("FolioOrigen")]
        public string FolioOrigen { get; set; }
      
        
        [Column("IdCliente")]
        public string IdCliente { get; set; }
      
        
        [Column("IdEf")]
        public string IdEf { get; set; }
      
        
        [Column("InstitucionContraparte")]
        public int? InstitucionContraparte { get; set; }
      
        
        [Column("InstitucionOperante")]
        public int? InstitucionOperante { get; set; }
      
        
        [Column("MedioEntrega")]
        public int? MedioEntrega { get; set; }
      
        
        [Column("Monto")]
        public decimal? Monto { get; set; }
      
        
        [Column("NombreBeneficiario")]
        public string NombreBeneficiario { get; set; }
      
        
        [Column("NombreOrdenante")]
        public string NombreOrdenante { get; set; }
      
        
        [Column("Prioridad")]
        public int? Prioridad { get; set; }
      
        
        [Column("ReferenciaNumerica")]
        public string ReferenciaNumerica { get; set; }
      
        
        [Column("CurpRfcBeneficiario")]
        public string CurpRfcBeneficiario { get; set; }
      
        
        [Column("CurpRfcOrdenante")]
        public string CurpRfcOrdenante { get; set; }
      
        
        [Column("TipoCuentaBeneficiario")]
        public int? TipoCuentaBeneficiario { get; set; }
      
        
        [Column("TipocuentaOrdenante")]
        public int? TipocuentaOrdenante { get; set; }
      
        
        [Column("TipoPago")]
        public int? TipoPago { get; set; }
      
        
        [Column("Topologia")]
        public string Topologia { get; set; }
      
        
        [Column("TsCaptura")]
        public string TsCaptura { get; set; }
      
        
        [Column("Usuario")]
        public string Usuario { get; set; }


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

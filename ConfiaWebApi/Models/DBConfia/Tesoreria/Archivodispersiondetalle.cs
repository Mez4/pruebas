using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Tesoreria
{
    [TableName("Tesoreria.ArchivoDispersionDetalle")]
    [ExplicitColumns]
    [PrimaryKey("DetalleDispersionID")]
    public class ArchivoDispersionDetalle
    {
              
        
        [Column("DetalleDispersionID")]
        public int DetalleDispersionID { get; set; }
      
        
        [Column("FechaRegistro")]
        public DateTime FechaRegistro { get; set; }
      
        
        [Column("ConsecutivoDia")]
        public int ConsecutivoDia { get; set; }
      
        
        [Column("TotalDispersion")]
        public decimal TotalDispersion { get; set; }
      
        
        [Column("CantidadMovimientos")]
        public int CantidadMovimientos { get; set; }
      
        
        [Column("Estatus")]
        public int Estatus { get; set; }
      
        
        [Column("CatConciliacionID")]
        public int CatConciliacionID { get; set; }
      
        
        [Column("CreditoID")]
        public Int64 CreditoID { get; set; }
      
        
        [Column("ArchivoDispersionID")]
        public int ArchivoDispersionID { get; set; }
      
        
        [Column("Clave_Rastreo")]
        public string Clave_Rastreo { get; set; }
      
        
        [Column("Concepto_Pago")]
        public string Concepto_Pago { get; set; }
      
        
        [Column("Cuenta_Beneficiario")]
        public string Cuenta_Beneficiario { get; set; }
      
        
        [Column("Email_Benificiario")]
        public string Email_Benificiario { get; set; }
      
        
        [Column("Empresa")]
        public string Empresa { get; set; }
      
        
        [Column("Institucion_Contraparte")]
        public string Institucion_Contraparte { get; set; }
      
        
        [Column("Institucion_Operante")]
        public string Institucion_Operante { get; set; }
      
        
        [Column("Monto")]
        public decimal Monto { get; set; }
      
        
        [Column("Nombre_Beneficiario")]
        public string Nombre_Beneficiario { get; set; }
      
        
        [Column("Referencia_Numerica")]
        public string Referencia_Numerica { get; set; }
      
        
        [Column("Rfc_Curp_Beneficiario")]
        public string Rfc_Curp_Beneficiario { get; set; }
      
        
        [Column("Tipo_Cuenta_Beneficiario")]
        public string Tipo_Cuenta_Beneficiario { get; set; }
      
        
        [Column("Tipo_Pago")]
        public string Tipo_Pago { get; set; }
      
        
        [Column("Reasignado")]
        public bool Reasignado { get; set; }
      
        
        [Column("Observaciones")]
        public string Observaciones { get; set; }
      
        
        [Column("ObservacionesDevuelta")]
        public string ObservacionesDevuelta { get; set; }
      
        
        [Column("FechaAplicacion")]
        public DateTime? FechaAplicacion { get; set; }
      
        
        [Column("FechaReasignado")]
        public DateTime? FechaReasignado { get; set; }


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

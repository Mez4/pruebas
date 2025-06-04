using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Tesoreria
{
    [TableName("Tesoreria.DesembolsosFiniquitos_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class DesembolsosFiniquitos_VW
    {
              
        
        [Column("Id")]
        public Int64 Id { get; set; }
      
        
        [Column("Cia")]
        public int Cia { get; set; }
      
        
        [Column("IDSB")]
        public Int64 IDSB { get; set; }
      
        
        [Column("SucursalID")]
        public int SucursalID { get; set; }
      
        
        [Column("PersonaID")]
        public Int64 PersonaID { get; set; }
      
        
        [Column("CuentaBancoID")]
        public int CuentaBancoID { get; set; }
      
        
        [Column("Desembolsado")]
        public bool Desembolsado { get; set; }
      
        
        [Column("Cancelado")]
        public bool Cancelado { get; set; }
      
        
        [Column("Importe")]
        public decimal Importe { get; set; }
      
        
        [Column("MovimientoID")]
        public Int64? MovimientoID { get; set; }
      
        
        [Column("UsuarioCreoId")]
        public int UsuarioCreoId { get; set; }
      
        
        [Column("FechaCreo")]
        public DateTime FechaCreo { get; set; }
      
        
        [Column("UsuarioDesembolsoId")]
        public int? UsuarioDesembolsoId { get; set; }
      
        
        [Column("FechaDesembolso")]
        public DateTime? FechaDesembolso { get; set; }
      
        
        [Column("UsuarioCanceloId")]
        public int? UsuarioCanceloId { get; set; }
      
        
        [Column("FechaCancelo")]
        public DateTime? FechaCancelo { get; set; }
      
        
        [Column("Sucursal")]
        public string Sucursal { get; set; }
      
        
        [Column("NombreCompleto")]
        public string NombreCompleto { get; set; }
      
        
        [Column("NumeroCuenta")]
        public string NumeroCuenta { get; set; }
      
        
        [Column("SACId")]
        public Int64? SACId { get; set; }
      
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }


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

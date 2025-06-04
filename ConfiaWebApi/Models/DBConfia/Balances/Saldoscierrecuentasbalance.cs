using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Balances
{
    [TableName("Balances.SaldosCierreCuentasBalance")]
    [ExplicitColumns]
    [PrimaryKey("RegistroID")]
    public class SaldosCierreCuentasBalance
    {
              
        
        [Column("RegistroID")]
        public Int64 RegistroID { get; set; }
      
        
        [Column("NumeroCuenta")]
        public string NumeroCuenta { get; set; }
      
        
        [Column("SaldoCierre")]
        public decimal SaldoCierre { get; set; }
      
        
        [Column("BalanceID")]
        public Int64 BalanceID { get; set; }
      
        
        [Column("FechaCreacion")]
        public DateTime FechaCreacion { get; set; }
      
        
        [Column("UsuarioID")]
        public int UsuarioID { get; set; }
      
        
        [Column("CuentaBancoID")]
        public int CuentaBancoID { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.Seguridad.Usuarios>> CH__SEGURIDAD_USUARIOS187F9C11(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios>("WHERE UsuarioID = @UsuarioID", this).ToListAsync();
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

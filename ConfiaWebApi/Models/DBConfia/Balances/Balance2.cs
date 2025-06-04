using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Balances
{
    [TableName("Balances.Balance2")]
    [ExplicitColumns]
    [PrimaryKey("BalanceID")]
    public class Balance2
    {
              
        
        [Column("BalanceID")]
        public Int64 BalanceID { get; set; }
      
        
        [Column("NombreBalance")]
        public string NombreBalance { get; set; }
      
        
        [Column("SaldoTotalBalance")]
        public decimal SaldoTotalBalance { get; set; }
      
        
        [Column("Periodo")]
        public int Periodo { get; set; }
      
        
        [Column("Anio")]
        public int Anio { get; set; }
      
        
        [Column("FechaCreacion")]
        public DateTime FechaCreacion { get; set; }
      
        
        [Column("Cerrado")]
        public bool Cerrado { get; set; }
      
        
        [Column("PeriodoID")]
        public int PeriodoID { get; set; }
      
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }
      
        
        [Column("UsuarioID")]
        public int UsuarioID { get; set; }
      
        
        [Column("BalanceTempID")]
        public Int64 BalanceTempID { get; set; }


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

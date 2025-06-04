using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Bancos
{
    [TableName("Bancos.MovimientosTraspasos")]
    [ExplicitColumns]
    [PrimaryKey("TraspasoID")]
    public class MovimientosTraspasos
    {
              
        
        [Column("TraspasoID")]
        public Int64 TraspasoID { get; set; }
      
        
        [Column("SucursalID")]
        public int SucursalID { get; set; }
      
        
        [Column("CajaID")]
        public int CajaID { get; set; }
      
        
        [Column("FechaTraspaso")]
        public DateTime FechaTraspaso { get; set; }
      
        
        [Column("Accion")]
        public string Accion { get; set; }
      
        
        [Column("PersonaID")]
        public Int64 PersonaID { get; set; }
      
        
        [Column("UsuarioID")]
        public int UsuarioID { get; set; }
      
        
        [Column("CuentaOrigenID")]
        public int CuentaOrigenID { get; set; }
      
        
        [Column("CuentaDestinoID")]
        public int CuentaDestinoID { get; set; }
      
        
        [Column("Monto")]
        public decimal Monto { get; set; }
      
        
        [Column("SaldoOrigenAnt")]
        public decimal SaldoOrigenAnt { get; set; }
      
        
        [Column("SaldoOrigenNvo")]
        public decimal SaldoOrigenNvo { get; set; }
      
        
        [Column("SaldoDestinoAnt")]
        public decimal SaldoDestinoAnt { get; set; }
      
        
        [Column("SaldoDestinoNvo")]
        public decimal SaldoDestinoNvo { get; set; }
      
        
        [Column("Concepto")]
        public string Concepto { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.Seguridad.Usuarios>> CH__SEGURIDAD_USUARIOS35378383(DBConfiaContext parContext)
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

        public async Task<List<DBContext.DBConfia.General.Personas>> CH__Personas(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.Personas>("WHERE PersonaID = @PersonaID", this).ToListAsync();
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

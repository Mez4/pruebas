using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.General
{
    [TableName("General.Empresas")]
    [ExplicitColumns]
    [PrimaryKey("empresaId")]
    public class Empresas
    {
              
        
        [Column("empresaId")]
        public int empresaId { get; set; }
      
        
        [Column("empresaNombre")]
        public string empresaNombre { get; set; }
      
        
        [Column("empresaRfc")]
        public string empresaRfc { get; set; }
      
        
        [Column("empresaDireccionFiscal")]
        public string empresaDireccionFiscal { get; set; }
      
        
        [Column("empresaRegistroPatronal")]
        public string empresaRegistroPatronal { get; set; }
      
        
        [Column("empresaRazonSocial")]
        public string empresaRazonSocial { get; set; }
      
        [ComputedColumn(ComputedColumnType.Always)]
        [Column("PrefijoApp")]
        public string PrefijoApp { get; set; }
      
        
        [Column("EsPrestaStar")]
        public bool? EsPrestaStar { get; set; }
      
        
        [Column("TipoEmpresaID")]
        public int? TipoEmpresaID { get; set; }


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
        
        public async Task<List<DBContext.DBConfia.Seguridad.Usuarios>> PA__Seguridad___Usuarios___empresaId(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios>("WHERE empresaId = @empresaId", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Tesoreria.CuentasContables>> PA__Tesoreria___CuentasContables___EmpresaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.CuentasContables>("WHERE empresaId = @EmpresaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        // ###############################################
        // <<
        // Child foreing keys
        // ###############################################
        
    }
}

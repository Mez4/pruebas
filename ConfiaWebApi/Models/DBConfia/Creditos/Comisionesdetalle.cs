using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Creditos
{
    [TableName("Creditos.ComisionesDetalle")]
    [ExplicitColumns]
    [PrimaryKey("ComisionesID,DistribuidorNivelID,DistribuidorNivelIDOrigen,ProductoID,RenglonId", AutoIncrement=false)]
    public class ComisionesDetalle
    {
              
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }
      
        
        [Column("ComisionesID")]
        public int ComisionesID { get; set; }
      
        
        [Column("RenglonId")]
        public int RenglonId { get; set; }
      
        
        [Column("DistribuidorNivelID")]
        public int DistribuidorNivelID { get; set; }
      
        
        [Column("DistribuidorNivelIDOrigen")]
        public int DistribuidorNivelIDOrigen { get; set; }
      
        
        [Column("Activo")]
        public bool Activo { get; set; }
      
        
        [Column("DiasMin")]
        public int DiasMin { get; set; }
      
        
        [Column("DiasMax")]
        public int DiasMax { get; set; }
      
        
        [Column("PorcComision")]
        public decimal PorcComision { get; set; }
      
        
        [Column("PorcComisionReal")]
        public decimal PorcComisionReal { get; set; }
      
        
        [Column("porcMonedero")]
        public decimal porcMonedero { get; set; }
      
        
        [Column("porcMonederoReal")]
        public decimal porcMonederoReal { get; set; }
      
        
        [Column("RegistroUsuarioId")]
        public int? RegistroUsuarioId { get; set; }
      
        
        [Column("fhRegitro")]
        public DateTime fhRegitro { get; set; }
      
        
        [Column("PersonaIDRegistro")]
        public Int64? PersonaIDRegistro { get; set; }
      
        
        [Column("ModificaUsuarioId")]
        public int? ModificaUsuarioId { get; set; }
      
        
        [Column("fhMoficiacion")]
        public DateTime fhMoficiacion { get; set; }
      
        
        [Column("DistribuidorNivelID2")]
        public int? DistribuidorNivelID2 { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.Seguridad.Usuarios>> CH__SEGURIDAD_USUARIOS8F53DBD5(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios>("WHERE RegistroUsuarioId = @UsuarioID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Seguridad.Usuarios>> CH__SEGURIDAD_USUARIOS70A7DEA4(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios>("WHERE ModificaUsuarioId = @UsuarioID", this).ToListAsync();
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

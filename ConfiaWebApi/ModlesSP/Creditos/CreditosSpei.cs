using DBContext.DBConfia.Creditos;
using NPoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.ModlesSP.Creditos
{
    [ExplicitColumns]
    public class CreditoSpei
    {   
        [Column("EnvioSTPID")]
        public Int64 EnvioSTPID { get; set; }
        
        [Column("FechaEnvio")]
        public DateTime? FechaEnvio { get; set; }
        
        [Column("ConsecutivoDia")]
        public int? ConsecutivoDia { get; set; }
        
        [Column("UsuarioID")]
        public Int64? UsuarioID { get; set; }
        
        [Column("NoBalance")]
        public int? NoBalance { get; set; }
        
        [Column("Archivo")]
        public string? Archivo { get; set; }
        
        [Column("Estatus")]
        public string? Estatus { get; set; }
        
        [Column("FhRegistro")]
        public DateTime? FhRegistro { get; set; }
        
        [Column("NumCuentaRef")]
        public string? NumCuentaRef { get; set; }
    }
}
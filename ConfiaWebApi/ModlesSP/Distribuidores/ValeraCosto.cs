using NPoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.ModlesSP.Distribuidores
{
    [ExplicitColumns]
    public class ValeraCosto
    {
        [Column("regresa")]
        public int regresa { get; set; }

        [Column("msj")]
        public string msj2 { get; set; }

        [Column("CreditoId")]
        public int CreditoID { get; set; }

    }
}

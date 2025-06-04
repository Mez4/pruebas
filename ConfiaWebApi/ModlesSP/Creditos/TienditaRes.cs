using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Custom.Creditos
{
    [ExplicitColumns]
    public class TienditaRes
    {
        [Column("regresa")]
        public int regresa { get; set; }

        [Column("msj")]
        public string msj { get; set; }

        [Column("CreditoId")]
        public long? CreditoId { get; set; }

        [Column("id_sku")]
        public long id_sku { get; set; }

        [Column("id_ticket")]
        public long id_ticket { get; set; }
    }
}
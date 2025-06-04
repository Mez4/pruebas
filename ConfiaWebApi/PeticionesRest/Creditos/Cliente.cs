using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Creditos.Cliente
{
    public class Get
    {
        [Range(minimum: 0, maximum: 999999999)]
        public long ClienteID { get; set; }

        public int EmpresaId { get; set; }

        public long DistribuidorID { get; set; }
    }

    public class GetCredito
    {
        [Range(minimum: 0, maximum: 999999999)]
        public long ClienteID { get; set; }

        public int EmpresaId { get; set; }

        public long DistribuidorID { get; set; }

        public long CreditoID { get; set; }
    }

    public class Add
    {
        [Required]
        [Range(minimum: 1, maximum: 99999)]
        public int ProductoId { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 999999999)]
        public int ClienteID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999999)]
        public int SucursalId { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 9999999)]
        public int CajaID { get; set; }

        public int DistribuidorID { get; set; }

        public int UsuarioId { get; set; }

        public decimal A_Pagar { get; set; }

        public bool Liquida { get; set; }

        public bool Comision { get; set; }

        public DateTime FechaPago { get; set; }

        public int accion { get; set; }
        public int regresa { get; set; }
        public string msj { get; set; }
        public int ConvenioID2 { get; set; }

        public long CreditoID { get; set; }

        public string TicketsJSON { get; set; }

        public List<int> MovimientoIDs { get; set; }
        public string DnisJSON { get; set; }
        public List<int> TicketIDs { get; set; }
        
        public int? CuentaBancoID { get; set; }
    }


    public class Add2
    {
        [Required]
        [Range(minimum: 1, maximum: 99999)]
        public int ProductoId { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 999999999)]
        public int ClienteID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999999)]
        public int CuentaBancoID { get; set; }


        public int DistribuidorID { get; set; }

        public int UsuarioId { get; set; }

        public decimal A_Pagar { get; set; }

        public bool Liquida { get; set; }

        public bool Comision { get; set; }

        public DateTime FechaPago { get; set; }

        public int accion { get; set; }
        public int regresa { get; set; }
        public string msj { get; set; }
        public int ConvenioID2 { get; set; }



    }
    public class Pdf
    {
        [Required]
        [Range(minimum: 1, maximum: 99999999)]
        public long MovimientoID { get; set; }
    }
    
    public class AddTickets
    {
        [Required]
        [Range(minimum: 1, maximum: 99999)]
        public int ProductoId { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 999999999)]
        public int ClienteID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999999)]
        public int SucursalId { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 9999999)]
        public int CajaID { get; set; }

        public int DistribuidorID { get; set; }

        public int UsuarioId { get; set; }

        public decimal A_Pagar { get; set; }

        public bool Liquida { get; set; }

        public bool Comision { get; set; }

        public DateTime FechaPago { get; set; }

        public int accion { get; set; }
        public int regresa { get; set; }
        public string msj { get; set; }
        public int ConvenioID2 { get; set; }

        public long CreditoID { get; set; }

        public string TicketsJSON { get; set; }

        public List<int> MovimientoIDs { get; set; }
        
        public int? CuentaBancoID { get; set; }
    }
}

using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Creditos.NivelesProducto
{
    public class Agregar
    {

        public int ProductoID { get; set; }

        public int DistribuidorNivelID { get; set; }


        public string DistribuidorNivel { get; set; }


        public decimal PorcComisionBase { get; set; }


        public decimal CapitalColocadoMinimo { get; set; }


        public decimal CapitalColocadoMaximo { get; set; }


        public decimal ImporteProteccionSaldo { get; set; }


        public decimal importeMaxCanje { get; set; }


        public decimal maximoPrestamoPersonal { get; set; }


        public decimal maximoImporteCanjeCliente { get; set; }


        public decimal maximoImporteCanjeAval { get; set; }
        public decimal monto { get; set; }
        public decimal IncrementoQuincena { get; set; }
        public decimal IncrementoQuincenaCalidadBaja { get; set; }



    }
    public class Update
    {

        public int ProductoID { get; set; }

        public int DistribuidorNivelID { get; set; }


        public string DistribuidorNivel { get; set; }


        public decimal PorcComisionBase { get; set; }


        public decimal CapitalColocadoMinimo { get; set; }


        public decimal CapitalColocadoMaximo { get; set; }


        public decimal ImporteProteccionSaldo { get; set; }


        public decimal importeMaxCanje { get; set; }


        public decimal maximoPrestamoPersonal { get; set; }


        public decimal maximoImporteCanjeCliente { get; set; }


        public decimal maximoImporteCanjeAval { get; set; }
        public decimal monto { get; set; }
        public decimal IncrementoQuincena { get; set; }
        public decimal IncrementoQuincenaCalidadBaja { get; set; }



    }
    public class Get
    {

        public int DistribuidorNivelID { get; set; }


        public string ProductoID { get; set; }

    }

}
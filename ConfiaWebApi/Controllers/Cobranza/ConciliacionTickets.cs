using System.Data.Common;
using System.Net;
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;
using System.Diagnostics; //Método de Debugusing System.Text.Json;


using DBContext.DBConfia;
using DBContext.DBConfia.Cobranza;
using DBContext.DBConfia.Creditos;
using DBContext.DBConfia.Bancos;
using DBContext.DBConfia.dbo;
using DBContext.DBConfia.Custom.Tesoreria;
using DBContext.DBConfia.Custom.Creditos;
using System.Net.Http;
using System.Collections.Generic;
using System.Text.Json;
using System.Collections;
using DBContext.DBConfia.Tesoreria;
using System.Data;
using DBContext.DBConfia.Seguridad;
using registraOrden;
using System.Text.RegularExpressions;
using System.Text;
using DBContext.DBConfia.STP;
using System.Globalization;
using System.IO;
using ConfiaWebApi.Code;

namespace ConfiaWebApi.Controllers.Cobranza
{
    [Authorize]
    [ApiController]
    [Route("api/Cobranza/[controller]")]
    public class ConciliacionTicketsController : ControllerBase
    {
        // TODO::
        // Validar funcion de eliminar cuenta... ??, valido, util ?
        // Segundo, se pueden eliminar las bovedas ??, se pueden actualizar hasta que nivel? (Nombre y Clave o solo nombre?)

        /// <summary>
        /// Conexion a base de datos
        /// </summary>
        private DBConfiaContext ConexionBD;

        /// <summary>
        /// Constructor del controlador
        /// </summary>
        /// <param name="_DBContext">Conexión de datos para el controlador</param>
        public ConciliacionTicketsController(DBConfiaContext _DBContext)
        {
            ConexionBD = _DBContext;
        }

        [HttpPost]
        [Route("ConsultaCobranza")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ConsultaCobranza(ConfiaWebApi.PeticionesRest.Cobranza.ConsultarCobranzaAppMovil.ConciliacionTicket parData)
        {
            try
            {
                if (parData.conciliado == 0)
                {
                    var res = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Cobranza.PorCobrar>("WHERE cobradorAsignado = @0 AND conciliado = 0", parData.cobradorAsignado);
                    await ConexionBD.Destroy();
                    return Ok(res);
                }
                return Ok();
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();

                return BadRequest(ex.Message);
            }
        }
        [HttpPost]
        [Route("Conciliartickets")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Conciliartickets(ConfiaWebApi.PeticionesRest.Cobranza.ConsultarCobranzaAppMovil.AgregarConc parData)
        {

            var usuarioActualEmail = Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
            var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();

            try
            {
                ArrayList ListaTickets = new();
                decimal monto = 0;
                foreach (var item in parData.Tickets)
                {
                    monto += item.montoAbonado;
                }

                var res = new DBContext.DBConfia.Cobranza.TicketsConciliacion()
                {

                    totalTickets = parData.Tickets.Count(),
                    conciliaTickets = UsuarioActual.UsuarioID,
                    fechaConciliacion = DateTime.Now,
                    monto = monto
                };
                await ConexionBD.database.InsertAsync(res);

                foreach (var item in parData.Tickets)
                {
                    var res2 = await ConexionBD.database.SingleByIdAsync<PorCobrar>(item.porCobrarId);
                    if (res2 != null)
                    {
                        res2.conciliado = true;
                    }
                    await ConexionBD.database.UpdateAsync(res2);

                    var TicketsConciliacionDetalle = new DBContext.DBConfia.Cobranza.TicketsConciliacionDetalle()
                    {
                        porCobrarId = item.porCobrarId,
                        creditoId = item.creditoId,
                        productoId = item.productoId,
                        sucursalId = item.sucursalId,
                        cobradorAsignado = item.cobradorAsignado,
                        nombreCompleto = item.nombreCompleto,
                        celular = item.celular,
                        domicilio = item.domicilio,
                        tipoCredito = item.tipoCredito,
                        montoAbonado = item.montoAbonado,
                        montoCobrar = item.montoCobrar,
                        fechaUltimoPago = item.fechaUltimoPago,
                        estatus = item.estatus,
                        creacionFecha = item.creacionFecha,
                        ticketID = item.ticketID,
                        puedeRealizarQuita = item.puedeRealizarQuita,
                        quitaPorcRangoMax = item.quitaPorcRangoMax,
                        quitaPorcRangoMin = item.quitaPorcRangoMin,
                    };
                    await ConexionBD.database.InsertAsync(TicketsConciliacionDetalle);

                    ListaTickets.Add(new
                    {
                        porCobrarId = item.porCobrarId,
                    });
                }

                return StatusCode(200, new
                {

                    Tickets = ListaTickets

                });

            }


            catch (Exception ex)
            {
                await ConexionBD.Destroy();

                return BadRequest(ex.Message);
            }
        }
    }
}
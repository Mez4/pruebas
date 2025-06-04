import { useState, useEffect, useMemo } from "react";
import { connect } from "react-redux";
import { IEstado } from "../../../../../interfaces/redux/IEstado";
import { IOidc } from "../../../../../interfaces/oidc/IOidc";
import DataTable, { IDataTableColumn } from "react-data-table-component";
import * as FnCajas from "../../tesoreria/CompTesoreria/CajasUsuarios/Funciones";
import {
  Distribuidores,
  SeleccionarCajaSucursal,
} from "../../../../selectores";
import * as Funciones from "./CreditoAplicaPagoCliente/Funciones";
import * as FuncionesDNI from "./CreditoAplicaPagoClienteAclaraciones/Funciones";
import * as FuncionesAclaraciones from "./CreditoAplicaPagoAclaraciones/Funciones";

import * as FnCreditos from "./CreditoCredito/Funciones";
import * as FnGlobal from "./CreditoGlobal/Funciones";
import * as FnClientes from "../../distribuidor/CompDistribuidor/Cliente/Funciones";
import ModalWin, { MODAL_TITLE_CLASS } from "../../../../global/ModalWin";

// Icons
import { FaCircle, FaExchangeAlt, FaEye } from "react-icons/fa";

import moment from "moment";

// Custom components
import { ActionSelect, Card, Spinner } from "../../../../global";
import { CForm } from "./CreditoAplicaPagoClienteAclaraciones/CForm";
import { FaMoneyBillWave, FaMoneyBill } from "react-icons/fa";

import ReactTooltip from "react-tooltip";

import {
  truncateDecimals,
  addOneDay,
  addTenDay,
  filterArrayByValues,
} from "../../../../../global/functions";
import { FiltrarDatos } from "../../../../../global/functions";
import { Clientes } from "../../../../selectores";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import { toast } from "react-toastify";

import { iUI } from "../../../../../interfaces/ui/iUI";
import DNIManualModalCliente from "../../general/CompGeneral/DNIManualCliente/DNIManualModal";
import { FiRefreshCcw } from "react-icons/fi";

type CatalogosType = {
  oidc: IOidc;
  iUI: iUI;
};

const CreditoAplicaPagoCliente = (props: CatalogosType) => {
  const CFDatos = {
    SucursalId: 0,
    CajaID: 0,
    ClienteID: 0,
    NombreCompleto: "",
    ImporteTotal: 0,
    SaldoActual: 0,
    Interes: 0,
    Porc_Int: 0,
    A_Condonar: 0,
    A_Pagar: 0,
    Liquida: false,
    Comision: false,
    DistribuidorID: 0,
    Distribuidor: "",
    CreditoID: 0,
    CuentaBancoID: 0,
    FechaPago: new Date(),
  };
  const Datos: any[] = [];
  const DatosMostrar: any[] = [];
  const DatosDetalle: any[] = [];
  const optSucursales: any[] = [];
  const optCuentasBancarias: any[] = [];

  const CajaDefault = {
    ProductoID: 0,
    SucursalID: 0,
    CajaID: 0,
  };
  const [state, setState] = useState({
    Datos,
    DatosMostrar,
    Filtro: "",
    Cargando: false,
    Error: false,
    CredID: 0,
    DetallePlan: false,
    DatosDetalle,
    loading: false,
    Mostrar: false,
    CFDatos,
    optSucursales,
    ShowCaja: true,
    CajaDefault,
    DistribuidorID: 0,
    optCuentasBancarias,
  });
  const [getDni, setGetDni] = useState(false);
  const [MovimientoIDs, setMovimientoIDs] = useState([] as number[]);
  const [ShowDNI, setShowDNI] = useState(false);
  const [DatosDNIMostrar, setDatosDNIMostrar] = useState([]);
  const [DatosSeleccionados, setDatosSeleccionados] = useState([]);

  const [loading, setLoading] = useState(false);
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  const fnGetSucursalesCaja = () => {
    FnCajas.FNGetSucursales(props.oidc)
      .then((respuesta: any) => {
        var sucursales = respuesta.map((valor: any) => {
          var obj = { value: valor.SucursalID, label: valor.Sucursal };
          return obj;
        });
        setState((s) => ({ ...s, optSucursales: sucursales }));
      })
      .catch(() => {
        setState((s) => ({ ...s, optSucursales: [] }));
      });
  };

  const fnSetSucCaja = (Data: any) => {
    let hoy = new Date();
    hoy.setMinutes(hoy.getMinutes() + hoy.getTimezoneOffset());
    setState((s) => ({
      ...s,
      CFDatos: {
        ...CFDatos,
        SucursalId: Data.SucursalID,
        CajaID: Data.CajaID,
        ClienteID: 0,
        DistribuidorID: 0,
        FechaPago: hoy,
      },
      DatosMostrar: [],
      Datos: [],
      CredID: 0,
      DistribuidorID: 0,
      ShowCaja: false,
    }));
  };

  const FNGetDetalle = (CreditoID: number) => {
    FnGlobal.FNGetPlanPagos(props.oidc, CreditoID)
      .then((respuesta: any) => {
        if (respuesta.length > 0) {
          let tabla: any[] = [];
          let ImporteTotal = 0;
          let Abonos = 0;
          let SaldoActual = 0;
          let Comision = 0;

          respuesta.forEach((element: any) => {
            let PlanPagos: any = {
              NoPago: element.NoPago,
              FechaVencimiento: element.FechaVencimiento,
              ImporteTotal: element.ImporteTotal,
              Abonos: element.Abonos,
              SaldoActual: element.SaldoActual,
              Comision: element.Comision,
              FechaLiquidacion: element.FechaLiquidacion,
              DiasAtraso: element.DiasAtraso,
            };

            ImporteTotal += element.ImporteTotal;
            SaldoActual += element.SaldoActual;
            Abonos += element.Abonos;
            Comision += element.Comision;

            tabla.push(PlanPagos);
          });

          let TotalPlanPagos: any = {
            NoPago: null,
            FechaVencimiento: "",
            ImporteTotal,
            Abonos,
            SaldoActual,
            Comision,
            FechaLiquidacion: "",
            DiasAtraso: 0,
          };

          tabla.push(TotalPlanPagos);
          setState((s) => ({
            ...s,
            DetallePlan: true,
            DatosDetalle: tabla,
            CredID: CreditoID,
          }));
        } else {
          setState((s) => ({
            ...s,
            DetallePlan: true,
            DatosDetalle: [],
            CredID: CreditoID,
          }));
        }
      })
      .catch(() => {
        setState((s) => ({ ...s, DetallePlan: false, DatosDetalle: [] }));
        toast.error("Error al consultar, vuelva a intentarlo");
      });
  };

  const FNGCreditosCliente = (ClienteID: number) => {
    setState((s) => ({
      ...s,
      Cargando: true,
      CFDatos: { ...s.CFDatos, ClienteID: ClienteID },
    }));

    if (!!ClienteID) {
      FnClientes.FNGetbyId(props.oidc, { ClienteID, ProductoID: 0 })
        .then((respuesta: any) => {
          setState((s) => ({ ...s, DistribuidorID: respuesta.DistribuidorID }));
        })
        .catch(() => {
          setState((s) => ({ ...s, DistribuidorID: 0 }));
        });

      FnGlobal.FNGCreditosCliente(props.oidc, 0, ClienteID, 0, true)
        .then((respuesta: any) => {
          if (respuesta.length > 0) {
            let tabla: any[] = [];
            let Capital = 0;
            let ImporteTotal = 0;
            let Abonos = 0;
            let Interes = 0;
            let SaldoActual = 0;
            let SaldoAtrasado = 0;
            let Seguro = 0;

            respuesta.forEach((element: any) => {
              let Creditos: any = {
                CreditoID: element.CreditoID,
                Capital: element.Capital,
                ImporteTotal: element.ImporteTotal,
                Abonos: element.Abonos,
                SaldoActual: element.SaldoActual,
                SaldoAtrasado: element.SaldoAtrasado,
                DiasAtraso: element.DiasAtraso,
                FechaHoraRegistro: element.FechaHoraRegistro,
                EstatusID: element.EstatusID,
                EstatusNombre: element.EstatusNombre,
                MovimientoID: element.MovimientoID,
                Interes: element.Interes,
                Seguro: element.Seguro,
                Color: element.Color,
                SucursalID: element.SucursalID,
                ClienteID: element.ClienteID,
              };

              if (element.EstatusID == "A" || element.EstatusID == "L") {
                Capital += element.Capital;
                ImporteTotal += element.ImporteTotal;
                Interes += element.Interes;
                SaldoActual += element.SaldoActual;
                SaldoAtrasado += element.SaldoAtrasado;
                Seguro += element.Seguro;
                Abonos += element.Abonos;
              }

              tabla.push(Creditos);
            });

            let TotalCreditos: any = {
              CreditoID: null,
              Capital,
              ImporteTotal,
              Abonos,
              SaldoActual,
              SaldoAtrasado,
              DiasAtraso: 0,
              FechaHoraRegistro: "",
              EstatusID: "",
              EstatusNombre: "",
              MovimientoID: 0,
              Interes,
              Seguro,
              Color: "",
            };

            tabla.push(TotalCreditos);

            setState((s) => ({ ...s, Datos: tabla, Cargando: false }));
          } else {
            setState((s) => ({ ...s, Datos: [], Cargando: false }));
          }
        })
        .catch(() => {
          setState((s) => ({ ...s, Datos: [], Cargando: false }));
          toast.error("Error al obtener los creditos del cliente");
        });
    } else {
      setState((s) => ({
        ...s,
        Cargando: false,
        DistribuidorID: 0,
        CFDatos: {
          ...s.CFDatos,
          ClienteID: 0,
          FechaPago: new Date(),
          CuentaBancoID: 0,
        },
        Datos: [],
      }));
    }
  };

  const cbActualizaDatos = (
    SucursalId: number,
    ClienteID: number,
    CreditoID: number,
    Liquida: boolean
  ) => {
    if (ClienteID > 0) {
      Funciones.FNGetSaldosCredito(props.oidc, {
        ClienteID: ClienteID,
        CreditoID: CreditoID,
      })
        .then((respuesta: any) => {
          let hoy = new Date();
          hoy.setMinutes(hoy.getMinutes() + hoy.getTimezoneOffset());
          setState({
            ...state,
            Mostrar: true,
            CFDatos: {
              ...state.CFDatos,
              ClienteID: respuesta.ClienteID,
              NombreCompleto: respuesta.NombreCompleto,
              ImporteTotal: truncateDecimals(respuesta.ImporteTotal, 2),
              SaldoActual: truncateDecimals(respuesta.SaldoActual, 2),
              Interes: truncateDecimals(respuesta.Interes, 2),
              Porc_Int: truncateDecimals(respuesta.Porc_Int * 100, 2),
              A_Condonar: Liquida
                ? truncateDecimals(respuesta.A_Condonar, 2)
                : 0,
              A_Pagar: Liquida
                ? truncateDecimals(respuesta.A_Pagar, 2)
                : DatosSeleccionados.length
                ? DatosSeleccionados.reduce(
                    (acc, current: any) => acc + current.Importe,
                    0
                  )
                : 0,
              Liquida,
              Comision: false,
              DistribuidorID: respuesta.DistribuidorID,
              Distribuidor: respuesta.Distribuidor,
              CreditoID: respuesta.CreditoID,
            },
          });
        })
        .catch((error: any) => {
          console.log(JSON.stringify(error));
          setLoading(false);
          toast.error("Error al recuperar el saldo, intentelo nuevamente");
        });
    } else {
      toast.error("Seleccione un cliente primeramente.");
      setLoading(false);
    }
  };

  const fnCancelar = () => {
    setLoading(false);
    setDatosSeleccionados([]);
    setState((s) => ({
      ...s,
      CFDatos: {
        ...state.CFDatos,
        NombreCompleto: "",
        ImporteTotal: 0,
        SaldoActual: 0,
        Interes: 0,
        Porc_Int: 0,
        A_Condonar: 0,
        A_Pagar: 0,
        Liquida: false,
        Comision: false,
      },
      Mostrar: false,
      loading: false,
    }));
  };

  const GetDNIs = (Datos: { ClienteID: number }) => {
    if (Datos.ClienteID > 0) {
      setGetDni(true);
      setMovimientoIDs([]);
      FuncionesDNI.FNGetDNIs(props.oidc, {
        ClienteID: Datos.ClienteID,
      })
        .then((respuesta: any) => {
          setShowDNI(true);
          setDatosDNIMostrar(respuesta);
          setGetDni(false);
          if (respuesta.regresa == 0) {
            toast.error(respuesta.msj);
          }
        })
        .catch((error: any) => {
          toast.error(
            "Error al recuperar los DNIs, intente lo nuevamente o reportarlo a sistemas"
          );
          setGetDni(false);
        });
    } else toast.error(`Seleccione un cliente`);
  };

  const fnGetCuentasBancarias = () => {
    FuncionesAclaraciones.FNGetCuentasBancarias(props.oidc)
      .then((respuesta: any) => {
        var cuentasBancarias = respuesta.map((valor: any) => {
          var obj = {
            value: valor.CuentaBancoID,
            label: valor.DescripcionCuenta,
          };
          return obj;
        });

        setState((s) => ({ ...s, optCuentasBancarias: cuentasBancarias }));
      })
      .catch(() => {
        setState((s) => ({ ...s, optCuentasBancarias: [] }));
      });
  };

  const Columns: IDataTableColumn[] = [
    {
      name: "Crédito",
      selector: "CreditoID",
      sortable: false,

      cell: (props) =>
        props.CreditoID != null ? (
          <span
            style={{
              minWidth: "15%",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            {props.CreditoID}
          </span>
        ) : (
          <span></span>
        ),
      conditionalCellStyles: [
        {
          when: (row) => row.CreditoID == null,
          style: {
            textAlign: "center",
            borderTop: "1px solid black",

            backgroundColor: "#f0f0f0",
            fontWeight: "bold",
          },
        },
      ],
    },
    {
      name: "Capital",
      selector: "Capital",
      sortable: false,

      format: (row) => formatter.format(row.Capital),
      conditionalCellStyles: [
        {
          when: (row) => row.CreditoID == null,
          style: {
            textAlign: "center",
            borderTop: "1px solid black",

            backgroundColor: "#f0f0f0",
            fontWeight: "bold",
          },
        },
      ],
    },
    {
      name: "Importe",
      selector: "ImporteTotal",
      sortable: false,
      minWidth: "100px",
      format: (row) => formatter.format(row.ImporteTotal),
      conditionalCellStyles: [
        {
          when: (row) => row.CreditoID == null,
          style: {
            textAlign: "center",
            borderTop: "1px solid black",

            backgroundColor: "#f0f0f0",
            fontWeight: "bold",
          },
        },
      ],
    },
    {
      name: "Abonos",
      selector: "Abonos",
      sortable: false,
      minWidth: "90px",
      format: (row) => formatter.format(row.Abonos),
      style: {
        fontWeight: "bold",
      },
      conditionalCellStyles: [
        {
          when: (row) => row.CreditoID == null,
          style: {
            textAlign: "center",
            borderTop: "1px solid black",

            backgroundColor: "#f0f0f0",
            fontWeight: "bold",
          },
        },
      ],
    },
    {
      name: "Saldo",
      selector: "SaldoActual",
      sortable: false,

      format: (row) => formatter.format(row.SaldoActual),
      style: {
        fontWeight: "bold",
      },
      conditionalCellStyles: [
        {
          when: (row) => row.CreditoID == null,
          style: {
            textAlign: "center",
            borderTop: "1px solid black",

            backgroundColor: "#f0f0f0",
            fontWeight: "bold",
          },
        },
      ],
    },
    {
      name: "Atrasado",
      selector: "SaldoAtrasado",
      sortable: false,

      format: (row) => formatter.format(row.SaldoAtrasado),
      conditionalCellStyles: [
        {
          when: (row) => row.SaldoAtrasado > 0,
          style: {
            color: "red",
          },
        },
        {
          when: (row) => row.CreditoID == null,
          style: {
            textAlign: "center",
            borderTop: "1px solid black",
            color: "red",
            backgroundColor: "#f0f0f0",
            fontWeight: "bold",
          },
        },
      ],
    },
    {
      name: "Días Atr",
      selector: "DiasAtraso",
      sortable: false,

      cell: (props) =>
        props.CreditoID != null ? (
          <span>{props.DiasAtraso}</span>
        ) : (
          <span></span>
        ),
      conditionalCellStyles: [
        {
          when: (row) => row.DiasAtraso > 0,
          style: {
            color: "red",
          },
        },
        {
          when: (row) => row.CreditoID == null,
          style: {
            textAlign: "center",
            borderTop: "1px solid black",
            color: "red",
            backgroundColor: "#f0f0f0",
            fontWeight: "bold",
          },
        },
      ],
    },
    {
      name: "Fecha Registro",
      selector: "FechaHoraRegistro",
      sortable: false,

      cell: (props) =>
        props.CreditoID != null ? (
          <span>{moment(props.FechaHoraRegistro).format("DD/MM/YYYY")}</span>
        ) : (
          <span></span>
        ),
      conditionalCellStyles: [
        {
          when: (row) => row.CreditoID == null,
          style: {
            textAlign: "center",
            borderTop: "1px solid black",

            backgroundColor: "#f0f0f0",
            fontWeight: "bold",
          },
        },
      ],
    },
    {
      name: "Estatus",
      selector: "EstatusID",
      sortable: false,
      center: true,
      cell: (props) =>
        props.CreditoID != null ? (
          <>
            <span data-tip data-for={`CreditoEsttTooltip${props.CreditoID}`}>
              <FaCircle color={props.Color} title={props.color} />
            </span>
            <ReactTooltip
              id={`CreditoEsttTooltip${props.CreditoID}`}
              type="info"
              effect="solid"
              clickable
              globalEventOff="click"
            >
              {props.EstatusNombre}
            </ReactTooltip>
          </>
        ) : (
          <span></span>
        ),
      conditionalCellStyles: [
        {
          when: (row) => row.CreditoID == null,
          style: {
            textAlign: "center",
            borderTop: "1px solid black",

            backgroundColor: "#f0f0f0",
            fontWeight: "bold",
          },
        },
      ],
    },
    {
      name: "Plan Pagos",
      sortable: false,
      center: true,
      wrap: true,
      cell: (data) =>
        data.CreditoID != null ? (
          <div style={{ overflowX: "auto", whiteSpace: "nowrap" }}>
            <button
              title="Detalle"
              data-tip
              data-for={`DetallePagoTooltip${data.CreditoID}`}
              className="asstext"
              style={{
                margin: ".15em",
                height: "40px",
                padding: "0px",
                tableLayout: "fixed",
                borderCollapse: "collapse",
              }}
              type="button"
              onClick={() => {
                FNGetDetalle(data.CreditoID);
              }}
            >
              <FaEye />
            </button>
            <ReactTooltip
              id={`DetallePagoTooltip${data.CreditoID}`}
              type="info"
              effect="solid"
              clickable
              globalEventOff="click"
            >
              Ver Plan de Pagos
            </ReactTooltip>
          </div>
        ) : (
          <span></span>
        ),
      conditionalCellStyles: [
        {
          when: (row) => row.CreditoID == null,
          style: {
            textAlign: "center",
            borderTop: "1px solid black",

            backgroundColor: "#f0f0f0",
            fontWeight: "bold",
          },
        },
      ],
    },
    {
      name: "",
      sortable: false,
      center: true,
      wrap: true,
      width: "30rem",
      cell: (data) =>
        data.CreditoID != null ? (
          <div
            style={{
              whiteSpace: "nowrap",
              display: "flex",
              justifyContent: "space-between",
              gap: "1rem",
            }}
          >
            <button
              type="button"
              disabled={getDni}
              className="btn btn-warning waves-effect waves-light"
              onClick={() => {
                GetDNIs(data);
                setState((s) => ({
                  ...s,
                  CredID: data.CreditoID,
                }));
              }}
            >
              Buscar DNI
              <FiRefreshCcw className="ml-1" />
            </button>
            <button
              type="button"
              disabled={loading}
              className="btn btn-primary waves-effect waves-light"
              onClick={() => {
                setLoading(true);
                cbActualizaDatos(
                  data.SucursalId,
                  data.ClienteID,
                  data.CreditoID,
                  false
                );
              }}
            >
              <span>Abonar</span>&nbsp;
              <FaMoneyBillWave />
            </button>
            <button
              type="button"
              disabled={loading}
              className="btn btn-primary waves-effect waves-light"
              onClick={() => {
                setLoading(true);
                cbActualizaDatos(
                  data.SucursalId,
                  data.ClienteID,
                  data.CreditoID,
                  true
                );
              }}
            >
              <span>Pronto Pago (Liquidar) </span>&nbsp;
              <FaMoneyBill />
            </button>
          </div>
        ) : (
          <span></span>
        ),
      conditionalCellStyles: [
        {
          when: (row) => row.CreditoID == null,
          style: {
            textAlign: "center",
            borderTop: "1px solid black",

            backgroundColor: "#f0f0f0",
            fontWeight: "bold",
          },
        },
      ],
    },
  ];

  const DetailColumns: IDataTableColumn[] = [
    {
      name: "# Pago",
      width: "95px",
      selector: "NoPago",
      sortable: false,
      cell: (props) =>
        props.NoPago != null ? (
          <span
            style={{ width: "95px", whiteSpace: "nowrap", overflow: "hidden" }}
          >
            {props.NoPago}
          </span>
        ) : (
          <span>TOTAL</span>
        ),
      conditionalCellStyles: [
        {
          when: (row) => row.NoPago == null,
          style: {
            textAlign: "center",
            borderTop: "1px solid black",

            backgroundColor: "#f0f0f0",
            fontWeight: "bold",
          },
        },
      ],
    },
    {
      name: "Importe",
      width: "150px",
      selector: "ImporteTotal",
      sortable: false,
      format: (row) => formatter.format(row.ImporteTotal),
      conditionalCellStyles: [
        {
          when: (row) => row.NoPago == null,
          style: {
            textAlign: "center",
            borderTop: "1px solid black",

            backgroundColor: "#f0f0f0",
            fontWeight: "bold",
          },
        },
      ],
    },
    {
      name: "Abono",
      width: "150px",
      selector: "Abonos",
      sortable: false,
      format: (row) => formatter.format(row.Abonos),
      conditionalCellStyles: [
        {
          when: (row) => row.NoPago == null,
          style: {
            textAlign: "center",
            borderTop: "1px solid black",

            backgroundColor: "#f0f0f0",
            fontWeight: "bold",
          },
        },
      ],
    },
    {
      name: "Saldo",
      width: "150px",
      selector: "SaldoActual",
      sortable: false,
      format: (row) => formatter.format(row.SaldoActual),
      conditionalCellStyles: [
        {
          when: (row) => row.NoPago == null,
          style: {
            textAlign: "center",
            borderTop: "1px solid black",

            backgroundColor: "#f0f0f0",
            fontWeight: "bold",
          },
        },
      ],
    },
    {
      name: "Comisión",
      width: "150px",
      selector: "Comision",
      sortable: false,
      format: (row) => formatter.format(row.Comision),
      conditionalCellStyles: [
        {
          when: (row) => row.NoPago == null,
          style: {
            textAlign: "center",
            borderTop: "1px solid black",

            backgroundColor: "#f0f0f0",
            fontWeight: "bold",
          },
        },
      ],
    },
    {
      name: "Vencimiento",
      width: "150px",
      selector: "FechaVencimiento",
      sortable: false,
      cell: (props) =>
        props.NoPago != null ? (
          <span>
            {moment(addTenDay(new Date(props.FechaVencimiento))).format(
              "DD/MM/YYYY"
            )}
          </span>
        ) : (
          <span></span>
        ),
      conditionalCellStyles: [
        {
          when: (row) => row.NoPago == null,
          style: {
            textAlign: "center",
            borderTop: "1px solid black",

            backgroundColor: "#f0f0f0",
            fontWeight: "bold",
          },
        },
      ],
    },
    {
      name: "Días Atr",
      width: "95px",
      selector: "DiasAtraso",
      sortable: false,
      cell: (props) =>
        props.NoPago != null ? <span>{props.DiasAtraso}</span> : <span></span>,
      conditionalCellStyles: [
        {
          when: (row) => row.DiasAtraso > 0,
          style: {
            color: "red",
          },
        },
        {
          when: (row) => row.NoPago == null,
          style: {
            textAlign: "center",
            borderTop: "1px solid black",

            backgroundColor: "#f0f0f0",
            fontWeight: "bold",
          },
        },
      ],
    },
    {
      name: "Fch Liq",
      width: "150px",
      selector: "FechaLiquidacion",
      sortable: false,
      cell: (props) =>
        props.NoPago != null ? (
          <span>
            {props.FechaLiquidacion
              ? moment(addOneDay(new Date(props.FechaLiquidacion))).format(
                  "DD/MM/YYYY"
                )
              : ""}
          </span>
        ) : (
          <span></span>
        ),
      conditionalCellStyles: [
        {
          when: (row) => row.NoPago == null,
          style: {
            textAlign: "center",
            borderTop: "1px solid black",

            backgroundColor: "#f0f0f0",
            fontWeight: "bold",
          },
        },
      ],
    },
  ];

  const ColumnsDNI = useMemo(() => {
    let colRet: IDataTableColumn[] = [
      { name: "ID", selector: "MovimientoID", sortable: true },
      {
        name: "Observaciones",
        selector: "Observaciones",
        sortable: true,
        cell: (props) => <span> {props.Observaciones} </span>,
      },
      {
        name: "Importe",
        selector: "Importe",
        sortable: true,
        cell: (props) => (
          <span>{props.Importe ? formatter.format(props.Importe) : 0}</span>
        ),
      },
      {
        name: "Importe Restante",
        selector: "Importe Restante",
        sortable: true,
        cell: (props) => (
          <span>{props.restoDNI ? formatter.format(props.restoDNI) : 0}</span>
        ),
      },
      { name: "Fecha Captura", selector: "FechaCaptura", sortable: true },
      { name: "Fecha Afectacion", selector: "FechaAfectacion", sortable: true },
      {
        name: "Estatus Mov",
        selector: "EstDsc",
        sortable: true,
        center: true,
        cell: (props) => (
          <div
            style={{
              width: "100%",
              textAlign: "center",
              color: `${props.ColorEst}`,
            }}
          >
            {props.EstDsc}
          </div>
        ),
      },
      {
        name: "DNI Aplicado",
        selector: "DNI Aplicado",
        sortable: true,
        center: true,
        cell: (props) => (
          <div
            style={{
              width: "100%",
              textAlign: "center",
            }}
          >
            {props.bitAplicado == 1 ? "SI" : "NO"}
          </div>
        ),
      },
      {
        name: "DNI Aplicado Resto",
        selector: "DNI Aplicado Resto",
        sortable: true,
        center: true,
        cell: (props) => (
          <div
            style={{
              width: "100%",
              textAlign: "center",
            }}
          >
            {props.bitAplicadoResto == 1 ? "SI" : "NO"}
          </div>
        ),
      },
    ];
    return colRet;
  }, []);

  useEffect(() => {
    fnGetSucursalesCaja();
    fnGetCuentasBancarias();
  }, []);

  useEffect(() => {
    setState((s) => ({
      ...s,
      DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro),
    }));
    // eslint-disable-next-line
  }, [state.Datos, state.Filtro]);

  useEffect(() => {
    setDatosSeleccionados(
      filterArrayByValues(DatosDNIMostrar, MovimientoIDs, "MovimientoID")
    );
  }, [MovimientoIDs]);

  const showModalSeleccionSucursal = () => {
    setState((s) => ({
      ...s,
      ShowCaja: true,
    }));
  };

  return (
    <Card
      Title=""
      TitleEnd={
        <>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>Recibo Cajas</span>
            <div>
              <span
                style={{
                  fontSize: "0.8rem",
                }}
              >
                {state.CFDatos.SucursalId != 0
                  ? state.optSucursales.find(
                      (x) => x.value == state.CFDatos.SucursalId
                    ).label
                  : ""}
              </span>
              <button
                title={`${state.CFDatos.SucursalId}`}
                onClick={showModalSeleccionSucursal}
                className="btn btn-success waves-effect waves-light ml-2"
                type="button"
              >
                Cambiar sucursal <FaExchangeAlt className="ml-2" />
              </button>
            </div>
          </div>
        </>
      }
    >
      <Card.Body>
        <Card.Body.Content>
          {state.Error && <span>Error al cargar los datos...</span>}
          {!state.Error && (
            <div>
              <Formik
                initialValues={state.CFDatos}
                validationSchema={Yup.object().shape({
                  ClienteID: Yup.number()
                    .required("Seleccione el cliente")
                    .moreThan(0, "Seleccione el cliente"),
                })}
                onSubmit={(values: any) => {
                  setLoading(true);
                  console.log("values: ", values);
                  FnCreditos.FNgetbyfiltros(props.oidc, values)
                    .then((respuesta: any) => {
                      setState((s) => ({
                        ...s,
                        Cargando: false,
                        Error: false,
                        Datos: respuesta,
                      }));
                      setLoading(false);
                    })
                    .catch(() => {
                      setLoading(false);
                      toast.error("Error al consultar, vuelva a intentarlo");
                    });
                }}
              >
                {({ values }) => (
                  <Form>
                    <div
                      style={{
                        backgroundColor: "#F7F7F7",
                        padding: "1em",
                        borderRadius: "15px",
                      }}
                    >
                      <div className="columns is-desktop is-tablet">
                        <div className="column is-12-mobile is-12-tablet is-4-desktop">
                          <Clientes
                            disabled={loading}
                            DistribuidorID={0}
                            name={"ClienteID"}
                            cbCliente={FNGCreditosCliente}
                            noDist={true}
                            SucursalID={state.CFDatos.SucursalId}
                          />
                        </div>
                        <div className="column is-12-mobile is-12-tablet is-4-desktop">
                          <Distribuidores
                            disabled
                            SucursalID={0}
                            GrupoID={0}
                            name={"DistribuidorID"}
                            valor={state.DistribuidorID}
                          />
                        </div>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
              {state.Cargando && <Spinner />}
              {!state.Cargando && (
                <div>
                  <div className="column is-12-mobile is-12-tablet is-12-desktop">
                    <div className="text-end mb-3">
                      <DNIManualModalCliente
                        SucursalID={state.CFDatos.SucursalId}
                        Dif_Pago={0}
                        ClienteID={state.CFDatos.ClienteID}
                        CuentaID={0}
                        CajaID={state.CFDatos.CajaID}
                        oidc={props.oidc}
                        ProductoID={props.iUI.Producto?.ProductoID as number}
                      />
                    </div>
                  </div>
                  <DataTable
                    data={state.DatosMostrar}
                    striped
                    noDataComponent="Cliente no cuenta con Créditos."
                    dense
                    noHeader
                    responsive
                    keyField={"CreditoID"}
                    defaultSortAsc={true}
                    defaultSortField={"CreditoID"}
                    columns={Columns}
                  />
                </div>
              )}
              <ModalWin
                open={state.DetallePlan}
                zIndex={3000}
                xlarge
                scrollable
              >
                <ModalWin.Header>
                  <h5 className={MODAL_TITLE_CLASS}>
                    <strong>
                      <h4>{"Plan de Pagos"}</h4>
                    </strong>
                    <strong>{"N° Crédito: "}</strong>
                    {state.CredID}
                  </h5>
                  <button
                    title="Cerrar"
                    type="button"
                    className="delete"
                    onClick={() =>
                      setState({
                        ...state,
                        DetallePlan: false,
                        DatosDetalle: [],
                      })
                    }
                  />
                </ModalWin.Header>
                <ModalWin.Body>
                  <DataTable
                    data={state.DatosDetalle}
                    striped
                    noDataComponent="Sin plan de pagos."
                    dense
                    noHeader
                    responsive
                    keyField={"NoPago"}
                    defaultSortAsc={true}
                    defaultSortField={"NoPago"}
                    columns={DetailColumns}
                  />
                </ModalWin.Body>
              </ModalWin>

              <ModalWin xlarge open={state.Mostrar}>
                <ModalWin.Header>
                  <h5 className={MODAL_TITLE_CLASS}>{"Pronto Pago"}</h5>
                </ModalWin.Header>
                <ModalWin.Body>
                  {state.Mostrar && (
                    <CForm
                      oidc={props.oidc}
                      ProductoID={props.iUI.Producto?.ProductoID as number}
                      initialValues={state.CFDatos}
                      optSucursales={state.optSucursales}
                      optCuentasBancarias={state.optCuentasBancarias}
                      fnCancelar={fnCancelar}
                      fnRefresca={FNGCreditosCliente}
                      cbActualizaDatos={cbActualizaDatos}
                      DNIsSeleccionados={DatosSeleccionados}
                    />
                  )}
                </ModalWin.Body>
              </ModalWin>

              {state.ShowCaja && (
                <ModalWin open={state.ShowCaja} large scrollable>
                  <ModalWin.Header>
                    <h5 className={MODAL_TITLE_CLASS}>Selección de Caja</h5>
                  </ModalWin.Header>
                  <ModalWin.Body>
                    {state.ShowCaja && (
                      <SeleccionarCajaSucursal
                        optSucursales={state.optSucursales}
                        initialValues={state.CajaDefault}
                        cbAceptar={fnSetSucCaja}
                      />
                    )}
                  </ModalWin.Body>
                </ModalWin>
              )}
              {ShowDNI && (
                <ModalWin open={ShowDNI} xlarge scrollable>
                  <ModalWin.Header>
                    <h5 className={MODAL_TITLE_CLASS}>Selección de DNI</h5>
                    <button
                      type="button"
                      title="Cerrar"
                      className="delete"
                      onClick={() => setShowDNI(false)}
                    />
                  </ModalWin.Header>
                  <ModalWin.Body>
                    <DataTable
                      subHeader
                      data={DatosDNIMostrar}
                      selectableRows
                      onSelectedRowsChange={(row: any) =>
                        setMovimientoIDs(
                          row.selectedRows.map((valor: any) => {
                            return valor.MovimientoID;
                          })
                        )
                      }
                      selectableRowDisabled={(row: any) =>
                        row.CatEstatusMovID == 1 || row.CatEstatusMovID == 4
                          ? false
                          : true
                      }
                      striped
                      dense
                      noHeader
                      responsive
                      keyField={"MovimientoID"}
                      defaultSortField={"MovimientoID"}
                      columns={ColumnsDNI}
                    />
                    <br />
                    <div className="text-end">
                      <button
                        type="button"
                        className="ms-2 btn btn-success waves-effect waves-light"
                        onClick={() => {
                          setShowDNI(false);
                          if (MovimientoIDs.length) {
                            cbActualizaDatos(
                              state.CFDatos.SucursalId,
                              state.CFDatos.ClienteID,
                              state.CredID,
                              false
                            );
                          }
                        }}
                      >
                        Aceptar
                      </button>
                    </div>
                  </ModalWin.Body>
                </ModalWin>
              )}
            </div>
          )}
        </Card.Body.Content>
      </Card.Body>
    </Card>
  );
};

const mapStateToProps = (state: IEstado) => ({
  oidc: state.oidc,
  iUI: state.UI,
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreditoAplicaPagoCliente);

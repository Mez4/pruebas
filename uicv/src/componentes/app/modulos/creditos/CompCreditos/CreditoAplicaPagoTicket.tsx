import React from "react";
import { connect } from "react-redux";
import { IEstado } from "../../../../../interfaces/redux/IEstado";
import { IOidc } from "../../../../../interfaces/oidc/IOidc";
// import DataTable, { IDataTableColumn } from 'react-data-table-component'
import * as FnCajas from "../../tesoreria/CompTesoreria/CajasUsuarios/Funciones";
import { SeleccionarCajaSucursal } from "../../../../selectores";
import * as Funciones from "./CreditoAplicaPagoTicket/Funciones";

// Custom components
import { Card, Spinner } from "../../../../global";
import { CForm } from "./CreditoAplicaPagoTicket/CForm";
// import { FiRefreshCcw } from 'react-icons/fi'
import ModalWin, { MODAL_TITLE_CLASS } from "../../../../global/ModalWin";

import { iUI } from "../../../../../interfaces/ui/iUI";
import { FaExchangeAlt } from "react-icons/fa";

type CatalogosType = {
  oidc: IOidc;
  iUI: iUI;
};

const CreditoAplicaPagoTicket = (props: CatalogosType) => {
  let isMounted = React.useRef(true);
  const DatosDefecto = {
    DistribuidorId: 0,
    SucursalId: 0,
    CajaID: 0,
    CuentaId: 0,
    FechaPago: new Date(),
    Importe: 0,
    GenerarDNI: false,
    CodigoAut: "",
    saldoPlazo: 0,
    PorcComision: 0,
    PagoTotal: 0,
    PagoComision: 0,
    Abono: 0,
    Dif_Pago: 0,
    AbonoAcumulado: 0,
    SldCredPersonal: 0,
    CargoAdic: 0,
    BonDia: 0,
    SldDia: 0,
    PagoMinComision: 0,
    CuentaBancoID: 0,
    Observacion: "",
  };
  const Datos: any[] = [];
  const DatosMostrar: any[] = [];
  const optSucursales: any[] = [];
  const optCuentasBancarias: any[] = [];
  const FechaCorte: Date | undefined = undefined;
  const CajaDefault = {
    ProductoID: 0,
    SucursalID: 0,
    CajaID: 0,
  };
  const [state, setState] = React.useState({
    Datos,
    DatosMostrar,
    Filtro: "",
    Cargando: true,
    Error: false,
    Form: DatosDefecto,
    loading: false,
    ShowCaja: true,
    optSucursales,
    optCuentasBancarias,
    CajaDefault,
    FechaCorte: FechaCorte,
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

  const fnGetCuentasBancarias = () => {
    Funciones.FNGetCuentasBancarias(props.oidc)
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

  const fnSetSucCaja = (Data: any) => {
    setState((s) => ({
      ...s,
      Form: {
        ...state.Form,
        SucursalId: Data.SucursalID,
        CajaID: Data.CajaID,
        DistribuidorId: 0,
        CuentaId: 0,
        Importe: 0,
        GenerarDNI: false,
        CodigoAut: "",
        saldoPlazo: 0,
        PorcComision: 0,
        PagoTotal: 0,
        PagoComision: 0,
        Abono: 0,
        Dif_Pago: 0,
        AbonoAcumulado: 0,
        SldCredPersonal: 0,
        CargoAdic: 0,
        BonDia: 0,
        SldDia: 0,
        PagoMinComision: 0,
        CuentaBancoID: 0,
        Observacion: "",
      },
      FechaCorte: undefined,
      ShowCaja: false,
    }));
  };

  const cbTickets = (Data: any) => {
    const Importe =
      Math.round(
        (Data.reduce((accumulator, object: any) => {
          if (object.CatEstatusMovID == 4) {
            return accumulator + object.restoDNI;
          } else {
            return accumulator + object.Importe;
          }
        }, 0) +
          Number.EPSILON) *
          100
      ) / 100;
    setState((s) => ({ ...s, Form: { ...state.Form, Importe: Importe } }));
  };

  const cbActualizaDatos = (item: any) => {
    let hoy = new Date(item.FechaPago);
    hoy.setMinutes(hoy.getMinutes() + hoy.getTimezoneOffset());
    let fechaCorte;
    if (item.FechaCorte && !isNaN(Date.parse(item.FechaCorte))) {
      fechaCorte = new Date(item.FechaCorte);
      fechaCorte.setMinutes(
        fechaCorte.getMinutes() + fechaCorte.getTimezoneOffset()
      );
    } else {
      fechaCorte = undefined;
    }
    let fechaCorteReal =
      fechaCorte > new Date("1999-01-01") ? fechaCorte : undefined;
    setState((s) => ({
      ...s,
      Form: {
        ...state.Form,
        DistribuidorId: item.DistribuidorId,
        SucursalId: item.SucursalId,
        CuentaId: item.CuentaId,
        Abono: item.Abono,
        saldoPlazo: item.saldoPlazo,
        PorcComision: item.PorcComision * 100,
        PagoTotal: item.PagoTotal,
        PagoComision: item.PagoComision,
        Importe: item.Abono == 0 ? item.PagoTotal : item.Abono,
        Dif_Pago: item.Dif_Pago,
        AbonoAcumulado: item.AbonoAcumulado,
        SldCredPersonal: item.SldCredPersonal,
        CargoAdic: item.CargoAdic,
        BonDia: item.BonDia,
        SldDia: item.SldDia,
        PagoMinComision: item.PagoMinComision,
        FechaPago: hoy,
        CodigoAut: item.CodigoAut,
      },
      FechaCorte: fechaCorteReal,
    }));
  };

  const showModalSeleccionSucursal = () => {
    setState((s) => ({
      ...s,
      ShowCaja: true,
    }));
  };

  React.useEffect(() => {
    if (isMounted.current === true) {
      fnGetSucursalesCaja();
      fnGetCuentasBancarias();
    }

    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line
  }, []);

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
            <span>Aplica Pagos Tickets</span>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                whiteSpace: "nowrap",
                alignItems: "center",
              }}
            >
              {/* <span style={{ fontSize: "0.9rem", marginRight: "1rem" }}>
                Fecha Corte:{" "}
                {!!state.FechaCorte
                  ? new Date(state.FechaCorte).toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : "N/A"}
              </span> */}
              <button
                onClick={showModalSeleccionSucursal}
                className="btn btn-success waves-effect waves-light"
                type="button"
              >
                Cambiar sucursal <FaExchangeAlt className="ml-3" />
              </button>
            </div>
          </div>
        </>
      }
    >
      <Card.Body>
        <Card.Body.Content>
          <div>
            <CForm
              oidc={props.oidc}
              ProductoID={props.iUI.Producto?.ProductoID as number}
              initialValues={state.Form}
              optSucursales={state.optSucursales}
              optCuentasBancarias={state.optCuentasBancarias}
              cbActualizaDatos={cbActualizaDatos}
              cbTickets={cbTickets}
            />
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
          </div>
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
)(CreditoAplicaPagoTicket);

import React from "react";
import { connect } from "react-redux";
import { IEstado } from "../../../../../interfaces/redux/IEstado";
import { IOidc } from "../../../../../interfaces/oidc/IOidc";
import * as FnCajas from "../../tesoreria/CompTesoreria/CajasUsuarios/Funciones";
import { SeleccionarCajaSucursal } from "../../../../selectores";
import * as Funciones from "./CreditoAplicaPagoAclaraciones/Funciones";
import * as FnVariablesGlobales from "../../catalogos/CompCatalogos/CatalogoVariableGlobal/Funciones";

// Icons
import { FaExchangeAlt } from "react-icons/fa";

// Custom components
import { Card } from "../../../../global";
import { CForm } from "./CreditoAplicaPagoAclaraciones/CForm";
import ModalWin, { MODAL_TITLE_CLASS } from "../../../../global/ModalWin";

import { iUI } from "../../../../../interfaces/ui/iUI";
type CatalogosType = {
  oidc: IOidc;
  iUI: iUI;
};

const CreditoAplicaPagoAclaraciones = (props: CatalogosType) => {
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
    GenPPI: false,
    PagoPPI: 0,
    CuentaBancoID: 0,
    BonificacionID: 0,
    TipoCodigoID: 0,
    Observacion: "",
    FechaCorte: "",
  };
  const Datos: any[] = [];
  const DatosMostrar: any[] = [];
  const optSucursales: any[] = [];
  const optCuentasBancarias: any[] = [];
  const optBonificaciones: any[] = [];
  const FechaCorte: Date | undefined = undefined;
  const optTiposCodigo: any[] = [];
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
    optBonificaciones,
    optTiposCodigo,
    CajaDefault,
    MaxPPI: 0,
    FechaCorte: FechaCorte,
  });

  const FNGetVariablesGlobales = () => {
    let datos = { Id: 46, varName: "MONTO_MAXIMO_PPI" };
    FnVariablesGlobales.FNGet(props.oidc, datos)
      .then((respuesta: any) => {
        setState((s) => ({ ...s, MaxPPI: respuesta.varValue }));
      })
      .catch(() => {
        setState((s) => ({ ...s, MaxPPI: 0 }));
      });
  };

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

  const fnGetTiposCodigo = () => {
    Funciones.FNGetTiposCodigo(props.oidc)
      .then((respuesta: any) => {
        var tipocodigo = respuesta.map((valor: any) => {
          var obj = {
            value: valor.TipoCodigoID,
            label: valor.Descripcion,
          };
          return obj;
        });

        setState((s) => ({ ...s, optTiposCodigo: tipocodigo }));
      })
      .catch(() => {
        setState((s) => ({ ...s, optTiposCodigo: [] }));
      });
  };

  const formPerc = new Intl.NumberFormat("en-US", {
    style: "percent",
    // currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  const fnGetBonificaciones = () => {
    Funciones.FNGetBonificaciones(props.oidc)
      .then((respuesta: any) => {
        var bonificaciones = respuesta.map((valor: any) => {
          var obj = {
            value: valor.BonificacionID,
            label: formPerc.format((valor.Bonificacion * 100) / 100),
          };
          return obj;
        });

        setState((s) => ({ ...s, optBonificaciones: bonificaciones }));
      })
      .catch(() => {
        setState((s) => ({ ...s, optBonificaciones: [] }));
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
        GenPPI: false,
        PagoPPI: 0,
        CuentaBancoID: 0,
        BonificacionID: 0,
        Observacion: "",
        TipoCodigoID: 0,
        FechaCorte: "",
      },
      FechaCorte: undefined,
      ShowCaja: false,
    }));
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
        PagoPPI: item.PagoPPI,
        GenPPI: item.GenPPI,
        CuentaBancoID: item.CuentaBancoID,
        BonificacionID: item.BonificacionID,
        Observacion: "",
        TipoCodigoID: item.TipoCodigoID,
        FechaCorte: item.FechaCorte,
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
      FNGetVariablesGlobales();
      fnGetSucursalesCaja();
      fnGetCuentasBancarias();
      fnGetBonificaciones();
      fnGetTiposCodigo();
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
            <span>Pagos Aclaraciones</span>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                whiteSpace: "nowrap",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: "0.9rem", marginRight: "1rem" }}>
                Fecha Corte:{" "}
                {!!state.FechaCorte
                  ? new Date(state.FechaCorte).toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : "N/A"}
              </span>
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
              optBonificaciones={state.optBonificaciones}
              optTiposCodigo={state.optTiposCodigo}
              cbActualizaDatos={cbActualizaDatos}
              MaxPPI={state.MaxPPI}
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
)(CreditoAplicaPagoAclaraciones);

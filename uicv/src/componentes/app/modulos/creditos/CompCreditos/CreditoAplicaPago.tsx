import React from "react";
import { connect } from "react-redux";
import { IEstado } from "../../../../../interfaces/redux/IEstado";
import { IOidc } from "../../../../../interfaces/oidc/IOidc";
// import DataTable, { IDataTableColumn } from 'react-data-table-component'
import * as FnCajas from "../../tesoreria/CompTesoreria/CajasUsuarios/Funciones";
import { SeleccionarCajaSucursal } from "../../../../selectores";
import * as Funciones from "./CreditoAplicaPago/Funciones";
// import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'

// Icons
import { FaPencilAlt, FaPlus, FaSearch } from "react-icons/fa";

// Custom components
import { Card, Spinner } from "../../../../global";
import { CForm } from "./CreditoAplicaPago/CForm";
// import { FiRefreshCcw } from 'react-icons/fi'
// import { FiltrarDatos } from '../../../../../global/functions'
import ModalWin, { MODAL_TITLE_CLASS } from "../../../../global/ModalWin";

import { iUI } from "../../../../../interfaces/ui/iUI";

type CatalogosType = {
  oidc: IOidc;
  iUI: iUI;
};

const CreditoAplicaPago = (props: CatalogosType) => {
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
  };
  const Datos: any[] = [];
  const DatosMostrar: any[] = [];
  const optSucursales: any[] = [];
  const optCuentasBancarias: any[] = [];
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
    CajaDefault,
    optCuentasBancarias: optCuentasBancarias,
  });

  const fnGetSucursalesCaja = () => {
    FnCajas.FNGetSucursales(props.oidc)
      .then((respuesta: any) => {
        // console.log('respuesta: ', respuesta)

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
    setState((s) => ({
      ...s,
      Form: { ...state.Form, SucursalId: Data.SucursalID, CajaID: Data.CajaID },
      ShowCaja: false,
    }));
  };

  const cbActualizaDatos = (item: any) => {
    // console.log('FechaPago: ', item.FechaPago)
    let hoy = new Date(item.FechaPago);
    hoy.setMinutes(hoy.getMinutes() + hoy.getTimezoneOffset());
    // console.log('hoy: ', hoy)
    setState((s) => ({
      ...s,
      Form: {
        ...state.Form,
        DistribuidorId: item.DistribuidorId,
        //SucursalId: item.SucursalId,
        CuentaId: item.CuentaId,
        Abono: item.Aborrrrrrno,
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
    }));
  };

  React.useEffect(() => {
    if (isMounted.current === true) {
      fnGetSucursalesCaja();
    }

    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line
  }, []);

  return (
    <Card Title="Aplica Pagos">
      <Card.Body>
        <Card.Body.Content>
          <div>
            <CForm
              oidc={props.oidc}
              ProductoID={props.iUI.Producto?.ProductoID as number}
              initialValues={state.Form}
              optSucursales={state.optSucursales}
              cbActualizaDatos={cbActualizaDatos}
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

export default connect(mapStateToProps, mapDispatchToProps)(CreditoAplicaPago);

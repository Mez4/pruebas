import { useState, useEffect, useMemo } from "react";
import { connect } from "react-redux";
import { IEstado } from "../../../../../interfaces/redux/IEstado";
import { IOidc } from "../../../../../interfaces/oidc/IOidc";
import * as FnCajas from "../../tesoreria/CompTesoreria/CajasUsuarios/Funciones";
import { Cajas, SeleccionarCajaSucursal } from "../../../../selectores";
import * as FuncionesTicket from "./CreditoAplicacionTicketMasivos/Funciones";
import * as FuncionesAclaraciones from "./CreditoAplicaPagoAclaraciones/Funciones";
import ModalWin, { MODAL_TITLE_CLASS } from "../../../../global/ModalWin";


// Custom components
import { ActionSelect, Card, CustomFieldDatePicker, CustomFieldText, CustomFieldText2, DataGrid, Spinner } from "../../../../global";
import { getErrorParsed } from "../../../../../global/functions";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import { FilterTemplate } from "../../../../global/FieldDrawer";
import { iUI } from "../../../../../interfaces/ui/iUI";
import { Tooltip } from "@mui/material";
import { FaList } from "react-icons/fa";
import moment from "moment";
import yup from "../../../../../global/yupLocale";

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
    LoadingOpen: false,
    DatosTickets: [],
    SelectedTickets: [],
    AplicandoTickets: false
  });
  const [ShowTickets, setShowTicket] = useState(false);

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

  const fnGetTicketsUsuario = (UsuarioID) => {
    setState((s) => ({ ...s, LoadingOpen: true, DatosTickets: [], SelectedTickets: [] }));
    FuncionesTicket.FNGetTicketsUsuario(props.oidc, { CajaID: state.CFDatos.CajaID, UsuarioID })
      .then((respuesta: any) => {
        setState((s) => ({ ...s, DatosTickets: respuesta }))
        setShowTicket(true);
      })
      .catch((err) => {
        toast.error(`Error al recuperar los tickets: ${getErrorParsed(err)}`);
      })
      .finally(() => {
        setState((s) => ({ ...s, LoadingOpen: false }));
      });
  };

  const fnAplicarTickets = (values) => {
    setState((s) => ({ ...s, AplicandoTickets: true }));
    FuncionesTicket.FNAplicarTicketsUsuario(props.oidc, {
      ...values,
      TicketsJSON: JSON.stringify(state.SelectedTickets)
    })
      .then((respuesta: any) => {
        // setState((s) => ({
        //   ...s, DatosTickets: s.DatosTickets?.filter(({ ID }) => !state.SelectedTickets.includes(ID))
        // }));
        fnGetGestoresCuentas();
        toast.success(respuesta.msj);
        setShowTicket(false);
      })
      .catch((err) => {
        toast.error(`Error al aplicar los tickets: ${getErrorParsed(err)}`);
      }).finally(() =>
        setState((s) => ({ ...s, AplicandoTickets: false }))
      );
  }

  const fnGetGestoresCuentas = () => {
    setState((s) => ({ ...s, Cargando: true, Datos: [], SelectedTickets: [] }));
    FuncionesTicket.FNGetTickets(props.oidc, { CajaID: state.CFDatos.CajaID })
      .then((respuesta: any) => {
        setState((s) => ({ ...s, Datos: respuesta }));
      }).catch(() => {
        toast.error("Error al recuperar los tickets, intentelo nuevamente");
      }).finally(() => {
        setState((s) => ({ ...s, Cargando: false }));
      });
  }

  useEffect(() => {
    fnGetSucursalesCaja();
    fnGetCuentasBancarias();
  }, []);

  const Columns = useMemo(() => {
    if (state.Datos.length == 0)
      return []

    return [...Object.keys(state.Datos[0]).map((v, i) => ({
      selector: v,
      name: v,
      center: true,
      flex: 1,
      minWidth: 120,
    })),
    {
      name: 'Acciones',
      selector: 'actions',
      type: 'actions',
      width: 80,
      getActions: ({ row }) => [
        <>
          <Tooltip title={state.LoadingOpen ? '' : "Ver tickets"}>
            <button
              data-tip
              className="asstext"
              style={{
                margin: ".15em",
                width: "15%",
                height: "40px",
                padding: "0px",
                tableLayout: "fixed",
                borderCollapse: "collapse",
                color: state.LoadingOpen ? 'grey' : ''
              }}
              type="button"
              disabled={state.LoadingOpen}
              onClick={() => fnGetTicketsUsuario(row.UsuarioID)}
            ><FaList /></button>
          </Tooltip>
        </>,
      ],
    }]
  }, [state.Datos])

  const ColumnsTickets = useMemo(() => {
    return [
      { selector: 'ID', name: 'Ticket ID' },
      { selector: 'DistribuidorID', name: 'DistribuidorID' },
      { selector: 'Distribuidor', name: 'Distribuidor' },
      { selector: 'ClienteID', name: 'ClienteID' },
      { selector: 'Cliente', name: 'Cliente' },
      { selector: 'SucursalNombre', name: 'SucursalNombre' },
      { selector: 'Importe', name: 'Importe', valueGetter: (params) => formatter.format(params) },
      {
        selector: 'FechaRegistro', name: 'FechaRegistro',
        valueGetter: (params) => moment(params).format('DD/MM/YYYY hh:mm:ss A')
      },
    ]
  }, [state.Datos])

  return (
    <Card
      Title="Recibo Cajas"
    >
      <Card.Body>
        <Card.Body.Content>
          {state.Error && <span>Error al cargar los datos...</span>}
          {!state.Error && (
            <div>
              <Formik initialValues={state.CFDatos} onSubmit={fnGetGestoresCuentas} >
                {() => (
                  <Form>
                    <FilterTemplate>
                      <div className="text-end column is-12-mobile is-12-tablet is-12-desktop">
                        <button className="btn btn-primary btn-lg" type="submit" >
                          Buscar
                        </button>
                      </div>
                    </FilterTemplate>
                  </Form>
                )}
              </Formik>
              {state.Cargando && <Spinner />}
              {!state.Cargando && (
                <div>
                  <DataGrid data={state.Datos} columns={Columns} />
                </div>
              )}

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
              {ShowTickets && (
                <ModalWin open={ShowTickets} xlarge scrollable>
                  <ModalWin.Header>
                    <h5 className={MODAL_TITLE_CLASS}>Selección de Ticket</h5>
                    <button
                      type="button"
                      title="Cerrar"
                      className="delete"
                      disabled={state.AplicandoTickets}
                      onClick={() => setShowTicket(false)}
                    />
                  </ModalWin.Header>
                  <ModalWin.Body>
                    <Formik
                      onSubmit={fnAplicarTickets}
                      validationSchema={yup.object().shape({
                        CajaID: yup.number().required(),
                        FechaPago: yup.date().required(),
                        Observacion: yup.string().required(),
                        SucursalId: yup.number().required(),
                        // CuentaBancoID: yup.number().required(),
                      })}
                      initialValues={{
                        CajaID: state.CFDatos.CajaID,
                        FechaPago: moment().toDate(),
                        Observacion: '',
                        SucursalId: state.CFDatos.SucursalId,
                        // CuentaBancoID: state.CFDatos.CuentaBancoID,
                      }}
                    >
                      <Form>
                        <div className="columns is-desktop is-tablet columns is-left is-mobile is-multiline">
                          <div className="column is-12-mobile is-12-tablet is-4-desktop">
                            <Cajas
                              name="CajaID"
                              disabled
                              SucursalId={state.CFDatos.SucursalId}
                              oidc={props.oidc}
                            />
                          </div>
                          <div className="column is-12-mobile is-12-tablet is-4-desktop">
                            <CustomFieldDatePicker
                              name={'FechaPago'}
                              label={'Fecha pago'}
                              disabled={false}
                            />
                          </div>
                          {/* <div className="column is-12-mobile is-12-tablet is-4-desktop">
                            <ActionSelect
                              disabled={false}
                              label="Cuenta Bancaria"
                              name="CuentaBancoID"
                              placeholder="Seleccione la cuenta"
                              options={state.optCuentasBancarias}
                              addDefault={true}
                            // valor={values.}
                            // accion={props.cbSucursal}
                            // ref={refSucursal}
                            />
                          </div> */}
                          {/* <div className="column is-12-mobile is-12-tablet is-8-desktop"> */}
                          <div className="column is-12-mobile is-12-tablet is-4-desktop">
                            <CustomFieldText
                              name={'Observacion'}
                              label={'Observacion'}
                              disabled={false}
                            />
                          </div>
                        </div>
                        <DataGrid
                          data={state.DatosTickets}
                          columns={ColumnsTickets}
                          selectedRows={state.SelectedTickets}
                          rowId="ID"
                          onRowSelected={(rows) => setState((s) => ({ ...s, SelectedTickets: rows }))}
                        />
                        <br />
                        <div className="text-end">
                          <button type="submit" disabled={state.AplicandoTickets} className="ms-2 btn btn-success waves-effect waves-light"> {state.AplicandoTickets ? 'Cargando...' : 'Aplicar tickets'}</button>
                        </div>
                      </Form>
                    </Formik>
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

import React, { useEffect, useState } from "react";
import DataTable, { IDataTableColumn } from "react-data-table-component";
import { connect } from "react-redux";
import { IEstado } from "../../../../../interfaces/redux/IEstado";
import { IOidc } from "../../../../../interfaces/oidc/IOidc";
import ModalWin, { MODAL_TITLE_CLASS } from "../../../../global/ModalWin";
import * as Funciones from "./CatalogoEncargados/Funciones";
import { CForm } from './CatalogoEncargados/CForm'

//import * as FnCatTipoDocumento from '../../catalogos/CompCatalogos/CatalogoDirectores/Funciones'

// Icons
import { FaPencilAlt, FaPlus, FaSearch, FaCircle } from "react-icons/fa";

// Custom components
import { Card, Spinner } from "../../../../global";
import { CFormConfirmar } from "./CatalogoEncargados/CFormConfirmar";
import { FiRefreshCcw } from "react-icons/fi";
import { FiltrarDatos } from "../../../../../global/functions";
import { PropsNotForwarded } from "../../../../../node_modules_local/react-csv/lib/metaProps";
import { toast } from "react-toastify";
import { stat } from "fs";
import { iUI } from "../../../../../interfaces/ui/iUI";

type CatalogosType = {
  oidc: IOidc;
  ui: iUI,
};

const CatalogoEncargados = (props: CatalogosType) => {

  // console.log(props.ui)
  // Controll our mounted state
  let isMounted = React.useRef(true);

  const DatosDefecto = { DirectorMesaCobranzaID: 0, PersonaID: 0, NombreCompleto: '', Activo: true, UsuarioID: 0 };
  const Datos: any[] = [];
  const DatosMostrar: any[] = [];
  const optEncargado: any[] = [];
  const optPersonas: any[] = [];
  const [valido, setValido] = useState(false)
  const [state, setState] = React.useState({
    Datos,
    DatosMostrar,
    optEncargado,
    optPersonas,
    Filtro: "",
    Cargando: false,
    Error: false,
    Form: {
      Mostrar: false,
      MostrarE: false,
      Datos: DatosDefecto,
      Id: undefined,

    },
  });



  const validarUsuario = () => {
    Funciones.FNValidacionValidacionAltaEncargados(props.oidc)
      .then((respuesta: any) => {
        console.log('Esta es la respuesta: ', respuesta);
        setValido(true);
        setState((s) => ({ ...s, Cargando: false }));

      })
      .catch(() => {

        console.log('No es director');
        if (isMounted.current === true) {
          setState((s) => ({ ...s, Cargando: false }));

        }
        //   setState((s) => ({ ...s, Cargando: false, Error: true }));
        toast.error('No es un director')
      })
  }

  //Falta por terminar
  const FNGetLocal = () => {

    setState((s) => ({ ...s, Cargando: true }));

    Funciones.FNGet(props.oidc)
      .then((respuesta: any) => {
        if (isMounted.current == true) {
          setState((s) => ({
            ...s,
            Cargando: false,
            Error: false,
            Datos: respuesta,
          }));
        }

      })

      .catch(() => {

        if (isMounted.current === true) {
          setState((s) => ({ ...s, Cargando: false, Error: true, Datos: [] }));

        }
      });

  };

  const FnGetPersonas = () => {

    setState((s) => ({ ...s }));
    Funciones.FNGet(props.oidc)
      .then((respuesta: any) => {
        var Encargados = respuesta.map((valor: any) => {
          var obj = { value: valor.PersonaID, label: valor.NombreCompleto, Activo: valor.Activo };
          return obj;

        });


        setState((s) => ({ ...s, optPersonas: Encargados }));
        setState((s) => ({ ...s, optPersonas: [] }));
      });
  };


  const FnGetEncargadoVista = () => {

    setState((s) => ({ ...s }));
    Funciones.FnGetEncargados(props.oidc)
      .then((respuesta: any) => {
        var sucursales = respuesta.map((valor: any) => {
          var obj = { value: valor.PersonaID, label: valor.NombreCompleto, Activo: valor.Activo };
          return obj;

        });


        setState((s) => ({ ...s, optEncargado: sucursales }));
      })
      .catch(() => {
        setState((s) => ({ ...s, optEncargado: [] }));
      });
  };

  const Columns = React.useMemo(() => {
    let colRet: IDataTableColumn[] = [
      {
        name: "Id",
        selector: "DirectorMesaCobranzaID",
        sortable: true,
        // width:'30%'
      },
      {
        name: "Nombre Completo",
        selector: "NombreCompleto",
        sortable: true,
        // center: true,
        cell: (props) => <span>{props.NombreCompleto}</span>,
      },
      {
        name: "Activo",
        selector: "Activo",
        sortable: true,
        center: true,
        cell: (props) => (
          <span>
            {props.Activo ? (
              <FaCircle color="green" title="Activo" />
            ) : (
              <FaCircle color="red" title="Inactivo" />
            )}
          </span>
        ),
      },

      {
        name: 'Acciones',
        selector: "Acciones",
        sortable: true,
        center: true,
        cell: (props) => (
          <button
            className="asstext"
            type={"button"}
            onClick={() => {
              setState((s) => ({
                ...s,
                Form: {
                  ...state.Form,
                  MostrarE: true,
                  Datos: {
                    DirectorMesaCobranzaID: props.DirectorMesaCobranzaID,
                    Activo: props.Activo, NombreCompleto: props.NombreCompleto, PersonaID: props.PersonaID, UsuarioID: props.UsuarioID
                  },
                  Id: props.DirectorMesaCobranzaID,
                }
              })
              )
            }}
          >
            <FaPencilAlt />
          </button>
        )
      },
    ];
    return colRet;
  }, [state.Form]);

  // Use effect

  useEffect(() => {
    console.log('Primero')
    FNGetLocal();
    FnGetPersonas();
    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line
  }, [props.oidc]);

  useEffect(() => {
    console.log('Segundo')
    validarUsuario();
    return () => {
      isMounted.current = false;
    };
  }, [props.oidc])
  // React.useEffect(() => {
  //   fnValidacion();

  //   return () => {
  //     isMounted.current = false;
  //   };
  // }, []);


  // On use effect
  React.useEffect(() => {
    setState((s) => ({
      ...s,
      DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro),
    }));
    // eslint-disable-next-line
  }, [state.Datos, state.Filtro]);

  // /** funcion Callback al agregar un item */
  const cbAgregar = (item: any) => {
    setState({
      ...state,
      Datos: [...state.Datos, item],
      Form: {
        ...state.Form,
        Mostrar: false,
        MostrarE: false,
        Datos: { DirectorMesaCobranzaID: 0, PersonaID: 0, NombreCompleto: '', Activo: false, UsuarioID: 0 },
      },
    });
  };

  // /** funcion Callback al actualizar un item */
  const cbActualizar = (item: any) => {
    // console.log(`Item wg`)
    // console.log(item)

    setState({
      ...state,
      Datos: state.Datos.map((Dato) =>
        Dato.DirectorMesaCobranzaID === item.DirectorMesaCobranzaID
          ? item
          : Dato
      ),
      Form: {
        ...state.Form,
        Mostrar: false,
        MostrarE: false,
        Datos: { DirectorMesaCobranzaID: 0, PersonaID: 0, NombreCompleto: '', Activo: false, UsuarioID: 0 },
        // Datos: { DirectorMesaCobranzaID: 0, Activo: false },
      },

    });
  }

  /** funcion para cancelar la forma */
  const fnCancelar = () =>
    setState({ ...state, Form: { ...state.Form, Mostrar: false } });

  const fnCFormConfirmar = () =>
    setState({ ...state, Form: { ...state.Form, Mostrar: true } });

  const fnCancelarME = () =>
    setState({ ...state, Form: { ...state.Form, MostrarE: false } })

  // const fnValidacion = () => {
  //   Funciones.FNValidacionValidacionAltaEncargados(props.oidc)
  //     .then((respuesta: any) => {
  //       setState({
  //         ...state,
  //         Cargando: false,
  //         Form: { Mostrar: false, MostrarE: false, Datos: DatosDefecto, Id: undefined,  valido:true,  },
  //       });
  //     })
  //     .catch((error: any) => {
  //       setState({
  //         ...state,
  //         Cargando: false,
  //       });
  //       if (error.response) toast.error(`Response : ${error.response.data}`);
  //       else if (error.request) toast.error(`Request ${error}`);
  //       else toast.error(`${error}`);

  //     });
  // }; 

  return (
    <div className="row">
      <div className="col-12">
        <Card Title="ENCARGADOS DE COBRANZA">
          <Card.Body>
            <Card.Body.Content>
              {state.Cargando && <Spinner />}
              {state.Error && <span>Error al cargar los datos...</span>}
              {!state.Cargando && !state.Error && (
                <div>
                  <DataTable
                    subHeader
                    subHeaderComponent={
                      <div className="row">
                        <div className="col-sm-12">
                          <div className="input-group mb-3">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Buscar Encargado"
                              value={state.Filtro}
                              onChange={(e) =>
                                setState((s) => ({
                                  ...s,
                                  Filtro: e.target.value,
                                }))
                              }
                            />
                            <span className="input-group-text">
                              <FaSearch />{" "}
                            </span>

                            {valido &&
                              <button
                                className="btn btn-outline-secondary"
                                type="button"
                                onClick={() => setState({
                                  ...state,
                                  Form: { Mostrar: true, MostrarE: false, Datos: DatosDefecto, Id: undefined },
                                })}
                              >
                                <FaPlus />
                              </button>
                            }

                            <button
                              className="btn btn-outline-secondary"
                              type="button"
                              onClick={() => FNGetLocal()}
                            >
                              <FiRefreshCcw />
                            </button>
                          </div>
                        </div>
                      </div>
                    }
                    data={state.DatosMostrar}
                    striped
                    pagination
                    dense
                    noHeader
                    responsive
                    keyField={"DirectorMesaCobranzaID"}
                    defaultSortField={"DirectorMesaCobranzaID"}
                    columns={Columns}
                  />
                  <ModalWin open={state.Form.Mostrar} center large>
                    <ModalWin.Header>
                      <h5 className={MODAL_TITLE_CLASS}>AGREGAR ENCARGADO</h5>
                    </ModalWin.Header>
                    <ModalWin.Body>
                      {
                        <CFormConfirmar
                          oidc={props.oidc}
                          Id={state.Form.Id}
                          initialValues={state.Form.Datos}
                          optEncargado={state.optPersonas}
                          cbGuardar={cbAgregar}
                          fnCancelar={fnCancelar}
                          cbActualizar={cbActualizar}
                          fnCFormConfirmar={fnCFormConfirmar}
                          FNGetLocal={FNGetLocal}
                        />
                      }
                    </ModalWin.Body>
                  </ModalWin>

                  <ModalWin open={state.Form.MostrarE} center>
                    <ModalWin.Header>
                      <h5 className={MODAL_TITLE_CLASS}>EDITAR ENCARGADO</h5>
                    </ModalWin.Header>
                    <ModalWin.Body>
                      {
                        <CForm
                          oidc={props.oidc}
                          Id={state.Form.Id}
                          optEncargado={state.optPersonas}
                          initialValues={state.Form.Datos}
                          cbActualizar={cbActualizar}
                          cbGuardar={cbAgregar}
                          fnCancelar={fnCancelarME}
                          fnCerrarCformConfirmar={fnCancelarME}
                        />
                      }
                    </ModalWin.Body>
                  </ModalWin>

                </div>
              )}
            </Card.Body.Content>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

const mapStateToProps = (state: IEstado) => ({
  oidc: state.oidc,
  ui: state.UI
});

const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(CatalogoEncargados);

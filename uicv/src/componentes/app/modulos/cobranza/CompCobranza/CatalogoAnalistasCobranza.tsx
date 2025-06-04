import React from "react";
import { IOidc } from "../../../../../interfaces/oidc/IOidc";
import ModalWin, { MODAL_TITLE_CLASS } from "../../../../global/ModalWin";
import { connect } from "react-redux";
import { IEstado } from "../../../../../interfaces/redux/IEstado";
import { Card, Spinner } from "../../../../global";
import { FiRefreshCcw } from "react-icons/fi";
import DataTable, { IDataTableColumn } from "react-data-table-component";
import { Col } from "react-grid-system";
// Icons
import { FaPencilAlt, FaPlus, FaSearch, FaCircle } from "react-icons/fa";
import * as Funciones from "./CatalogoAnalistaCobranza/Funciones";
import { truncate } from "fs";
import { toast } from "react-toastify";
import { Modal } from "react-native";
import { CForm } from "./CatalogoAnalistaCobranza/CForm";

type CatalogosType = {
  oidc: IOidc;
};

const CatalogoAnalistasCobranza = (props: CatalogosType) => {
  let isMounted = React.useRef(true);

  const DatosDefecto = {
    PersonaID: 0,
    NombreCompleto: "",
    MesaCobranzaID: 0,
    mesaCobranza: "",
    Activo: true,
  };
  const Datos: any[] = [];
  const DatosMostrar: any[] = [];
  const optProdMesa: any[] = [];
  const optPersonas: any[] = [];

  const [state, setState] = React.useState({
    Datos,
    DatosMostrar,
    optPersonas,
    optProdMesa,
    Filtro: "",
    Cargando: false, // cambiar a true despues de o Obtener datos de la DB
    Error: false,
    Form: {
      Mostrar: false,
      Datos: DatosDefecto,
      Id: undefined,
    },
  });

  // funciones
  const FNGetLocal = () => {
    setState((s) => ({ ...s, Cargando: true }));
    Funciones.FNGet(props.oidc)
      .then((respuesta: any) => {
        if (isMounted.current === true) {
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

  const fnCancelar = () =>
    setState({ ...state, Form: { ...state.Form, Mostrar: false } });

  const fnValidacion = () => {
    Funciones.FNValidacionValidacionAltaEncargados(props.oidc)
      .then((respuesta: any) => {
        setState({
          ...state,
          Form: { Mostrar: true, Datos: DatosDefecto, Id: undefined },
        });
      })
      .catch((error: any) => {
        if (error.response) toast.error(`Response : ${error.response.data}`);
        else if (error.request) toast.error(`Request ${error}`);
        else toast.error(`${error}`);
      });
  };

  const fnGetMesaC = () => {
    setState((s) => ({ ...s }));
    Funciones.FnGetMesaCobranza(props.oidc)
      .then((respuesta: any) => {
        var sucursales = respuesta.map((valor: any) => {
          var obj = {
            values: valor.MesaCobranzaID,
            label: valor.MesaCobranzaDesc,
          };
          return obj;
        });
        setState((s) => ({ ...s, optProdMesa: sucursales }));
      })
      .catch(() => {
        setState((s) => ({ ...s, optProdMesa: [] }));
      });
  };

  //use effect
  React.useEffect(() => {
    fnGetMesaC();
    FNGetLocal();
    return () => {
      isMounted.current = false;
    };
  }, []);

  //   Columnas
  const Columns = React.useMemo(() => {
    let colRet: IDataTableColumn[] = [
      {
        name: "Id",
        selector: "PersonaID",
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
        name: "Mesa Cobranza",
        selector: "mesaCobranza",
        sortable: true,
      },
    ];
    return colRet;
  }, [state.Form]);

  return (
    <>
      <div className="row">
        <div className="col-12">
          <Card Title="ANALISTAS DE COBRANZA">
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
                                placeholder="Buscar Analista"
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
                              <button
                                className="btn btn-outline-secondary"
                                type="button"
                                onClick={() => fnValidacion()}
                              >
                                <FaPlus />
                              </button>
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
                      keyField={""}
                      defaultSortField={""}
                      columns={Columns}
                    />
                    <ModalWin open={state.Form.Mostrar} center>
                      <ModalWin.Header>
                        <h5 className={MODAL_TITLE_CLASS}>
                          AGREGRAR ANALISTA
                        </h5>
                      </ModalWin.Header>
                      <ModalWin.Body>
                        {
                          <CForm
                            oidc={props.oidc}
                            Id={state.Form.Id}
                            initialValues={state.Form.Datos}
                            optPersonas={state.optPersonas}
                            optProdMesa={state.optProdMesa}
                            fnCancelar={fnCancelar}
                          ></CForm>
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
    </>
  );
};

const mapStateToProps = (state: IEstado) => ({
  oidc: state.oidc,
});

const mapDispatchToProps = {};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CatalogoAnalistasCobranza);

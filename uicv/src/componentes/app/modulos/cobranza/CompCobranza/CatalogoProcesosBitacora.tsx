import React from "react";
import DataTable, { IDataTableColumn } from "react-data-table-component";
import { connect } from "react-redux";
import { IEstado } from "../../../../../interfaces/redux/IEstado";
import { IOidc } from "../../../../../interfaces/oidc/IOidc";
import { Card, ModalWin, Spinner } from "../../../../global";
import { FiltrarDatos } from "../../../../../global/functions";
import * as Funciones from "./Bitacora/Funciones";
import { FiRefreshCcw } from "react-icons/fi";
import { CForm } from "./Bitacora/CForm";

// Icons
import { FaPencilAlt, FaPlus, FaSearch, FaCircle } from "react-icons/fa";
import { MODAL_TITLE_CLASS } from "../../../../global/ModalWin";
import ReactTooltip from "react-tooltip";

type CatalogosType = {
  oidc: IOidc;
};

const CatalogoAcciones = (props: CatalogosType) => {
  let isMounted = React.useRef(true);

  const DatosDefecto = {
    ProcesoId: 0,
    Clave: "",
    Descripcion: "",
    Activo: true,
  };
  const Datos: any[] = [];
  const DatosMostrar: any[] = [];
  const [state, setState] = React.useState({
    Datos,
    DatosMostrar,
    Filtro: "",
    Cargando: true,
    Error: false,
    Form: {
      Mostrar: false,
      Datos: DatosDefecto,
      Id: undefined,
    },
  });

  // obtenemos la consulta inicial de as Acciones
  const FNGetLocal = () => {
    setState((s) => ({ ...s, Cargando: true }));
    Funciones.FNGetProcesos(props.oidc)
      .then((respuesta: any) => {
        if (isMounted.current === true) {
          console.log(`respuesta FNGetActions`);
          console.log(respuesta);
          setState((s) => ({
            ...s,
            Cargando: false,
            Error: false,
            Datos: respuesta,
          }));
        }
      })
      .catch((error) => {
        console.log(`FNGetActions: `, error);
        if (isMounted.current === true) {
          setState((s) => ({ ...s, Cargando: false, Error: true, Datos: [] }));
        }
      });
  };
  const cursorStyle = {
    cursor: "crosshair",
  };

  const Columns = React.useMemo(() => {
    let colRet: IDataTableColumn[] = [
      {
        name: "Id",
        selector: "ProcesoId",
        sortable: true,
        width: "10%",
        cell: (props) => (
          <>
            <label
              data-tip
              data-for={`A_${props.ProcesoId}`}
              className="text-center"
            >
              {props.ProcesoId}
            </label>
            <ReactTooltip
              id={`A_${props.ProcesoId}`}
              type="info"
              effect="solid"
            >
              {props.ProcesoId}
            </ReactTooltip>
          </>
        ),
      },
      {
        name: "Clave",
        selector: "Clave",
        width: "10%",
        sortable: true,
      },
      {
        name: "Descripcion",
        selector: "Descripcion",
        width: "60",
        sortable: true,
      },
      {
        name: "Activo",
        selector: "Activo",
        sortable: true,
        width: "10%",
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
        name: "Acciones",
        sortable: false,
        center: true,
        width: "10%",
        cell: (props) => (
          <button
            className="asstext"
            type={"button"}
            onClick={() => {
              setState((s) => ({
                ...s,
                Form: {
                  ...state.Form,
                  Mostrar: true,
                  Datos: {
                    ProcesoId: props.ProcesoId,
                    Clave: props.Clave,
                    Descripcion: props.Descripcion,
                    Activo: props.Activo,
                  },
                  Id: props.ProcesoId,
                },
              }));
            }}
          >
            <FaPencilAlt />
          </button>
        ),
      },
    ];
    return colRet;
  }, [state.Form]);

  // useEffect
  React.useEffect(() => {
    FNGetLocal();
    return () => {
      isMounted.current = false;
    };
  }, []);

  React.useEffect(() => {
    setState((s) => ({
      ...s,
      DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro),
    }));
    // eslint-disable-next-line
  }, [state.Datos, state.Filtro]);

  /** funcion para cancelar la forma */
  const fnCancelar = () =>
    setState({ ...state, Form: { ...state.Form, Mostrar: false } });

  /** CallBack´s **/
  const cbAgregarAcc = (item: any) => {
    setState({
      ...state,
      Datos: [...state.Datos, item],
      Form: {
        ...state.Form,
        Mostrar: false,
        Datos: { ProcesoId: 0, Clave: "", Descripcion: "", Activo: true },
      },
    });
  };

  const cbActualizar = (item: any) => {
    setState({
      ...state,
      Datos: state.Datos.map((Dato) =>
        Dato.ProcesoId === item.ProcesoId ? item : Dato
      ),
      Form: {
        ...state.Form,
        Mostrar: false,
        Datos: { ProcesoId: 0, Clave: "", Descripcion: "", Activo: false },
      },
    });
  };

  return (
    <div className="row">
      <div className="col-12">
        <Card Title="PROCESOS BITACORA">
          <Card.Body>
            <Card.Body.Content>
              {state.Cargando && <Spinner />}
              {state.Error && <span>Error al cargar los datos.</span>}
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
                              placeholder="Buscar"
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
                              onClick={() =>
                                setState({
                                  ...state,
                                  Form: {
                                    Mostrar: true,
                                    Datos: DatosDefecto,
                                    Id: undefined,
                                  },
                                })
                              }
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
                    keyField={"ProcesoId"}
                    defaultSortField={"ProcesoId"}
                    columns={Columns}
                  />
                  <ModalWin open={state.Form.Mostrar} center>
                    <ModalWin.Header>
                      <h4 className={MODAL_TITLE_CLASS}>
                        Agregar Proceso de Bitacora
                      </h4>
                    </ModalWin.Header>
                    <ModalWin.Body>
                      {
                        <CForm
                          oidc={props.oidc}
                          initialValues={state.Form.Datos}
                          Id={state.Form.Id}
                          cbActualizar={cbActualizar}
                          cbGuardar={cbAgregarAcc}
                          fnCancelar={fnCancelar}
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
});

const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(CatalogoAcciones);

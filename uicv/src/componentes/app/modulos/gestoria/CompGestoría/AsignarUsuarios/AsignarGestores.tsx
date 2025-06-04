import React from "react";
import axios from "axios";
import {
  FaExclamationCircle,
  FaPencilAlt,
  FaPlus,
  FaSearch,
  FaShare,
} from "react-icons/fa";
import {
  GenerarCabeceraOIDC,
  GetServerUrl,
} from "../../../../../../global/variables";
import { IOidc } from "../../../../../../interfaces/oidc/IOidc";
import * as Funciones from "./Funciones";

// ························································
// Interfaces
// ························································
import { DBConfia_Creditos } from "../../../../../../interfaces_db/DBConfia/Creditos";
import { DBConfia_Seguridad } from "./../../../../../../interfaces_db/DBConfia/Seguridad";
import { ModalWin, Spinner } from "./../../../../../global";
import { BsTag } from "react-icons/bs";
import DataTable, { IDataTableColumn } from "react-data-table-component";
import { FiRefreshCcw } from "react-icons/fi";
import { Tooltip } from "@mui/material";
import { MODAL_TITLE_CLASS } from "../../../../../global/ModalWin";
import { CForm } from "./CForm";
import { FiltrarDatos } from "../../../../../../global/functions";

/**
 * Componente para los permisos generales
 * @returns {React.ReactElement}
 */
type CatalogosType = {
  oidc: IOidc;
};
const AsignarGestores = (props: CatalogosType) => {
  // Definimos el tipo de nuestro estado
  type tEstadoCarga = {
    cargando: boolean;
    productos: DBConfia_Creditos.IProductosVW[];
    producto: DBConfia_Creditos.IProductosVW | null;
  };

  // Definimos el estado
  const [estado, definirEstado] = React.useState<tEstadoCarga>({
    cargando: true,
    productos: [],
    producto: null,
  });
  const DatosDefecto = {
    RegionalID: 0,
    ZonalID: 0,
    ZonalNombre: "",
    RegionalNombre: "",
    GestorID: 0,
    GestorNombre: "",
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

  //#region Declare the FNGet
  const FNGetLocal = () => {
    setState((s) => ({ ...s, Cargando: true }));
    Funciones.FNGetGestores(props.oidc)
      .then((respuesta: any) => {
        // if (isMounted.current === true) {
        setState((s) => ({
          ...s,
          Cargando: false,
          Error: false,
          DatosMostrar: respuesta,
          Datos: respuesta,
        }));
        console.log("Datos2", respuesta);
        // }
      })
      .catch(() => {
        // if (isMounted.current === true) {
        setState((s) => ({
          ...s,
          Cargando: false,
          Error: true,
          DatosMostrar: [],
        }));
        // }
      });
  };

  /** funcion Callback al agregar un item */
  const cbAgregar = (item: any) =>
    setState({
      ...state,
      Datos: [...state.Datos, item],
      Form: {
        ...state.Form,
        Mostrar: false,
        Datos: {
          RegionalID: 0,
          ZonalID: 0,
          ZonalNombre: "",
          RegionalNombre: "",
          GestorID: 0,
          GestorNombre: "",
        },
      },
    });

  /** funcion Callback al actualizar un item */
  const cbActualizar = (item: any) =>
    setState({
      ...state,
      Datos: state.Datos.map((Dato) =>
        Dato.CodigoID === item.CodigoID ? item : Dato
      ),
      Form: {
        ...state.Form,
        Mostrar: false,
        Datos: {
          RegionalID: 0,
          ZonalID: 0,
          ZonalNombre: "",
          RegionalNombre: "",
          GestorID: 0,
          GestorNombre: "",
        },
      },
    });

  /** funcion para cancelar la forma */
  const fnCancelar = () =>
    setState({ ...state, Form: { ...state.Form, Mostrar: false } });

  React.useEffect(() => {
    setState((s) => ({
      ...s,
      DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro),
    }));
    // eslint-disable-next-line
  }, [state.Datos, state.Filtro]);

  const Columns = React.useMemo(() => {
    let colRet: IDataTableColumn[] = [
      { name: "ID", selector: "GestorID", sortable: true, wrap: true },
      {
        name: "Nombre Gestor",
        selector: "GestorNombre",
        sortable: true,
        wrap: true,
      },
      {
        name: "Zonal",
        selector: "ZonalNombre",
        sortable: true,
        wrap: true,
        cell: (props) => (
          <span>
            {!props.ZonalID
              ? "SIN ASIGNAR"
              : props.ZonalID + "-" + props.ZonalNombre}
          </span>
        ),
      },
      {
        name: "Acciones",
        sortable: false,
        wrap: true,
        cell: (row: any) => {
          return (
            <button
              className="asstext"
              type={"button"}
              onClick={() => {
                setState((s) => ({
                  ...s,
                  Form: {
                    ...s.Form,
                    Mostrar: true,
                    Datos: row,
                    Id: row.ZonalDetalleID,
                  },
                }));
              }}
            >
              <FaPencilAlt />
            </button>
          );
        },
      },
    ];
    return colRet;
  }, []);

  // Get our local data
  React.useEffect(() => {
    FNGetLocal();
  }, []);

  return (
    <div>
      {state.Cargando && (
        <div className="text-center">
          <h4>Obteniendo los Datos</h4>
          <Spinner />
          <p className="mt-2">Espere...</p>
        </div>
      )}

      {!state.Cargando && ( //estado.productos.length > 0 &&
        <>
          {/* <span> <BsTag size={16} />&nbsp;<strong>Productos</strong></span>
                    <hr className="mb-3 mt-0" />

                    <select
                        onChange={((v) => {
                            definirEstado(e => ({ ...e, producto: v.target.value === 'null' ? null : estado.productos.find(p => p.ProductoID === parseInt(v.target.value)) as DBConfia_Creditos.IProductosVW }))
                        })
                        }
                        value={estado.producto === null ? 'null' : `${estado.producto.ProductoID}`}
                        className="form-select my-2"

                    >
                        <option value={'null'}>Seleccionar</option>
                        {estado.productos.map(p =>
                            <option value={`${p.ProductoID}`} key={p.ProductoID}>{p.EmpresaNombre}, {p.Producto}</option>
                        )}

                    </select> */}
          <DataTable
            subHeader
            subHeaderComponent={
              <div className="row">
                <div className="col-sm-12">
                  <div className="input-group mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Buscar Gestor"
                      value={state.Filtro}
                      onChange={(e) =>
                        setState((s) => ({ ...s, Filtro: e.target.value }))
                      }
                    />
                    <span className="input-group-text">
                      <FaSearch />{" "}
                    </span>
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
            keyField={"ZonalID"}
            defaultSortField={"ZonalID"}
            columns={Columns}
          />
          <ModalWin large={true} center={true} open={state.Form.Mostrar}>
            <ModalWin.Header>
              <h5 className={MODAL_TITLE_CLASS}>
                {state.Form.Id ? "Editar Regional" : "Asignar Regional"}
              </h5>
            </ModalWin.Header>
            <ModalWin.Body>
              <CForm
                oidc={props.oidc}
                initialValues={state.Form.Datos}
                Id={state.Form.Id}
                cbActualizar={cbActualizar}
                cbGuardar={cbAgregar}
                fnCancelar={fnCancelar}
              />
            </ModalWin.Body>
          </ModalWin>
        </>
      )}
    </div>
  );
};
export default AsignarGestores;

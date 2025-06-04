import React, { useContext } from "react";
import { connect } from "react-redux";
import { IEstado } from "../../../../../interfaces/redux/IEstado";
import { IOidc } from "../../../../../interfaces/oidc/IOidc";
import DataTable, { IDataTableColumn } from "react-data-table-component";
// import PersonasDatosBancarios from '../../general/CompGeneral/PersonasDatosBancarios'
// import Credito from './Credito'
// import * as Funciones from './CreditoVale/Funciones'
import * as FnArticulos from "./CreditoArticulos/Funciones";
import * as FnVariablesGlobales from "../../catalogos/CompCatalogos/CatalogoVariableGlobal/Funciones";
import * as FnSucursales from "../../general/CompGeneral/Sucursal/Funciones";
import ModalWin, { MODAL_TITLE_CLASS } from "../../../../global/ModalWin";

// Icons
import {
  FaPencilAlt,
  FaPlus,
  FaSearch,
  FaCreditCard,
  FaWindowClose,
  FaUserPlus,
  FaCashRegister,
  FaShoppingCart,
} from "react-icons/fa";

// Custom components
import { Card, Spinner } from "../../../../global";
import { CForm } from "./CreditoArticulos/CForm";
import { FiRefreshCcw } from "react-icons/fi";
import { FiltrarDatos } from "../../../../../global/functions";
import { toast } from "react-toastify";
import { stat } from "fs";
import { CtxCreditoTiendita } from "./CreditoTienditaSocia/CreditoTienditaContext";

type CatalogosType = {
  oidc: IOidc;
  SucursalId: number;
  cbArticles(values: any): any;
  ArticulosIds: any;
  Articles: any[];
  cbSucursal(values: any): any;
};

const CreditoArticulos = (props: CatalogosType) => {
  let isMounted = React.useRef(true);
  // console.log('SucursalId', props.SucursalId)
  // const ArticulosIds: [] = []
  const DatosDefecto = {
    ArticulosIds: props.ArticulosIds,
  };
  const Datos: any[] = [];
  const DatosMostrar: any[] = [];
  // const Articulos: any[] = []
  const optArticulos: any[] = [];
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
    optArticulos,
    Articulos: [],
    API_ConfiaShop: "",
    Sucursal: {
      id_empresa: 0,
      id_sucursal: 0,
      id_origen: "",
      sistema: "",
    },
    // CreditoID: 0
  });

  // const FNGetLocal = () => {

  //     setState(s => ({ ...s, Cargando: true }))
  // Funciones.FNGet(props.Seguridad)
  //     .then((respuesta: any) => {
  //         if (isMounted.current === true) {
  //             setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta }))
  //         }
  //     })
  //     .catch(() => {
  //         if (isMounted.current === true) {
  //             setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
  //         }
  //     })
  // }

  const FNGetVariablesGlobales = () => {
    let datos = { Id: 37, varName: "API_ConfiaShop" };
    FnVariablesGlobales.FNGet(props.oidc, datos)
      .then((respuesta: any) => {
        // console.log('respuesta FnVariablesGlobales: ', respuesta)
        setState((s) => ({ ...s, API_ConfiaShop: respuesta.varValue }));
      })
      .catch(() => {
        setState((s) => ({ ...s, API_ConfiaShop: "" }));
      });
  };

  const fnGetArticulos = (SucursalID?: string) => {
    // console.log('SucursalID: ', SucursalID)
    // console.log('DETONADO , API_ConfiaShop: ', state.API_ConfiaShop)
    setState((s) => ({ ...s, Cargando: true }));
    if (SucursalID)
      FnArticulos.FNGet2(props.oidc, SucursalID)
        .then((respuesta: any) => {
          /* console.log('respuesta art: ', respuesta) */

          var articulos = respuesta.map((valor: any) => {
            var obj = {
              value: valor.id_sku,
              label: `${valor.marca} ${valor.estilo} ${valor.color} sku: ${valor.id_sku} código: ${valor.codigo_barras}`,
            };
            return obj;
          });

          let Articulos = respuesta.map((valor: any) => {
            var obj = {
              id: valor.id_sku,
              sku: valor.id_sku,
              codigo: valor.codigo_barras,
              desc: `${valor.marca} ${valor.estilo} ${valor.color}`,
              price: valor.precio,
              qty: 1,
              stock: valor.existencia,
              imagen: valor.imagen,
              id_estructura: valor.id_estructura,
              descuento: valor.descuento,
            };
            return obj;
          });
          setState((s) => ({
            ...s,
            optArticulos: articulos,
            Articulos,
            Cargando: false,
          }));
        })
        .catch(() => {
          setState((s) => ({
            ...s,
            optArticulos: [],
            Articulos: [],
            Cargando: false,
          }));
        });
  };
  // console.log('sucursaaaaaal', props.SucursalId)
  React.useEffect(() => {
    if (isMounted.current === true) {
      FNGetVariablesGlobales();

      FnSucursales.FNGetById(props.oidc, props.SucursalId)
        .then((respuesta: any) => {
          let sistema: Number;
          console.log("respuesta: ", respuesta);
          switch (respuesta.sistema) {
            case "VR":
              sistema = 1;
              break;
            case "GYT":
              sistema = 4;
              break;
            case "S3":
              sistema = 7;
              break;
            case "VE":
              sistema = 13;
              break;
            case "LYT":
              sistema = 15;
              break;
            case "CV":
              sistema = 19;
              break;
            case "PS7":
              sistema = 20;
              break;
            case "PS9":
              sistema = 21;
              break;
            default:
              sistema = 0;
              break;
          }

          setState((s) => ({
            ...s,
            Sucursal: {
              id_empresa: respuesta.id_empresa,
              id_sucursal: respuesta.id_sucursal,
              id_origen: `${respuesta.id_origen}|${sistema}`,
              sistema: respuesta.sistema,
            },
          }));
        })
        .catch(() => {
          setState((s) => ({
            ...s,
            Sucursal: {
              id_empresa: 0,
              id_sucursal: 0,
              id_origen: "",
              sistema: "",
            },
          }));
        });

      // fnGetArticulos(props.SucursalId)
      // }
      // return () => {
      //     isMounted.current = false
      // }
    }
    // eslint-disable-next-line
  }, [props.SucursalId]);

  React.useEffect(() => {
    console.log("Sucursal para ConfiaShop: ", state.Sucursal);
    props.cbSucursal(state.Sucursal);
    fnGetArticulos(state.Sucursal.id_origen);
  }, [state.Sucursal]);

  // React.useEffect(() => {
  //     fnGetArticulos(String(props.SucursalId))
  // console.log('API_ConfiaShop: ', state.API_ConfiaShop)
  // }, [state.API_ConfiaShop])

  /** funcion Callback al agregar un item */
  const cbAgregar = (res: any) =>
    setState((s) => ({ ...s, ShowCredito: true, CreditoID: res.CreditoId }));

  /** funcion Callback al actualizar un item */
  const cbActualizar = (item: any) =>
    setState((s) => ({
      ...s,
      Datos: state.Datos.map((Dato) =>
        Dato.ProductoID === item.ProductoID &&
          Dato.SucursalId === item.SucursalId
          ? item
          : Dato
      ),
      Form: {
        ...state.Form,
        Mostrar: false,
        Datos: DatosDefecto,
      },
      isUpdate: false,
    }));

  /** funcion para cancelar la forma */
  const fnCancelar = () =>
    setState((s) => ({
      ...s,
      Form: { ...state.Form, Mostrar: false, Datos: DatosDefecto },
      isUpdate: false,
    }));

  return (
    <Card>
      <Card.Body clssName={"CardCartForm"}>
        <Card.Body.Content>
          {state.Cargando && <Spinner />}
          <div className="d-flex flex-column">
            {!state.Cargando && (
              <CForm
                oidc={props.oidc}
                // SucursalId={props.SucursalId}
                initialValues={state.Form.Datos}
                optArticulos={state.optArticulos}
                // cbActualizar={cbActualizar}
                cbArticles={props.cbArticles}
                fnCancelar={fnCancelar}
                articulos={state.Articulos}
                articles={props.Articles}
              />
            )}
          </div>
        </Card.Body.Content>
      </Card.Body>
    </Card>
  );
};

const mapStateToProps = (state: IEstado) => ({
  oidc: state.oidc,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(CreditoArticulos);

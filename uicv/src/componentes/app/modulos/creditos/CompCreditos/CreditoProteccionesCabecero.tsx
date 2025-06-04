import React from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import CreditoComisionDetalle from './CreditoComisionDetalle'
import CreditosProteccionesDetalle from './CreditoProteccionesRelacion/CreditosProteccionesDetalle'
import CreditoComisionSucursal from './CreditoComisionSucursal'
import * as Funciones from './CreditoProteccionesCabecero/Funciones'

import * as FnProductos from './CreditoProducto/Funciones'
import * as FnNiveles from '../../distribuidor/CompDistribuidor/DistribuidorNivel/Funciones'
import * as FnSucursales from '../../general/CompGeneral/Sucursal/Funciones'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'

// Icons
import { FaPencilAlt, FaPlus, FaSearch, FaListAlt, FaWindowClose, FaCodeBranch } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../global'
import { CForm } from './CreditoProteccionesCabecero/CForm'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'

import ReactTooltip from 'react-tooltip';
import CreditosProteccionesSucursales from './CreditoSucursalesProtecciones/CreditosProteccionesSucursales'
import moment from 'moment'


type CatalogosType = {
  oidc: IOidc
}

const CreditoProteccionesCabecero = (props: CatalogosType) => {
  let isMounted = React.useRef(true)

  const DatosDefecto = {
    Descripcion: ''

  }
  const Datos: any[] = []
  const Detail = {}
  const DatosMostrar: any[] = []
  const optProteccion: any[] = []
  const optProteccionCabecero: any[] = []
  const optProducto: any[] = []
  const optProductos: any[] = []
  const optSucursal: any[] = []
  const [state, setState] = React.useState({
    Datos,
    Detail,
    DatosMostrar,
    Filtro: '',
    Cargando: true,
    Error: false,
    Form:
    {
      Mostrar: false,
      Datos: DatosDefecto,
      Id: undefined
    },
    optProteccion,
    optProducto,
    optProductos,
    optSucursal,
    optProteccionCabecero,
    isUpdate: false,
    ProteccionCabeceroID: 0,
    ProteccionCabeceroDetalle: 0,
    ProteccionID: 0,
    ProductoID: 0,
    SucursalID: 0,
    ShowBranch: false,
    /* ProductoID: 0,
    ComisionesID: 0,
     */
    ShowDetail: false,
    ShowSucursal: false
  })

  const FNGetProtecciones = () => {
    Funciones.FNGetProteccionesvista(props.oidc)
      .then((respuesta: any) => {
        // if (isMounted.current === true) {

        var proteccion = respuesta.map((valor: any) => {
          var obj = { value: valor.ProteccionID, label: valor.ProteccionID + ' - ' + valor.Minimo + ' - ' + valor.Maximo + ' - ' + valor.DistribuidorNivelDetalle + ' - ' + valor.NivelOrigenDetalle };
          return obj
        });

        setState(s => ({ ...s, optProteccion: proteccion }))
        // } 
      })
      .catch(() => {
        // if (isMounted.current === true) {
        setState(s => ({ ...s, optProteccion: [] }))
        // }
      })
  }
  /*   const FNGetProductos = () => {
      Funciones.FNGetProductos(props.oidc)
        .then((respuesta: any) => {
          // if (isMounted.current === true) {
  
          var productos = respuesta.map((valor: any) => {
            var obj = { value: valor.ProductoID, label: valor.ProductoID + ' - ' + valor.Producto };
            return obj
          });
  
          setState(s => ({ ...s, optProductos: productos }))
          // } 
        })
        .catch(() => {
          // if (isMounted.current === true) {
          setState(s => ({ ...s, optProductos: [] }))
          // }
        })
    } */

  const FNGetSucursal = () => {
    Funciones.FNGetSucursales(props.oidc)
      .then((respuesta: any) => {
        // if (isMounted.current === true) {

        var sucursal = respuesta.map((valor: any) => {
          var obj = { value: valor.SucursalID, label: valor.SucursalID + ' - ' + valor.Nombre };
          return obj
        });

        setState(s => ({ ...s, optSucursal: sucursal }))
        // } 
      })
      .catch(() => {
        // if (isMounted.current === true) {
        setState(s => ({ ...s, optSucursal: [] }))
        // }
      })
  }

  const FNGetLocal2 = () => {
    setState(s => ({ ...s, Cargando: true }))
    Funciones.FNGetCabecero(props.oidc)
      .then((respuesta: any) => {
        // if (isMounted.current === true) {
        setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta }))
        // }
      })
      .catch(() => {
        // if (isMounted.current === true) {
        setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
        // }
      })
  }





  const Columns = React.useMemo(() => {
    let colRet: IDataTableColumn[] =
      [
        { name: 'Id', selector: 'ProteccionCabeceroID', sortable: true, },
        { name: 'Descripción', selector: 'Descripcion', sortable: true, },
        { name: 'Usuario Captura', selector: 'NombreCaptura', sortable: true, },
        { name: 'Fecha Registro', selector: 'FechaCaptura', sortable: true, cell: (props) => <span>{moment(props.FechaCaptura).format('DD/MM/YYYY')}</span> },
        { name: 'Usuario Modifica', selector: 'NombreModifica', sortable: true, },
        { name: 'Fecha Modificación', selector: 'FechaModifica', sortable: true,  cell: (props) => <span>{props.FechaModifica ? moment(props.FechaModifica).format('DD/MM/YYYY') : ''}</span> },
        {
          name: 'Acciones', sortable: false,
          cell: (props) =>
            <div>
              <button title='Editar' className="asstext" type={"button"} onClick={() => {
                setState(s => ({
                  ...s,
                  Form: {
                    ...s.Form,
                    Mostrar: true,
                    Datos: {

                      Descripcion: props.Descripcion,
                    },
                    Id: props.ProteccionCabeceroID
                  },
                  isUpdate: true
                }))
              }}>
                <FaPencilAlt />
              </button>
              {'\u00A0'}
              <button title='Detalle' data-tip data-for="Detail" className="asstext" type={"button"} onClick={() => {
                setState(s => ({
                  ...s,
                  ShowDetail: true,
                  Form: {
                    ...s.Form,
                    Id: props.ProteccionCabeceroID,
                  }
                  /* Detail: props, */
                }))
              }}>
                <FaListAlt />
              </button>
              <ReactTooltip id="Detail"
                type="info"
                effect="solid"
                clickable
                globalEventOff="click"
              >
                Detalle Relación
              </ReactTooltip>
              {'\u00A0'}
              <button title='Sucursal' data-tip data-for="DetailTooltip" className="asstext" type={"button"} onClick={() => {
                setState(s => ({
                  ...s,
                  ShowSucursal: true,
                  Form: {
                    ...s.Form,
                    Id: props.ProteccionCabeceroID
                  }

                }))
              }}>
                <FaCodeBranch />
              </button>
              <ReactTooltip id="DetailTooltip"
                type="info"
                effect="solid"
                clickable
                globalEventOff="click"
              >
                Relación Sucursales
              </ReactTooltip>
            </div>

        },
      ]
    return colRet
  }, [])

  React.useEffect(() => {
    if (isMounted.current === true) {

      FNGetLocal2()
      FNGetProtecciones()
      /* FNGetProductos() */
      FNGetSucursal()
    }
    return () => {
      isMounted.current = false
    }
    // eslint-disable-next-line
  }, [])

  React.useEffect(() => {
    setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
    // eslint-disable-next-line
  }, [state.Datos, state.Filtro])

  /** funcion Callback al agregar un item */
  const cbAgregar = (item: any) =>
    setState({
      ...state, Datos: [...state.Datos, item], Form: {
        ...state.Form, Mostrar: false,
        Datos: DatosDefecto
      }, isUpdate: false
    })

  /** funcion Callback al actualizar un item */
  const cbActualizar = (item: any) =>
    setState(s => ({
      ...s, Datos: state.Datos.map(Dato => Dato.ProteccionCabeceroID === item.ProteccionCabeceroID ? item : Dato), Form: {
        ...state.Form, Mostrar: false,
        Datos: DatosDefecto
      }, isUpdate: false
    }))

  /** funcion para cancelar la forma */
  const fnCancelar = () => setState(s => ({ ...s, Form: { ...state.Form, Mostrar: false, Datos: DatosDefecto }, isUpdate: false }))

  // const cbClose = (item: any) => 
  //     setState(s => ({ ...s, Datos: state.Datos.map(Dato => Dato.ProductoID === state.ProductoID && Dato.ComisionesID === state.ComisionesID ? {...Dato, SucursalesIds: item} : Dato), ProductoID: 0, ComisionesID: 0,  }))

  return (
    <div className="row">
      <div className="col-12">
        <Card Title="Protección Cabecero">
          <Card.Body>
            <Card.Body.Content>
              {state.Cargando && <Spinner />}
              {state.Error && <span>Error al cargar los datos...</span>}
              {!state.Cargando && !state.Error &&
                <div>
                  <DataTable
                    subHeader
                    subHeaderComponent=
                    {
                      <div className="row">
                        <div className="col-sm-12">
                          <div className="input-group mb-3">
                            <input type="text" className="form-control" placeholder="Buscar cabecero" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                            <span className="input-group-text"><FaSearch /> </span>
                            <button title='Agregar' className="btn btn-outline-secondary" type="button"
                              onClick={() => setState({ ...state, Form: { Mostrar: true, Datos: DatosDefecto, Id: undefined }, isUpdate: false })}
                            ><FaPlus /></button>
                            <button title='Actualizar' className="btn btn-outline-secondary" type="button" onClick={() => FNGetLocal2()} ><FiRefreshCcw /></button>
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
                    keyField={"ProteccionCabeceroID"}
                    defaultSortField={"ProteccionCabeceroID"}
                    columns={Columns}
                  />
                  <ModalWin open={state.Form.Mostrar} large={true}>
                    <ModalWin.Header>
                      <h5 className={MODAL_TITLE_CLASS}>
                        {(state.Form.Id) ? "Editar Cabecero" : "Agregar Cabecero"}
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
                        isUpdate={state.isUpdate} />
                    </ModalWin.Body>
                  </ModalWin>
                  <ModalWin open={state.ShowDetail} full={true}>
                    <ModalWin.Header>
                      <h5 className={MODAL_TITLE_CLASS}>
                        Detalles Cabecero
                      </h5>
                      <button title='Cerrar' type="button" className="delete" onClick={() => setState(s => ({ ...s, ShowDetail: false }))} />
                    </ModalWin.Header>
                    <ModalWin.Body>
                      {state.ShowDetail &&
                        <CreditosProteccionesDetalle
                          ProteccionID={state.ProteccionID}
                          ProteccionCabeceroID={state.ProteccionCabeceroID}
                          optProteccion={state.optProteccion}
                          Datos={state.Detail}
                          Head={state.Detail}
                          ProteccionIDDetalle={state.ProteccionCabeceroID}
                          Id={state.Form.Id} ProteccionCabeceroDetalle={0} />
                      }
                    </ModalWin.Body>
                  </ModalWin>
                  <ModalWin open={state.ShowSucursal} full={true}>
                    <ModalWin.Header>
                      <h5 className={MODAL_TITLE_CLASS}>
                        Detalles Sucursales
                      </h5>
                      <button title='Cerrar' type="button" className="delete" onClick={() => setState(s => ({ ...s, ShowSucursal: false }))} />
                    </ModalWin.Header>
                    <ModalWin.Body>
                      {state.ShowSucursal &&
                        <CreditosProteccionesSucursales
                          ProductoID={state.ProductoID}
                          SucursalID={state.SucursalID}
                          ProteccionCabeceroID={state.ProteccionCabeceroID}
                          optProductos={state.optProductos}
                          optSucursal={state.optSucursal}
                          Head={state.Detail}
                          Datos={state.Detail}
                          Id={state.Form.Id}
                          ProteccionCabeceroIDVista={0}
                        />
                      }
                    </ModalWin.Body>
                  </ModalWin>
                  {/*<ModalWin open={state.ShowBranch} center xlarge={true}>
                    <ModalWin.Header>
                      <h5 className={MODAL_TITLE_CLASS}>
                        Sucursales Relacionadas a la Comisión
                      </h5>
                      <button title='Cerrar' type="button" className="delete" onClick={() => {
                        setState(s => ({ ...s, ShowBranch: false }))
                      }} />
                    </ModalWin.Header>
                    <ModalWin.Body>
                      {state.ShowBranch &&
                        <CreditosProteccionesSucursales
                        ProteccionID={state.ProteccionID}
                        ProteccionCabeceroID={state.ProteccionCabeceroID}
                        optProteccion={state.optProteccion}
                        optProteccionCabecero={state.optProteccionCabecero}
                        Head={state.Detail}
                        // cbClose={cbClose}
                        />
                      }
                    </ModalWin.Body>
                    </ModalWin>*/}
                </div>
              }
            </Card.Body.Content>
          </Card.Body>
        </Card>
      </div>
    </div >
  )
}

const mapStateToProps = (state: IEstado) => ({
  oidc: state.oidc
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(CreditoProteccionesCabecero)
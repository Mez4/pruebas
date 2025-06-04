import React from 'react'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import { FNGet } from './CreditoProteccionesPaquetes/Funciones';
import * as Funciones from './CreditoProteccionesPaquetes/Funciones'
import DataTable, { IDataTableColumn } from 'react-data-table-component';
import { FaListAlt, FaPencilAlt, FaPlus, FaSearch } from 'react-icons/fa';
import { FiltrarDatos } from '../../../../../global/functions';
import { Card, ModalWin, Spinner } from '../../../../global';
import { FiRefreshCcw } from 'react-icons/fi';
import { MODAL_TITLE_CLASS } from '../../../../global/ModalWin';
import { CForm } from './CreditoProteccionesPaquetes/CForm';
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { connect } from 'react-redux'
import ReactTooltip from 'react-tooltip';
import * as FnDistribuidoraNivel from './CreditoProteccionesPaquetes/Funciones'
import * as FnDistribuidoraNivelOrigen from './CreditoProteccionesPaquetes/Funciones'


type CatalogosType = {
  oidc: IOidc
}

const CreditoProteccionesPaquete = (props: CatalogosType) => {
  let isMounted = React.useRef(true)

  const DatosDefecto = {
    Minimo: 0,
    Maximo: 0,
    Monto: 0,
    DistribuidorNivelID: 0,
    OrigenNivelID: 0
  }
  const Datos: any[] = []
  const Detail = {}
  const DatosMostrar: any[] = []
  const optDistribuidoraNivel: any[] = []
  const optDistribuidoraNivelOrigen: [] = []
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
      MostrarDetalle: false,
      Datos: DatosDefecto,
      Id: undefined
    },
    optDistribuidoraNivel,
    optDistribuidoraNivelOrigen,
    isUpdate: false,
    ProteccionID: 0,
    DistribuidorNivelID: 0,
    OrigenNivelID: 0,
    ShowDetail: false
  })

  const FNGetLocal = () => {
    setState(s => ({ ...s, Cargando: true }))
    Funciones.FNGet2(props.oidc)
      .then((respuesta: any) => {
        setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta }))
      })
      .catch(() => {
        setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
      })
  }

  const FNGetLocal2 = () => {
    /* setState(s => ({ ...s, Cargando: true })) */
    Funciones.GetLocal23(props.oidc)
      .then((respuesta: any) => {
        console.log("DATOS", respuesta)
        // if (isMounted.current === true) {
        var productos = respuesta.map((valor: any) => {
          var obj = { value: valor.DistribuidorNivelID, label: valor.DistribuidorNivelID + " - " + valor.DistribuidorNivel };
          return obj

        });


        setState(s => ({ ...s, optDistribuidoraNivel: productos }))
        // }
      })
      .catch(() => {
        // if (isMounted.current === true) {
        setState(s => ({ ...s, Cargando: false, Error: true, Datos: [], optDistribuidoraNivel: [] }))
        // }
      })
  }
  const FnGetDistribuidoraNivel = () => {
    FnDistribuidoraNivel.FNGetByDistribuidorNivel(props.oidc)
      .then((respuesta: any) => {
        // if (isMounted.current === true) {

        var distribuidoranivel = respuesta.map((valor: any) => {
          var obj = { value: valor.DistribuidorNivelID, label: valor.DistribuidoraNivel };
          return obj
        });

        setState(s => ({ ...s, optDistribuidoraNivel: distribuidoranivel }))
        // }
      })
      .catch(() => {
        // if (isMounted.current === true) {
        setState(s => ({ ...s, optDistribuidoraNivel: [] }))
        // }
      })
  }

  const FnGetDistribuidoraNivelOrigen = () => {
    FnDistribuidoraNivelOrigen.FNGetByOrigenNivel(props.oidc)
      .then((respuesta: any) => {
        // if (isMounted.current === true) {
        var productos = respuesta.map((valor: any) => {
          var obj = { value: valor.DistribuidorNivelID, label: valor.DistribuidorNivelID + " - " + valor.DistribuidorNivel };
          return obj
        });

        setState(s => ({ ...s, optDistribuidoraNivelOrigen: productos }))
        // }
      })
      .catch(() => {
        // if (isMounted.current === true) {
        setState(s => ({ ...s, optDistribuidoraNivelOrigen: [] }))
        // }
      })
  }


  const Columns = React.useMemo(() => {
    let colRet: IDataTableColumn[] =
      [
        { name: 'Id', selector: 'ProteccionID', sortable: true, },
        { name: 'Mínimo', selector: 'Minimo', sortable: true, },
        { name: 'Máximo', selector: 'Maximo', sortable: true, },
        { name: 'Monto', selector: 'Monto', sortable: true, },
        { name: 'Distribuidor Nivel', selector: 'DistribuidorNivel', sortable: true, },
        { name: 'Distribuidor Nivel Origen', selector: 'DistribuidorNivelOrigen', sortable: true, },
        { name: 'Usuario Captura', selector: 'NombreCaptura', sortable: true, },
        { name: 'Usuario Modifica', selector: 'NombreModifica', sortable: true, },
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
                      Minimo: props.Minimo,
                      Maximo: props.Maximo,
                      Monto: props.Monto,
                      DistribuidorNivelID: props.DistribuidorNivelID,
                      OrigenNivelID: props.OrigenNivelID
                    },
                    Id: props.ProteccionID
                  },
                  isUpdate: true
                }))
              }}>
                <FaPencilAlt />
              </button>
              <ReactTooltip
                id="DetailTooltip"
                type="info"
                effect="solid"
                clickable
                globalEventOff="click"
              >
                Detalle de proteccion
              </ReactTooltip>
            </div>
        },

      ]
    return colRet
  }, [])

  React.useEffect(() => {
    if (isMounted.current === true) {
      FNGetLocal()
      FNGetLocal2()
      FnGetDistribuidoraNivelOrigen()
    }
    return () => {
      isMounted.current = false
    }
  }, [])

  React.useEffect(() => {
    setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
    // eslint-disable-next-line
  }, [state.Datos, state.Filtro])

  const cbAgregar = (item: any) =>
    setState({
      ...state, Datos: [...state.Datos, item], Form: {
        ...state.Form, Mostrar: false, MostrarDetalle: false,
        Datos: DatosDefecto
      }, isUpdate: false
    })


  const cbActualizar = (item: any) =>
    setState(s => ({
      ...s, Datos: state.Datos.map(Dato => Dato.ProteccionID === item.ProteccionID ? item : Dato), Form: {
        ...state.Form, Mostrar: false, MostrarDetalle: false,
        Datos: DatosDefecto
      }, isUpdate: false
    }))

  /**Funcion para cancelar la forma */
  const fnCancelar = () => setState(s => ({ ...s, Form: { ...state.Form, Mostrar: false, Datos: DatosDefecto, MostrarDetalle: false }, isUpdate: false }))


  return (
    <div className="row">
      <div className="col-12">
        <Card Title="Administrar Paquetes">
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
                            <input type="text" className="form-control" placeholder="Buscar paquete" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                            <span className="input-group-text"><FaSearch /></span>
                            <button title='Agregar' className="btn btn-outline-secondary" type="button"
                              onClick={() => setState({ ...state, Form: { Mostrar: true, Datos: DatosDefecto, Id: undefined, MostrarDetalle: false }, isUpdate: false })}
                            ><FaPlus /></button>
                            <button title='Refrescar' className="btn btn-outline-secondary" type="button" onClick={() => FNGetLocal()}><FiRefreshCcw /></button>
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
                    keyField={"ProteccionID"}
                    defaultSortField={"ProteccionID"}
                    columns={Columns}
                  />
                  <ModalWin open={state.Form.Mostrar} large={true}>
                    <ModalWin.Header>
                      <h5 className={MODAL_TITLE_CLASS}>
                        {(state.Form.Id) ? "Editar Paquetes" : "Agregar Paquetes"}
                      </h5>
                    </ModalWin.Header>
                    <ModalWin.Body>
                      <CForm
                        oidc={props.oidc}
                        initialValues={state.Form.Datos}
                        Id={state.Form.Id}
                        optDistribuidoraNivel={state.optDistribuidoraNivel}
                        optDistribuidoraNivelOrigen={state.optDistribuidoraNivelOrigen}
                        cbActualizar={cbActualizar}
                        cbGuardar={cbAgregar}
                        fnCancelar={fnCancelar}
                        isUpdate={state.isUpdate}
                      />
                    </ModalWin.Body>
                  </ModalWin>
                  <ModalWin open={state.Form.MostrarDetalle} large={true}>
                    <ModalWin.Header>
                      <h5 className={MODAL_TITLE_CLASS}>
                        {(state.Form.Id) ? "Editar Paquetes" : "Agregar Paquetes"}
                      </h5>
                    </ModalWin.Header>
                  </ModalWin>
                </div>
              }
            </Card.Body.Content>
          </Card.Body>
        </Card>
      </div>
    </div>
  )
}


const mapStateToProps = (state: IEstado) => ({
  oidc: state.oidc
})

const mapDispatchToProps = {

}


export default connect(mapStateToProps, mapDispatchToProps)(CreditoProteccionesPaquete)
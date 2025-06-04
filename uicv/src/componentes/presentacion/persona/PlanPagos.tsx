import React from 'react'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { connect } from 'react-redux'
import { IEstado } from '../../../interfaces/redux/IEstado'
import ModalWin, { MODAL_TITLE_CLASS } from '../../global/ModalWin';
import { IOidc } from '../../../interfaces/oidc/IOidc'
import * as Funciones from './CompPerfilPersona/Funciones'
// Icons
import { FaBan, FaSearch } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../global'
import { FiRefreshCcw } from 'react-icons/fi'
//import { FiltrarDatos } from '../../../../../global/functions'
import ReactTooltip from 'react-tooltip';
import { toast } from 'react-toastify';
import { FiltrarDatos } from '../../../global/functions';


type CatalogosType = {
    oidc: IOidc,
    SolicitudPrestamoPersonalID: number
}

const PlanPagos = (props: CatalogosType) => {
    // Controll our mounted state
    let isMounted = React.useRef(true)

    const DatosDefecto = 
    { 
      SolicitudPrestamoPersonalID: 0,
      PlazoSolicitado:0,
      PrestamoSolicitado: 0,
      NoPago: 0,
      Capital: 0,
      Interes: 0,
    }

    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const [state, setState] = React.useState({
        Datos,
        DatosMostrar,
        Filtro: '',
        Cargando: true,
        Error: false,
        Form:
        {
            Mostrar: false,
            Datos: DatosDefecto,
            Id: undefined
        }
    })


    const FNGetLocal = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGetPlanPagos(props.oidc, props.SolicitudPrestamoPersonalID).then((respuesta: any) => {
            if (isMounted.current === true) {
                console.log("Show me", respuesta);
                if (respuesta.mensajePeticion === undefined) {
                    setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta }))
                } else {
                    setState(s => ({ ...s, Cargando: false }))
                    toast.error("Error al obtener los datos, permisos insuficientes")
                }
            }
        })
            .catch((error: any) => {
                if (isMounted.current === true) {
                    console.log("###e", error);
                    setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
                }
            })
    }

    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                // {   name: 'Solicitud',
                //     selector: 'SolicitudPrestamoPersonalID',
                //     width: '15%',
                //     cell: (props) => 
                //         <div style={{width: '100%', textAlign: 'center'}}>
                //             <span>
                //                 {props.SolicitudPrestamoPersonalID}
                //             </span>
                //         </div>
                // },
                {   
                    name: 'No. Pago',
                    selector: 'NoPago',
                    width: '15%',
                    cell: (props) => 
                        <div style={{
                            width: '100%', 
                            textAlign: 'center',
                            backgroundColor: props.NoPago === 1 ? '#3AE626' : 'inherit', 
                        }}>
                            {props.NoPago}
                        </div>
                },
                {   name: 'Capital',
                selector: 'Capital',
                width: '20%',
                cell: (props) => 
                    <div style={{width: '100%', textAlign: 'center'}}>
                              {`$${props.Capital}`}
                    </div>
                },
                {   name: 'Interes',
                selector: 'Interes',
                width: '25%',
                cell: (props) => 
                    <div style={{width: '100%', textAlign: 'center'}}>
                          {`$${props.Interes}`}
                    </div>
                },
                {   name: 'Importe Total', wrap: true, center: true,
                selector: 'ImporteTotal',
                width: '25%',
                cell: (props) => 
                    <div style={{width: '100%', textAlign: 'center'}}>
                            {`$${props.ImporteTotal}`}
                    </div>
                },
                
                
                
            ]
        return colRet
    }, [state.Form])

    // Use effect
    React.useEffect(() => {
        FNGetLocal()
        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line
    }, [])

    // On use effect
    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro])

    /** funcion Callback al agregar un item */
    // const cbAgregar = (item: any) => {
    //     setState({ ...state, Datos: [...state.Datos, item], Form: { ...state.Form, Mostrar: false, Datos: {SolicitudPrestamoPersonalID: 0, NoPago: 0, Capital: 0, Interes: 0} } })
    // }

    // /** funcion Callback al actualizar un item */
    // const cbActualizar = (item: any) =>
    //     setState({ ...state, Datos: state.Datos.map(Dato => Dato.Folio === item.Folio ? item : Dato), Form: { ...state.Form, Mostrar: false, Datos: { SolicitudPrestamoPersonalID: 0, NoPago: 0, Capital: 0, Interes: 0 } } })

    /** funcion para cancelar la forma */
    const fnCancelar = () => setState({ ...state, Form: { ...state.Form, Mostrar: false } })

    return (
        <div className="row">
            <div className="col-12">
                <Card>
                    <Card.Body>
                        <Card.Body.Content>
                            {state.Cargando && <Spinner />}
                            {state.Error && <span>Error al cargar los datos...</span>}
                            {!state.Cargando && !state.Error &&
                                <div>
                                    <DataTable
                                        //subHeader
                                        // subHeaderComponent=
                                        // {
                                        //     <div className="row">
                                        //         <div className="col-sm-12">
                                        //             <div className="input-group mb-3">
                                        //                 {/* <input type="text" className="form-control" placeholder="Buscar Vale" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} /> */}
                                        //                 {/* <span className="input-group-text"><FaSearch /> </span> */}
                                        //                 {/* <button className="btn btn-outline-secondary" type="button" onClick={() => FNGetLocal()}><FiRefreshCcw /></button> */}
                                        //             </div>
                                        //         </div>
                                        //     </div>
                                        // }
                                        data={state.DatosMostrar}
                                        striped
                                        pagination
                                        dense
                                        noHeader
                                        responsive
                                        keyField={"SolicitudPrestamoPersonalID"}
                                        defaultSortField={"SolicitudPrestamoPersonalID"}
                                        columns={Columns}
                                    />
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
export default connect(mapStateToProps, mapDispatchToProps)(PlanPagos);

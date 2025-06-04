import React from 'react'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { connect } from 'react-redux'
import { IEstado } from '../../../../interfaces/redux/IEstado'
// '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../interfaces/oidc/IOidc'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../global/ModalWin'
import * as Funciones from './Funciones'
// Icons
import { FaBan, FaSearch } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../global'
// import { CForm } from '../CompPerfilDistribuidor'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../global/functions'
import ReactTooltip from 'react-tooltip';

type CatalogosType = {
    oidc: IOidc,
    ValeraID: number
}

const CFormValeras = (props: CatalogosType) => {
    // Controll our mounted state
    let isMounted = React.useRef(true)

    const DatosDefecto = { ValeraID: 0, Folio: 0, Estatus: '' }
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
        Funciones.FNGetFoliosValera(props.oidc, props.ValeraID)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta }))
                }
            })
            .catch((error) => {
                console.log("###e", error)
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
                }
            })
    }

    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                {
                    name: 'Valera',
                    selector: 'ValeraID',
                    sortable: true,
                    width: '20%',
                    cell: (props) => 
                        <div style={{width: '100%', textAlign: 'center'}}>
                            <span>
                                {props.ValeraID}
                            </span>
                        </div>
                },
                {
                    name: 'Folio',
                    selector: 'Folio',
                    sortable: true,
                    width: '30%',
                    cell: (props) => 
                        <div style={{width: '100%', textAlign: 'center'}}>
                            <span className="badge bg-info" style={{fontSize: '1.2em', width: '6em'}}>
                                {props.Folio}
                            </span>
                        </div>
                },
                {
                    name: 'Estatus',
                    selector: 'Estatus',
                    sortable: true,
                    width: '25%',
                    cell: (props) => 
                        <div style={{width: '100%', textAlign: 'center'}}>
                            <span style={{fontSize: '1em'}} className={props.Estatus === 'X' ? 'badge bg-danger' : props.Estatus === 'C' ? 'badge bg-success' : 'badge bg-primary'}>
                                {props.Estatus}
                            </span>
                        </div>
                },
                {
                    name: 'Estatus',
                    selector: 'Estatus',
                    sortable: true,
                    width: '30%',
                    cell: (props) => 
                        <div style={{width: '100%', textAlign: 'start'}}>
                            {/* <span style={{fontSize: '1em'}} className={props.Estatus === 'X' ? 'badge bg-danger' : props.Estatus === 'C' ? 'hola' : 'badge bg-primary'}>
                                {props.Estatus}
                            </span> */}
                            {props.Estatus ==  'X' && <span>Cancelado</span> }
                            {props.Estatus ==  'C' && <span>Canjeado</span>}
                            {props.Estatus == 'A' && <span>Activo</span>}
                            {props.Estatus == 'P' && <span>Prueba</span>}
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
    const cbAgregar = (item: any) => {
        setState({ ...state, Datos: [...state.Datos, item], Form: { ...state.Form, Mostrar: false, Datos: { ValeraID: 0, Folio: 0, Estatus: '' } } })
    }

    /** funcion Callback al actualizar un item */
    const cbActualizar = (item: any) =>
        setState({ ...state, Datos: state.Datos.map(Dato => Dato.Folio === item.Folio ? item : Dato), Form: { ...state.Form, Mostrar: false, Datos: { ValeraID: 0, Folio: 0, Estatus: '' } } })

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
                                        subHeader
                                        subHeaderComponent=
                                        {
                                            <div className="row">
                                                <div className="col-sm-12">
                                                    <div className="input-group mb-3">
                                                        <input type="text" className="form-control" placeholder="Buscar Vale" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                        <span className="input-group-text"><FaSearch /> </span>
                                                        <button className="btn btn-outline-secondary" type="button" onClick={() => FNGetLocal()}><FiRefreshCcw /></button>
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
                                        keyField={"Folio"}
                                        defaultSortField={"ValeraID"}
                                        columns={Columns}
                                    />
                                    {/* <ModalWin open={state.Form.Mostrar} center>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>Confirmar Cancelación de Vale</h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            {<CForm
                                                oidc={props.oidc}
                                                initialValues={state.Form.Datos}
                                                Id={state.Form.Id}
                                                cbActualizar={cbActualizar}
                                                cbGuardar={cbAgregar}
                                                fnCancelar={fnCancelar}
                                            />}
                                        </ModalWin.Body>
                                    </ModalWin> */}
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
export default connect(mapStateToProps, mapDispatchToProps)(CFormValeras);

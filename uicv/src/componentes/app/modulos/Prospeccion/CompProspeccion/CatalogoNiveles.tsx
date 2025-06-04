import React from 'react'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'
import * as FuncionesP from '../CompProspeccion/CatalogoMesaCreditoIndex/FuncionesDictamen'

import * as Funciones from './CatalogoTipoPersona/Funciones'

// Icons
import { FaPencilAlt, FaPlus, FaSearch ,FaCircle} from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../global'
import { FiRefreshCcw } from 'react-icons/fi'

import { FiltrarDatos } from '../../../../../global/functions'
import { CForm } from './CatalogoNiveles/CForm'
import { Form } from 'usetheform'


type CatalogosType = {
    oidc: IOidc
}

const CatalogoNiveles = (props: CatalogosType) => {
    // Controll our mounted state
    let isMounted = React.useRef(true)

    const DatosDefecto = { DistribuidorNivelID: 0, DistribuidorNivel: '', PorcComisionBase: 0, CapitalColocadoMinimo: 0, CapitalColocadoMaximo: 0, ImporteProteccionSaldo: 0, importeMaxCanje: 0, maximoPrestamoPersonal: 0, maximoImporteCanjeCliente: 0, maximoImporteCanjeAval: 0, Activo: false}
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const [state, setState] = React.useState({
        Datos,
        DatosMostrar,
        Filtro:'',
        Cargando: true,
        Error: false,
        Form:
        {
            Mostrar: false,
            Datos: DatosDefecto,
            NuevoNivel: false,
            Id: undefined
        }
    })
    
        
    const FnGetNivelesOrigen = () => {
        setState(s => ({ ...s }))
        FuncionesP.FNGetNivelesOrigen(props.oidc)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    console.log(respuesta);
                    setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta }))
                }
            })
            .catch((error) => {
                console.log(error)
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
                }
            })
    }

    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                {
                    name: 'id',
                    selector: 'DistribuidorNivelID',
                    sortable: true,
                },
                {
                    name: 'Nivel',
                    selector: 'DistribuidorNivel',
                    sortable: true,
                },

                {
                    name: 'Comision Base',
                    selector: 'PorcComisionBase',
                    sortable: true,
                },
                {
                    name: 'Capital Minimo',
                    selector: 'CapitalColocadoMinimo',
                    sortable: true,
                },
                {
                    name: 'Capital Maximo',
                    selector: 'CapitalColocadoMaximo',
                    sortable: true,
                },
                {
                    name: 'Importe Proteccion',
                    selector: 'ImporteProteccionSaldo',
                    sortable: true,
                },
                {
                    name: 'Importe Max Canje',
                    selector: 'importeMaxCanje',
                    sortable: true,
                },
                {
                    name: 'Max Prestamo Personal',
                    selector: 'maximoPrestamoPersonal',
                    sortable: true,
                },
                {
                    name: 'Maxi Importe Canje Cliente',
                    selector: 'maximoImporteCanjeCliente',
                    sortable: true,
                },
                {
                    name: 'Max Importe Canje Aval',
                    selector: 'maximoImporteCanjeAval',
                    sortable: true,
                },
                {
                    name: 'Activo',
                    selector: 'Activo',
                    sortable: true,
                    center: true,
                    cell: (props) => <span>{props.Activo ? <FaCircle color="green" title="Activo" /> : <FaCircle color="red" title="Inactivo" />}</span>
                },
                {
                    name: 'Acciones',
                    sortable: false,
                    center: true,
                    cell: (props) => 
                        <button className="asstext" type={"button"} onClick={() => {
                            setState(s => ({
                                ...s, Form:{
                                    ...state.Form, Mostrar: true,
                                    Datos: {DistribuidorNivelID: props.DistribuidorNivelID
                                        , DistribuidorNivel: props.DistribuidorNivel
                                        , PorcComisionBase:props.PorcComisionBase
                                        , CapitalColocadoMinimo: props.CapitalColocadoMinimo
                                        , CapitalColocadoMaximo: props.CapitalColocadoMaximo
                                        , ImporteProteccionSaldo: props.ImporteProteccionSaldo
                                        , importeMaxCanje: props.importeMaxCanje
                                        , maximoPrestamoPersonal: props.maximoPrestamoPersonal
                                        , maximoImporteCanjeCliente: props.maximoImporteCanjeCliente
                                        , maximoImporteCanjeAval: props.maximoImporteCanjeAval
                                        , Activo: props.Activo}
                                        , Id: props.DistribuidorNivelID
                                }
                            }))
                        }}>
                        <FaPencilAlt />
                        </button>
                },
            ]
            return colRet
        }, [state.Form])

        // Use effect
        React.useEffect(() => {
            FnGetNivelesOrigen()
            return () => {
                isMounted.current = false
            }
        }, [])

    // On use effect
    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro])

    /** funcion Callback al agregar un item */
    const cbAgregar = (item: any) => {
    setState({ ...state, Datos: [...state.Datos, item], Form: { ...state.Form, Mostrar: false, Datos: { DistribuidorNivelID: 0, DistribuidorNivel: '', PorcComisionBase: 0, CapitalColocadoMinimo: 0, CapitalColocadoMaximo: 0, ImporteProteccionSaldo: 0, importeMaxCanje: 0, maximoPrestamoPersonal: 0, maximoImporteCanjeCliente: 0, maximoImporteCanjeAval: 0, Activo: false } } })
    }
        
    /** funcion Callback al actualizar un item */
    const cbActualizar = (item: any) =>
    setState({ ...state, Datos: state.Datos.map(Dato => Dato.DistribuidorNivelID === item.DistribuidorNivelID ? item : Dato), Form: { ...state.Form, Mostrar: false, Datos: { DistribuidorNivelID:0, DistribuidorNivel: '', PorcComisionBase: 0, CapitalColocadoMinimo: 0, CapitalColocadoMaximo: 0, ImporteProteccionSaldo: 0, importeMaxCanje: 0, maximoPrestamoPersonal: 0, maximoImporteCanjeCliente: 0, maximoImporteCanjeAval: 0, Activo: false } } })


    /** funcion para cancelar la forma */
    const fnCancelar = () => setState({ ...state, Form: { ...state.Form, Mostrar: false } })


    return (
        <div className='row'>
            <div className='col-12'>
                <Card Title="Niveles Prospectos Credito">
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
                                                        <input type="text" className="form-control" placeholder="Buscar Tipo Persona" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                        <span className="input-group-text"><FaSearch /> </span>
                                                        <button className="btn btn-outline-secondary" type="button"
                                                            onClick={() => setState({ ...state, Form: { Mostrar: true, Datos: DatosDefecto, NuevoNivel: true, Id: undefined } })}
                                                        ><FaPlus /></button>
                                                        <button className="btn btn-outline-secondary" type="button" onClick={() => {FnGetNivelesOrigen()}}><FiRefreshCcw /></button>
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
                                        keyField={"DistribuidorNivelID"}
                                        defaultSortField={"DistribuidorNivelID"}
                                        columns={Columns}
                                    />
                                        <ModalWin open={state.Form.Mostrar}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>Agregar Nivel Prospecto</h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>

                                            {
                                                <CForm
                                                oidc={props.oidc}
                                                initialValues={state.Form.Datos}
                                                Id={state.Form.Id}
                                                NuevoNivel={state.Form.NuevoNivel}
                                                cbActualizar={cbActualizar}
                                                cbGuardar={cbAgregar}
                                                fnCancelar={fnCancelar}
                                            
                                            />
                                            }
                                        </ModalWin.Body>
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
export default connect(mapStateToProps, mapDispatchToProps)(CatalogoNiveles);


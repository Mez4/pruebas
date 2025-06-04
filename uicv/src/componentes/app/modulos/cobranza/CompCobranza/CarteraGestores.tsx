import React from 'react'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { connect } from 'react-redux'
import { IEstado } from './../../../../../interfaces/redux/IEstado'
import { IOidc } from './../../../../../interfaces/oidc/IOidc'
import ModalWin, { MODAL_TITLE_CLASS } from './../../../../global/ModalWin'

import * as Funciones from '../../cobranza/CompCobranza/CarteraGestores/Funciones'

import * as FuncionesGestoresCobranza from '../../cobranza/CompCobranza/CatalogoGestoresCobranza/Funciones'

import { useParams, Link } from 'react-router-dom'

// Icons
import { FaPencilAlt, FaPlus, FaSearch, FaCircle, FaFile, FaWindowClose, FaEye } from 'react-icons/fa'

// Custom components
import { Card, Spinner, ActionSelect } from './../../../../global'
import { FiRefreshCcw } from 'react-icons/fi'
import { FormateoDinero } from './../../../../../global/variables'
import ReactTooltip from 'react-tooltip'

import { FiltrarDatos } from './../../../../../global/functions'

//import { CFormAsignarDistribuidor } from './CFormAsignarDistribuidor'

import { FaFilter } from 'react-icons/fa'
import { Formik, Form } from 'formik'
import { colors } from 'react-select/src/theme'




type CatalogosType = {
    oidc: IOidc
}

const CarteraGestores = (props: CatalogosType) => {
    // Controll our mounted state
    let isMounted = React.useRef(true)

    const DatosDefecto = { DistribuidorID: 0, DistribuidorDesc: '', Capital: 0, SaldoActual: 0, DiasAtraso: 0, Motivo: '', TipoCobranza: '', MotivoID: 0, MesaCobranzaID: 0, Clave: '' }
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const optMesa: any[] = []
    const optMotivo: any[] = []
    const optTipoCobranza: any[] = []
    const optDistribuidor: any[] = []
    const optinformacion: any[] = []
    const FiltroTipoCobranza: number = 0
    const FiltroDistribuidor: number = 0
    const FiltroMotivo: number = 0
    const [state, setState] = React.useState({
        Datos,
        DatosMostrar,
        optMesa,
        optMotivo,
        optTipoCobranza,
        optDistribuidor,
        FiltroTipoCobranza,
        FiltroDistribuidor,
        FiltroMotivo,
        Filtro: '',
        Cargando: true,
        Error: false,
        MesaCobranzaID: 0,
        MesaCobranzaDesc: '',
        NombreDirector: '',
        limInferiorDias: 0,
        limSuperiorDias: 0,
        optinformacion,
        Form:
        {
            Mostrar: false,
            Datos: DatosDefecto,
            Id: undefined
        }
    })

    type paramType = { id: string, productoId: string }
    let { id } = useParams<paramType>()
    let { productoId } = useParams<paramType>()
    let idRelMesaCredProd: number = parseInt(id as string)
    let id_int: number = parseInt(productoId as string)


    const FNGetLocal = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.getGestores(props.oidc)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
                }
            })
    }


    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                {
                    name: 'GestorID',
                    selector: 'PersonaID',
                    sortable: true,
                    width: '15%',
                    cell: (props) => <span >{props.PersonaID}</span>
                },

                {
                    name: 'GestorDesc',
                    selector: 'NombreCompleto',
                    sortable: true,
                    width: '25%',
                    center: true,
                    cell: (props) => <span >{props.NombreCompleto}</span>
                },

                {
                    name: 'Mesa Cobranza',
                    selector: 'mesaCobranza',
                    sortable: true,
                    width: '25%',
                    center: true,
                    cell: (props) => <span >{props.mesaCobranza}</span>
                },

                {
                    name: 'Socias Totales',
                    selector: 'DistribuidoresTotal',
                    sortable: true,
                    width: '15%',
                    center: true,
                    cell: (props) => <span >{props.DistribuidoresTotal}</span>
                },

                // {
                //     name: 'Activo',
                //     selector: 'Activo',
                //     sortable: true,
                //     center: true,
                //     cell: (props) => <span>{props.Activo ? <FaCircle color="green" title="Activo" /> : <FaCircle color="red" title="Inactivo" />}</span>
                // },

                {
                    name: 'Ver Socias',
                    sortable: false,
                    center: true,
                    grow: 0,
                    width: '20%',
                    cell: (props) =>
                        <div style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
                            <React.Fragment>
                                &nbsp;
                                <Link className={`has-text-dark ml-1`} to={`/app/${id_int}/cobranza/GestoresDistribuidores/${props.PersonaID}`} ><FaEye size={16} /></Link>
                                &nbsp;
                            </React.Fragment>
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

    React.useEffect(() => {
        // FnFiltrando()
    }, [state.FiltroTipoCobranza, state.FiltroDistribuidor, state.FiltroMotivo])

    // On use effect
    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
        // FnFiltrando()
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro])

    /** funcion Callback al agregar un item */
    const cbAgregar = (item: any) => {
        setState({ ...state, Datos: [...state.Datos, item], Form: { ...state.Form, Mostrar: false, Datos: { DistribuidorID: 0, DistribuidorDesc: '', Capital: 0, SaldoActual: 0, DiasAtraso: 0, Motivo: '', TipoCobranza: '', MotivoID: 0, MesaCobranzaID: 0, Clave: '' } } })
    }

    /** funcion Callback al actualizar un item */
    const cbActualizar = (item: any) =>
        setState({ ...state, Datos: state.Datos.map(Dato => Dato.DistribuidorID === item.DistribuidorID ? item : Dato), Form: { ...state.Form, Mostrar: false, Datos: { DistribuidorID: 0, DistribuidorDesc: '', Capital: 0, SaldoActual: 0, DiasAtraso: 0, Motivo: '', TipoCobranza: '', MotivoID: 0, MesaCobranzaID: 0, Clave: '' } } })

    /** funcion para cancelar la forma */
    const fnCancelar = () => setState({ ...state, Form: { ...state.Form, Mostrar: false } })

    return (
        <div className="row">
            <div className="col-12">
                <Card Title="CARTERA DE GESTORES">
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
                                                        <input type="text" className="form-control" placeholder="Buscar Gestor" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                        <span className="input-group-text"><FaSearch /> </span>
                                                        {/* <button className="btn btn-outline-secondary" type="button"
                                                            onClick={() => setState({ ...state, Form: { Mostrar: true, Datos: DatosDefecto, Id: undefined } })}
                                                        ><FaPlus /></button> */}
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
                                        keyField={"PersonaID"}
                                        defaultSortField={"PersonaID"}
                                        columns={Columns}
                                    />
                                    {/* <ModalWin open={state.Form.Mostrar}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>Agregar Clasificador</h5>
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
export default connect(mapStateToProps, mapDispatchToProps)(CarteraGestores);


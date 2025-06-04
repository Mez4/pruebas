import React from 'react'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'
import * as Funciones from './Funciones'

// Icons
import { FaSearch, FaPlus } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../../global'
import { CForm } from './CForm'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../../global/functions'
import ReactTooltip from 'react-tooltip';

type CatalogosType = {
    oidc: IOidc,
    AvalID: number,
    Editar: boolean
}

const ReferenciasAval = (props: CatalogosType) => {
    // Controll our mounted state
    let isMounted = React.useRef(true)

    const DatosDefecto = { ReferenciaID: 0, PersonaID: 0, TipoPersonaID: 0, numeroReferencia: 0, nombre: '', primerApellido: '', segundoApellido: '', parentesco: '', celular: '', domicilio: '', edad: 0, Activo: false }
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const AvalIDP: number = props.AvalID
    const EditarP: boolean = props.Editar
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
            Id: undefined,
            AvalID: AvalIDP
        }
    })

    const FNGetLocal = () => {

        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGetReferenciasByAvalID(props.oidc, props.AvalID)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    console.log(respuesta);
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
                    name: 'ID',
                    selector: 'ReferenciaID',
                    sortable: true,
                    width: '10%',
                    cell: (props) => 
                        <div style={{width: '100%', textAlign: 'start'}}>
                            <span>
                                {props.ReferenciaID}
                            </span>
                        </div>
                },
                {
                    name: 'Nombre Referencia',
                    selector: 'nombre',
                    sortable: true,
                    width: '45%',
                    cell: (props) => 
                        <div style={{width: '100%', textAlign: 'start'}}>
                            {props.nombre} {props.primerApellido} {props.segundoApellido} ({props.parentesco})
                        </div>
                },
                {
                    name: 'Accion',
                    selector: 'nombre',
                    sortable: true,
                    width: '45%',
                    cell: (props) => 
                    <><button data-tip data-for={`btnVD_${props.ReferenciaID}`} style={{width: '100%', textAlign: 'center', paddingTop: '2px', paddingBottom: '2px'}} className="btn btn-outline-primary" type={"button"} onClick={() => {
                        setState(s => ({
                            ...s,
                            Form: {
                                ...state.Form, Mostrar: true,
                                Datos: { ReferenciaID: props.ReferenciaID, PersonaID: props.PersonaID, TipoPersonaID: props.TipoPersonaID, numeroReferencia: props.numeroReferencia, nombre: props.nombre, primerApellido: props.primerApellido, segundoApellido: props.segundoApellido, parentesco: props.parentesco, celular: props.celular, domicilio: props.domicilio, edad: props.edad, Activo: props.Activo },
                                Id: props.ReferenciaID
                            }
                        }))
                    }}>
                        VER{EditarP && ' / EDITAR'}
                    </button>
                    <ReactTooltip id={`btnVD_${props.ReferenciaID}`} type="info"effect="solid">
                        VER {EditarP && '/ EDITAR'} REFERENCIA: {`${props.nombre} ${props.primerApellido} ${props.segundoApellido}`}
                    </ReactTooltip></>
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
        setState({ ...state, Datos: [...state.Datos, item], Form: { ...state.Form, Mostrar: false, Datos: { ReferenciaID: 0, PersonaID: 0, TipoPersonaID: 0, numeroReferencia: 0, nombre: '', primerApellido: '', segundoApellido: '', parentesco: '', celular: '', domicilio: '', edad: 0, Activo: false} }})
    }

    /** funcion Callback al actualizar un item */
    const cbActualizar = (item: any) =>
        setState({ ...state, Datos: state.Datos.map(Dato => Dato.ReferenciaID === item.ReferenciaID ? item : Dato), Form: { ...state.Form, Mostrar: false, Datos: { ReferenciaID: 0, PersonaID: 0, TipoPersonaID: 0, numeroReferencia: 0, nombre: '', primerApellido: '', segundoApellido: '', parentesco: '', celular: '', domicilio: '', edad: 0, Activo: false } } })

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
                                                        <input type="text" className="form-control" placeholder="Buscar Referencia" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                        <span className="input-group-text"><FaSearch /> </span>
                                                        {props.Editar && <button className="btn btn-primary" type="button"
                                                            onClick={() => setState({ ...state, Form: { Mostrar: true, Datos: DatosDefecto, Id: undefined, AvalID: AvalIDP} })}
                                                        ><FaPlus /> AGREGAR REFERENCIA</button>}
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
                                        keyField={"AvalID"}
                                        defaultSortField={"AvalID"}
                                        columns={Columns}
                                    />
                                    {state.Form.Mostrar &&<ModalWin open={state.Form.Mostrar} center large>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>Referencia: {state.Form.Datos.nombre} {state.Form.Datos.primerApellido} {state.Form.Datos.segundoApellido} </h5>
                                            <button type="button" className="delete" onClick={() => {
                                                fnCancelar()
                                            }} />
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            {<CForm
                                                oidc={props.oidc}
                                                initialValues={state.Form.Datos}
                                                Id={state.Form.Id}
                                                AvalID={state.Form.AvalID}
                                                cbActualizar={cbActualizar}
                                                cbGuardar={cbAgregar}
                                                fnCancelar={fnCancelar}
                                                Editar={props.Editar}
                                            />}
                                        </ModalWin.Body>
                                    </ModalWin>}
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
export default connect(mapStateToProps, mapDispatchToProps)(ReferenciasAval);
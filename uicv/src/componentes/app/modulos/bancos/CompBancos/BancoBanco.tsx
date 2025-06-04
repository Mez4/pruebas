import React from 'react'
import { connect } from 'react-redux'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import * as Funciones from './BancoBanco/Funciones'
import * as FnTipoArchivoDispersion from '../../catalogos/CompCatalogos/CatalogoTipoArchivoDispersion/Funciones'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'

// Icons
import { FaPencilAlt, FaPlus, FaSearch } from 'react-icons/fa'

// Custom components
import { Card, Spinner, ImgViewer } from '../../../../global'
import { CForm } from './BancoBanco/CForm'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'
import { IEstado } from '../../../../../interfaces/redux/IEstado'

type CatalogosType = {
    oidc: IOidc
}

const BancoBanco = (props: CatalogosType) => {
    let isMounted = React.useRef(true)
    const DatosDefecto = { Nombre: '', Activo: false, ArchivoDispersionID: 0, Logo: '', file: null, EsBanco: false }
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const optArchivoDispersion: any[] = []
    // const imgSrc = ''
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
            // imgSrc: null
        },
        optArchivoDispersion
        // openImg: false,
        // imgSrc
    })

    const FNGetLocal = () => {

        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGet(props.oidc)
            .then((respuesta: any) => {
                console.log(respuesta)
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

    const FnGetEstados = () => {
        Funciones.FNGet(props.oidc)
            .then((respuesta: any) => {
                // if (isMounted.current === true) {

                var tipoArchivos = respuesta.map((valor: any) => {
                    var obj = { value: valor.ArchivoDispersionID, label: valor.Descripcion };
                    return obj
                });

                setState(s => ({ ...s, optArchivoDispersion: tipoArchivos }))
                // }
            })
            .catch(() => {
                // if (isMounted.current === true) {
                setState(s => ({ ...s, optArchivoDispersion: [] }))
                // }
            })
    }

    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                { name: 'Id', selector: 'CuentaBancoID', sortable: true, },
                { name: 'Banco', selector: 'NumeroCuenta', sortable: true, },
                { name: 'Activo', selector: 'Activo', sortable: true, cell: (props) => <span>{props.Activo === true ? "Si" : "No"}</span> },
                { name: 'Tipo Archivo Dispersión', selector: 'TipoArchivoDispersion.Descripcion', sortable: true, },
                {
                    name: 'Logo', selector: 'Logo', cell: (props) =>
                        <ImgViewer imgSrc={props.Logo} noToolbar={true} zIndex={1500} maxWidth={40} maxHeight={50} typeByte={true} />
                    // <input type="image" alt='' style={{ maxWidth: 40, maxHeight: 50 }} src={props.LogoImg} onClick={() => { setState(s => ({ ...s, openImg: true, imgSrc: props.LogoImg })) }} />
                },
                { name: 'Dispersa', selector: 'EsBanco', sortable: true, cell: (props) => <span>{props.EsBanco === true ? "Si" : "No"}</span> },
                {
                    name: 'Acciones', sortable: false,
                    cell: (props) =>
                        <button className="asstext" type={"button"} onClick={() => {
                            setState(s => ({
                                ...s,
                                Form: {
                                    ...s.Form, Mostrar: true,
                                    Datos: { Nombre: props.Nombre, Activo: props.Activo, ArchivoDispersionID: props.ArchivoDispersionID, Logo: props.Logo, file: null, EsBanco: props.EsBanco },
                                    Id: props.BancoID,
                                    imgSrc: props.LogoImg
                                }
                            }))
                        }}>
                            <FaPencilAlt />
                        </button>
                },
            ]
        return colRet
    }, [])

    React.useEffect(() => {
        if (isMounted.current === true) {
            FNGetLocal()
            FnGetEstados()
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
        setState({ ...state, Datos: [...state.Datos, item], Form: { ...state.Form, Mostrar: false, Datos: DatosDefecto } })

    /** funcion Callback al actualizar un item */
    const cbActualizar = (item: any) =>
        setState({ ...state, Datos: state.Datos.map(Dato => Dato.BancoID === item.BancoID ? item : Dato), Form: { ...state.Form, Mostrar: false, Datos: DatosDefecto } })

    /** funcion para cancelar la forma */
    const fnCancelar = () => setState({ ...state, Form: { ...state.Form, Mostrar: false } })

    // const fnCerrar = () => setState({ ...state, openImg: false })

    return (
        <div className="row">
            <div className="col-12">
                <Card Title="Administrar Bancos">
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
                                                        <input type="text" className="form-control" placeholder="Buscar bancos" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                        <span className="input-group-text"><FaSearch /> </span>
                                                        <button className="btn btn-outline-secondary" type="button"
                                                            onClick={() => setState({ ...state, Form: { Mostrar: true, Datos: DatosDefecto, Id: undefined } })}
                                                        ><FaPlus /></button>
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
                                        keyField={"BancoID"}
                                        defaultSortField={"BancoID"}
                                        columns={Columns}
                                    />
                                    <ModalWin open={state.Form.Mostrar}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>
                                                {state.Form.Id ? "Editar banco" : "Agregar banco"}
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
                                                options={state.optArchivoDispersion}
                                            // imgSrc={state.Form.imgSrc}
                                            />
                                        </ModalWin.Body>
                                    </ModalWin>
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

export default connect(mapStateToProps, mapDispatchToProps)(BancoBanco)
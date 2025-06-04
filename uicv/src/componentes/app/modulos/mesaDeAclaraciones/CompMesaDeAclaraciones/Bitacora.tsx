import React, { useState } from 'react'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'
import { toast } from 'react-toastify'
import * as Funciones from './CatalogoTipoSolicitud/Funciones'
import * as Yup from 'yup'

// Icons
import { FaCheck, FaCircle, FaClone, FaEye, FaPencilAlt, FaPlus, FaPrint, FaSearch } from 'react-icons/fa'

// Custom components
import { ActionSelect, Card, DatePickeEnd, DatePickeStart, Spinner } from '../../../../global'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'
import { CForm } from './CatalogoTipoSolicitud/CForm'
import moment from 'moment'
import { Form, Formik } from 'formik'
type CatalogosType = {
    oidc: IOidc
}

const Bitacora = (props: CatalogosType) => {    // Controll our mounted state
    let isMounted = React.useRef(true)

    const DatosDefecto = {
        TipoSolicitudID: 0,
        ClaveSolicitud: '',
        Descripcion: '',
    }
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const optMovBit: any[] = []
    const optEvento: any[] = []
    const FiltroMovBit: number = 0
    const FiltroEvento: number = 0
    const [state, setState] = React.useState({
        Datos,
        DatosMostrar,
        Filtro: '',
        Cargando: false,
        Error: false,
        optMovBit,
        optEvento,
        Form:
        {
            Mostrar: false,
            Datos: DatosDefecto,
            Id: undefined
        },
        FiltroMovBit,
        FiltroEvento

    })
    const FNGet = (valor1: any, valor2: any, valor3: any) => {
        let a = {
            FechaInicio: valor1,
            FechaFin: valor2,
            TipoMovimientoID: valor3,

        }
        Funciones.FNgetbyfiltros(props.oidc, a)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Datos: respuesta }))
                    setLoading(false)
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Datos: [] }))
                    setLoading(false)
                }

            })
    }
    const FNGetEventos = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGetMov(props.oidc)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var Estado = respuesta.map((valor: any) => {
                        var obj = { value: valor.TipoMovimientoID, label: valor.TipoMovimientoID + " -" + valor.DescripcionMov };
                        return obj
                    });
                    console.log("ESTADO ,", Estado)

                    setState(s => ({ ...s, optMovBit: Estado, Cargando: false }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, optMovBit: [] }))
                }
            })
    }

    const FNGetLocal = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGetBit(props.oidc)
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
    function formatearFecha(fecha) {
        return moment(fecha).format("DD/MM/YYYY hh:mm")
    }
    const cbActualizar = (item: any) => {
        toast.success('Tipo de solicitud actualiada correctamente')
        setState({ ...state, Datos: state.Datos.map(Dato => Dato.TipoSolicitudID === item.TipoSolicitudID ? item : Dato), Form: { ...state.Form, Mostrar: false, Datos: DatosDefecto } })
    }

    const fnCancelar = () => setState(s => ({ ...s, Form: { Mostrar: false, Datos: DatosDefecto, Id: undefined } }))

    const cbAgregar = (item: any) => {
        toast.success('Tipo de solicitud agregado correctamente')
        setState({
            ...state, Datos: [...state.Datos, item],
            Form: {
                ...state.Form, Mostrar: false,
                Datos: { ...DatosDefecto, TipoSolicitudID: 0, ClaveSolicitud: '', Descripcion: '' }
            }
        })
    }
    const [MovBit, setMovBit] = React.useState("")
    const [loading, setLoading] = React.useState(false)
    const [startDate, setStartDate] = useState(moment().add(-30, 'd').toDate());
    const [endDate, setEndDate] = useState(moment().toDate());
    const fnGetFiltroMovBit = (MovBitacoraID: number) => {

        setState(s => ({ ...s, FiltroMovBit: MovBitacoraID }))
    }
    const fnGetFiltroEvento = (DescripcionMov: number) => {

        setState(s => ({ ...s, FiltroMovBit: DescripcionMov }))
    }

    const Columns:/*: React.useMemo(() => {
        let colRet: */ IDataTableColumn[] =
        [
            { name: 'Id', selector: 'MovBitacoraID', sortable: true, width: '10%' },
            { name: 'AclarciónID', selector: 'AclaracionID', sortable: true, center: true, width: '10%' },
            { name: 'Evento', selector: 'DescripcionMov', sortable: true, center: true, width: '20' },
            { name: 'Responsable', selector: 'Modifico', sortable: true, center: true, width: '20%' },
            { name: 'Fecha', selector: 'Fecha', sortable: true, width: '20%', center: true, cell: (props) => <span className='text'>{formatearFecha(props.Fecha)}</span> },
            /*  {
                 name: 'Acciones',
                 sortable: false,
                 width: '20%',
                 cell: (fila) =>
                     <button className="asstext" type={"button"} onClick={() => {
                         setState(s => ({
                             ...s,
                             Form: {
                                 Mostrar: true,
                                 Datos: { ...DatosDefecto, TipoSolicitudID: fila.TipoSolicitudID, ClaveSolicitud: fila.ClaveSolicitud, Descripcion: fila.Descripcion },
                                 Id: fila.TipoSolicitudID
                             }
                         }))
                     }}>
                         <FaPencilAlt />
                     </button>
             }, */
        ]
    /*   return colRet
  }, [state.Form]) */

    // Use effect
    React.useEffect(() => {
        FNGetLocal()
        FNGetEventos()
        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line
    }, [])

    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro])

    return (
        <div className="row">
            <div className="col-12">
                <Card Title="BITÁCORA DE MOVIMIENTOS DEL MÓDULO DE ACLARACIONES">
                    <Card.Body>
                        <Card.Body.Content>
                            <Formik
                                initialValues={{
                                    FechaInicio: moment().add(-30, 'd').toDate(),
                                    FechaFin: new Date(),
                                    TipoMovimientoID: 0,
                                }}
                                enableReinitialize
                                validationSchema=
                                {Yup.object().shape({
                                    TipoMovimientoID: Yup.number().required("Campo obligatorio").moreThan(0, "Campo obligatorio")
                                })}
                                onSubmit={(values: any) => {
                                    /*          console.log("VALUES", values)
                                             values.TipoMovimientoID = MovBit
                                             console.log("Valores actu  alizados ,", values)
          */
                                    setLoading(true)
                                    setState(s => ({ ...s, Cargando: true }))
                                    console.log("VALORES", values)
                                    FNGet(values.FechaInicio, values.FechaFin, values.TipoMovimientoID)
                                }}>

                                <Form>
                                    <div className="row" style={{ textAlign: 'initial' }}>
                                        <div className="column is-one-quarter-desktop is-full-mobile is-full-tablet is-align-items-center ">
                                            <ActionSelect
                                                disabled={loading}
                                                label="Evento"
                                                name="TipoMovimientoID"
                                                placeholder="Elige el Evento"
                                                options={state.optMovBit}
                                                addDefault={true}
                                                valor={state.FiltroMovBit}
                                                accion2={(val) => setMovBit(val.TipoMovimientoID)}
                                            />
                                        </div>
                                        <div className="column is-one-quarter-desktop is-full-mobile is-full-tablet is-align-items-center ">
                                            <DatePickeStart name={'FechaInicio'} label={'Fecha Inicial'} disabled={loading} placeholder={'Inicio'} isClearable startDate={startDate} endDate={endDate} setStartDate={setStartDate} />
                                        </div>
                                        <div className="column is-one-quarter-desktop is-full-mobile is-full-tablet is-align-items-center ">
                                            <DatePickeEnd name={'FechaFin'} label={'Fecha Final'} disabled={loading} placeholder={'Final'} isClearable startDate={startDate} endDate={endDate} setEndDate={setEndDate} />
                                        </div>
                                        <div className="column is-one-quarter-desktop is-full-mobile is-full-tablet is-align-items-center ">
                                            <br></br>
                                            <button type="submit" className="bbtn btn-primary waves-effect waves-light">
                                                <span className="">Buscar</span>&nbsp;<FiRefreshCcw />
                                            </button>
                                        </div>
                                    </div>
                                </Form>
                            </Formik>
                            {state.Cargando && <Spinner />}
                            {state.Error && <span>Error al cargar los datos...</span>}
                            {!state.Cargando && !state.Error &&
                                <div>
                                    <DataTable
                                        paginationComponentOptions={{ rowsPerPageText: 'Resultados por página:', rangeSeparatorText: 'of', noRowsPerPage: false, selectAllRowsItem: false, selectAllRowsItemText: 'Todos' }}
                                        subHeader
                                        subHeaderComponent=
                                        {
                                            <div className="row">
                                                <div className="col-sm-12">
                                                    <div className="input-group mb-3">
                                                        <input type="text" className="form-control" placeholder="Buscar Aclaración" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                        <span className="input-group-text"><FaSearch /> </span>
                                                        <button className="btn btn-outline-secondary" type="button" onClick={() => FNGetLocal()}><FiRefreshCcw /></button>
                                                    </div>

                                                </div>

                                                <div style={{ display: 'inline-block' }}>

                                                </div>
                                            </div>

                                        }

                                        data={state.DatosMostrar}
                                        striped
                                        pagination
                                        dense
                                        noHeader
                                        responsive
                                        keyField={"TipoSolicitudID"}
                                        defaultSortField={"TipoSolicitudID"}
                                        columns={Columns}
                                    />
                                    <ModalWin open={state.Form.Mostrar} center={true}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}> {state.Form.Id != null ? "Editar Tipo Solicitud" : "Agregar Tipo Solicitud"} </h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <CForm
                                                oidc={props.oidc}
                                                initialValues={state.Form.Datos}
                                                Id={state.Form.Id}
                                                fnCancelar={fnCancelar}
                                                cbGuardar={cbAgregar}
                                                cbActualizar={cbActualizar}
                                            ></CForm>
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
export default connect(mapStateToProps, mapDispatchToProps)(Bitacora);
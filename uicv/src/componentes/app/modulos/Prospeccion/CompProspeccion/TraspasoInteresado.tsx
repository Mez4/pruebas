import React from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
// import * as FnUsuarios from './CreditoGrupoTraspaso/Funciones'
import * as Funciones from './ReasignarProspectoInteresado/Funciones'
import { CFormInt } from './ReasignarProspectoInteresado/CFormInt'
//import * as FnGrupoDetalle from './CreditoGrupoDetalle/Funciones'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'

// Icons
import { FaPencilAlt, FaPlus, FaSearch } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../global'
//import { CForm } from './CreditoGrupoTraspaso/CForm'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'
import { DescripcionDistribuidor } from '../../../../../global/variables'

type CatalogosType = {
    oidc: IOidc,
    creditoPromotorId: number,
    SucursalID: number,
    dataInteresados: any,
}


const TraspasoInteresado = (props: CatalogosType) => {
    let isMounted = React.useRef(true)
    const DatosDefecto = { PromotorID: props.creditoPromotorId, PromotorDestinoID: 0, SucursalID: props.SucursalID }
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const [state, setState] = React.useState({
        Datos,
        DatosMostrar,
        Filtro: '',
        Cargando: true,
        Error: false,
        Form: DatosDefecto,
        Interesados: [] as number[],
        loading: false
    })

    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                { name: 'Id', selector: 'InteresadosID', sortable: true, },
                { name: 'Interesados', selector: 'NombreInteresado', sortable: true, },
                { name: 'Estatus', selector: 'InicioProceso', sortable: true, cell: (props) => <span>{props.InicioProceso ? "Activo" : "Inactivo"}</span> },
            ]
        return colRet
    }, [])

    React.useEffect(() => {
        if (isMounted.current === true) {
            setState(s => ({ ...s, DatosMostrar: FiltrarDatos(props.dataInteresados, Columns, state.Filtro) }))
        }
        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro])

    /** funcion Callback al agregar un item */
    // const cbAgregar = (item: any) =>
    //     setState({ ...state, Datos: [...state.Datos, item], Form: { ...state.Form, Mostrar: false, Datos: { creditoPromotorNombre: '', activo: true } } })

    /** funcion Callback al actualizar un item */
    const cbActualizar = (item: any) =>
        setState(s => ({ ...s, Error: false, Datos: item }))
    // setState({ ...state, Datos: state.Datos.map(Dato => Dato.creditoPromotorId === item.creditoPromotorId ? item : Dato), Form: { ...state.Form, Mostrar: false, Datos: { creditoPromotorNombre: '', activo: true } } })

    /** funcion para cancelar la forma */
    const fnTraspasando = (loading: boolean) => {
        setState(s => ({ ...s, loading: loading }))
    }


    return (
        // <div className="row">
        //     <div className="col-12">
        <Card Title={'Traspasar Interesado'}>
            <Card.Body>
                <Card.Body.Content>
                    {/* {state.Cargando && <Spinner />}
                    {state.Error && <span>Error al cargar los datos...</span>} */}
                    {/* {!state.Cargando && !state.Error && */}
                        <div>
                            <CFormInt
                                oidc={props.oidc}
                                initialValues={state.Form}
                                Interesados={state.Interesados}
                                fnTraspasando={fnTraspasando}
                                cbActualizar={cbActualizar}
                            />
                            <br />
                            <DataTable
                                subHeader
                                // subHeaderComponent=
                                // {
                                //     <div className="row">
                                //         <div className="col-sm-12">
                                //             <div className="input-group mb-3">
                                //                 <input type="text" className="form-control" placeholder={'Buscar Interesado'} value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                //                 <span className="input-group-text"><FaSearch /></span>
                                //             </div>
                                //         </div>
                                //     </div>
                                // }
                                data={props.dataInteresados}
                                selectableRows
                                onSelectedRowsChange={(row: any) => setState(s => ({
                                    ...s,
                                    // Form:
                                    // {
                                    //     ...s.Form,
                                    Interesados: row.selectedRows.map((valor: any) => {
                                        return valor.InteresadosID;
                                    })
                                    // }
                                }))
                                }
                                striped
                                pagination
                                dense
                                noHeader
                                responsive
                                keyField={"InteresadosID"}
                                defaultSortField={"InteresadosID"}
                                columns={Columns}
                            />
                        </div>
                    {/* } */}
                </Card.Body.Content>
            </Card.Body>
        </Card>
        //     </div>
        // </div >
    )
}

const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(TraspasoInteresado)
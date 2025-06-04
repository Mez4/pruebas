import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import * as Funciones from './ReasignarProspectoInteresado/Funciones'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'

// Icons
import { FaPencilAlt, FaPlus, FaSearch } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../global'
import { FiRefreshCcw, FiUserPlus } from 'react-icons/fi'
import { FaExchangeAlt } from 'react-icons/fa'
import { FiltrarDatos } from '../../../../../global/functions'
import { DBConfia_Creditos } from '../../../../../interfaces_db/DBConfia/Creditos';
import { DescripcionDistribuidor } from '../../../../../global/variables'
import ReactTooltip from 'react-tooltip';
import { iUI } from '../../../../../interfaces/ui/iUI'
import FiltroPorUsuario from '../../general/CompGeneral/FiltroPorUsuario/FiltroPorUsuario'
import { Form, Formik } from 'formik'
import moment from 'moment'
import { CreditoGrupoTraspaso } from '../../creditos/CompCreditos'
import CForm from '../../general/CompGeneral/DNIManual/CForm'
import { CFormDetalle } from '../../creditos/CompCreditos/CreditoGrupoDetalle/CForm'
import TraspasoProspecto from './TraspasoProspecto'
import TraspasoInteresado from './TraspasoInteresado'
import { toast } from 'react-toastify'


type CatalogosType = {
    oidc: IOidc,
    ui: iUI,
    creditoPromotorId?,
    initialValues?: {
        DirectorID: number,
        ProductoID: number,
        SucursalID: number,
        ZonaID: number,
        EmpresaID: number,
        DistribuidorID: number,
        CoordinadorID: number,
        creditoPromotorId: number,
        ContratoID: number,
        EstatusID: string,
        DistribuidorNivelID: number,
        FechaInicio: Date,
        FechaFin: Date,
        GrupoID: number,
        Permiso: boolean,
        tipoDias: string
    },
}

const filtroExceptoCampo = (arr: any[], field: string, data: string) => {
    const response = field && data ? arr.filter((element) => element[`${field}`] == data) : arr;
    return response;
}

const filtro = (data: any[], values) => {
    let arr: any[] = filtroExceptoCampo(data, "", "");
    if (!isNaN(values.producto) && values.producto > 0)
        arr = filtroExceptoCampo(arr, "ProductoID", `${values.producto}`)
    if (!isNaN(values.sucursal) && values.sucursal > 0)
        arr = filtroExceptoCampo(arr, "SucursalID", `${values.sucursal}`)
    if (!isNaN(values.promotor) && values.coordinador > 0)
        arr = filtroExceptoCampo(arr, "creditoPromotorId", `${values.promotor}`)
    // if (!isNaN(values.grupo) && values.grupo > 0)
    //     arr = filtroExceptoCampo(arr, "GrupoID", `${values.grupo}`)
    return arr;
}

const ReasignarProspectoInteresado = (props: CatalogosType) => {
    let isMounted = React.useRef(true)
    const DatosDefecto = { ProductoID: 0, SucursalID: 0, creditoPromotorId:0,  Estatus: false }
    //const DatosDetalleDefecto = { DistribuidorID: 0, Estatus: true }
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const dataProspecto: any[] = []
    const dataInteresado: any[] = []
    //const optDistribuidor: any[] = []
    //const DatosDetalle: DBConfia_Creditos.IGruposDetalle_VW[] = []
    const [state, setState] = React.useState({
        Datos,
        DatosMostrar,
        dataProspecto,
        dataInteresado,
        //optDistribuidor,
        //DatosDetalle,
        Filtro: '',
        Cargando: true,
        Error: false,
        Form:
        {
            Mostrar: false,
            Datos: DatosDefecto,
            Id: undefined
        },
        FormDetalle:
        {
            Mostrar: false,
            //Datos: DatosDetalleDefecto,
            Id: 0
        },
        Detalle: false,
        TraspasarProspecto: false,
        TraspasarInteresados: false,
        creditoPromotorId: 0,
        SucursalID: 0,
        tipoUsuario: 0,
        initialValues:{
            DirectorID: 0,
            ProductoID: props.ui.Producto?.ProductoID ?? 0,
            SucursalID: 0,
            ZonaID: 0,
            EmpresaID: 0,
            DistribuidorID: 0,
            CoordinadorID: 0,
            creditoPromotorId: 0,
            ContratoID: 0,
            EstatusID: 'A',
            DistribuidorNivelID: 0,
            FechaInicio: moment().add(-30, 'd').toDate(),
            FechaFin: new Date(),
            GrupoID: 0,
            Permiso: true,
            tipoDias: '1',
        }
    })

    const [loading, setLoading] = useState(false);
    const [producto, setProducto] = useState(0);
    const [sucursal, setSucursal] = useState(0);
    const [promotor, setPromotor] = useState(0);
    const [grupo, setGrupo] = useState(0);
    const [tipoUsuario, setTipoUsuario] = useState(0);

    const filtrar = (values: any) => {
        const ProdID = !isNaN(values.ProductoID) ? values.ProductoID as number : 0;
        const SucursalIDAux = !isNaN(values.SucursalID) ? values.SucursalID as number : 0;
        const PromotorAux = !isNaN(values.creditoPromotorId) ? values.creditoPromotorId as number : 0;  
        state.initialValues.ProductoID = ProdID
        state.initialValues.SucursalID = SucursalIDAux
        setLoading(true);
        Funciones.FNGet2(props.oidc, { SucursalID: SucursalIDAux, creditoPromotorId: PromotorAux, ProductoID: ProdID})
            .then((respuesta: any) => {
                setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta, DatosMostrar: respuesta }))
                setLoading(false);
            })
            .catch(() => {
                setState(s => ({ ...s, Cargando: false, Error: true, Datos: [], DatosMostrar:[] }))
                setLoading(false);
            })
    }


  const FNGetDetallesiu = (creditoPromotorId: number, data: any) => {
        Funciones.FNGet(props.oidc, creditoPromotorId)
          .then((respuesta: any) => {
            console.log('Datos obtenidos:', respuesta);
            setState(s => ({...s, dataProspecto : respuesta}))
            toast.success("Prospectos obtenidos")
      
            setState(s => ({
              ...s,
              TraspasarProspecto: true,
              creditoPromotorId: creditoPromotorId,
              SucursalID: data.SucursalID,
            }));
          })
          .catch((error: any) => {
            console.error('Error al obtener datos:', error);
          });
      };
      
      const FNGetDetallesiu2 = (creditoPromotorId: number, data: any) => {
        Funciones.FNGetInteresadosT(props.oidc, creditoPromotorId)
          .then((respuesta: any) => {
            console.log('Datos obtenidos:', respuesta);
            setState(s => ({...s, dataInteresado : respuesta}))
            toast.success("Interesados obtenidos")
      
            setState(s => ({
              ...s,
              TraspasarInteresados: true,
              creditoPromotorId: creditoPromotorId,
              SucursalID: data.SucursalID,
            }));
          })
          .catch((error: any) => {
            console.error('Error al obtener datos:', error);
          });
      };


    const GetRolUsuario = () => {
        setLoading(true);
         Funciones.FNGetTipoUsuario(props.oidc, { usuarioID: 0 })
             .then((respuesta: any) => {
                 setTipoUsuario(respuesta.tipoUsuario)
                 state.tipoUsuario = respuesta.tipoUsuario
                 setLoading(false);
             })
             .catch((error) => console.log("error!", error))
             .finally(() => setLoading(false))
     } 

    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                { name: 'Id', selector: 'creditoPromotorId', sortable: true, wrap:true },
                { name: 'Producto', selector: 'NombreProducto', sortable: true, wrap:true},
                { name: 'Sucursal', selector: 'SucursalNombre', sortable: true, wrap:true, width:'140px'},
                { name: 'Promotor', selector: 'creditoPromotorNombre', sortable: true, width: '31%',wrap:true },
                //{ name: 'Estatus', selector: 'Estatus', sortable: true, cell: (props) => <span>{props.Estatus ? "Activo" : "Inactivo"}</span> },
                {
                    name: 'Traspasar Prospectos', sortable: false, center: true, maxWidth: '400px',
                    cell: (data) =>
                        <div style={{ overflowX: 'auto', whiteSpace: 'nowrap', }}>
                            {(state.tipoUsuario == 0 || state.tipoUsuario == 3) && 
                            <button 
                                title='Traspasar' 
                                data-tip data-for={`TrasDVTooltip${data.creditoPromotorId}`} 
                                className="asstext" 
                                style={{ margin: '.15em', width: '15%', height: '40px', padding: '0px', tableLayout: 'fixed', borderCollapse: 'collapse', color: 'green'}} 
                                type="button" 
                                onClick={() => {
                                    //setState(s => ({ ...s, TraspasarProspecto: true, creditoPromotorId: data.creditoPromotorId, SucursalID: data.SucursalID }))
                                    FNGetDetallesiu(data.creditoPromotorId, data)
                                    
                                    
                                }}>
                                <FaExchangeAlt />
                            </button> 
                            }
                            <ReactTooltip 
                                id={`TrasDVTooltip${data.ProspectoID}`}
                                type="info"
                                effect="solid"
                                clickable
                                globalEventOff="click"
                            >
                                Traspasar Prospectos
                            </ReactTooltip>
                        </div>
                },

                {
                    name: 'Traspasar Interesados', sortable: false, center : true, maxWidth : '400px',
                    cell: (data) =>
                        <div style={{ overflowX: 'auto', whiteSpace: 'normal'}}>
                            {(state.tipoUsuario == 0 || state.tipoUsuario == 3) && 
                            <button 
                                title='Traspasar' 
                                data-tip data-for={`TrasDVTooltip${data.creditoPromotorId}`} 
                                className="asstext" 
                                style={{ margin: '.15em', width: '15%', height: '40px', padding: '0px', tableLayout: 'fixed', borderCollapse: 'collapse', color: '#2655E6' }} 
                                type="button" 
                                color='blue'
                                onClick={() => {
                                   // setState(s => ({ ...s, TraspasarInteresados: true, creditoPromotorId: data.creditoPromotorID, SucursalID: data.SucursalID }))
                                   FNGetDetallesiu2(data.creditoPromotorId, data)
                                    
                                }}>
                                <FaExchangeAlt />
                            </button> }
                            <ReactTooltip 
                                id={`TrasDVTooltip${data.creditoPromotorId}`}
                                type="info"
                                effect="solid"
                                clickable
                                globalEventOff="click"
                            >
                                Traspasar Interesados
                            </ReactTooltip>
                        </div>
                }
            ]
        return colRet
    }, [])

    console.log('tipousuario2',tipoUsuario)
    useEffect(() => {
        GetRolUsuario()
    }, [tipoUsuario])

    useEffect(() => {
        const arr = filtro(state.Datos, { producto, sucursal, promotor});
        setState(s => ({ ...s, DatosMostrar: arr }));
    }, [producto, sucursal, promotor])


    const cbRespuesta = (Datos: any) =>
        setState(s => ({ ...s, Datos: Datos }))

    const cbAgregar = (item: any) =>
        setState({ ...state, Datos: [...state.Datos, item], Form: { ...state.Form, Mostrar: false, Datos: DatosDefecto } })

    const cbActualizar = (item: any) =>
        setState({ ...state, Datos: state.Datos.map(Dato => Dato.GrupoID === item.GrupoID ? item : Dato), Form: { ...state.Form, Mostrar: false, Datos: DatosDefecto } })

    const fnCancelar = () => setState({ ...state, Form: { ...state.Form, Mostrar: false } })


    return (
        <div>
                <Card Title="Reasignar Prospectos e Interesados">
                    <Card.Body>
                        <Card.Body.Content>
                        <FiltroPorUsuario
                            oidc={props.oidc}
                            ui={props.ui}
                            initialValues={state.initialValues}
                            onSubmit={filtrar}
                            loading={loading}
                            ReasignarPI ={true}
                        />

                                  {state.Datos.length > 0 &&
                                    <DataTable
                                        subHeader
                                        subHeaderComponent=
                                        {
                                            <div className="row">
                                                <div className="col-sm-12">
                                                    <div className="input-group mb-3">
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
                                        keyField={"creditoPromotorId"}
                                        defaultSortField={"creditoPromotorId"}
                                        columns={Columns}
                                        onChangeRowsPerPage={(currentRowsPerPage, currentPage) => {
                                            setState(s => ({ ...s, Error: false, DatosMostrar: state.Datos }))
                                        }}
                                    />}
                                       {state.TraspasarProspecto &&(tipoUsuario == 0 || tipoUsuario == 3) && 
                                       <ModalWin open={state.TraspasarProspecto} large>
                                            <ModalWin.Header>
                                                <h5 className={MODAL_TITLE_CLASS}>
                                                    {'Traspasar Prospectos a Promotor'}
                                                </h5>
                                                <button title='Cerrar' type="button" className="delete" onClick={() => setState({ ...state, TraspasarProspecto: false })} />
                                            </ModalWin.Header>
                                            <ModalWin.Body>
                                                <TraspasoProspecto
                                                dataProspectos = {state.dataProspecto}
                                                creditoPromotorId={state.creditoPromotorId} 
                                                SucursalID={state.SucursalID}  />
                                            </ModalWin.Body>
                                        </ModalWin>}  

                                         {state.TraspasarInteresados && (tipoUsuario == 0 || tipoUsuario == 3) && 
                                         <ModalWin open={state.TraspasarInteresados} large>
                                            <ModalWin.Header>
                                                <h5 className={MODAL_TITLE_CLASS}>
                                                    {'Traspasar Interesados a Promotor'}
                                                </h5>
                                                <button title='Cerrar' type="button" className="delete" onClick={() => setState({ ...state, TraspasarInteresados: false })} />
                                            </ModalWin.Header>
                                            <ModalWin.Body>
                                                <TraspasoInteresado 
                                                dataInteresados = {state.dataInteresado}
                                                creditoPromotorId={state.creditoPromotorId} 
                                                SucursalID={state.SucursalID} />
                                            </ModalWin.Body>
                                        </ModalWin>}    
    
                        </Card.Body.Content>
                    </Card.Body>
                </Card>
        </div >
    )
}

const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc,
    ui: state.UI
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(ReasignarProspectoInteresado)
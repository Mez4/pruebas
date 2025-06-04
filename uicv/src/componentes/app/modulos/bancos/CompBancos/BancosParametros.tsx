import React from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import * as Funciones from './BancosParametros/Funciones'
// import * as FnBancos from './BancoBanco/Funciones'
// import * as FnUsuarios from '../../seguridad/CompSeguridad/CompAdministracionUsuarios/Funciones'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'

// Icons
import { FaPencilAlt, FaPlus, FaSearch } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../global'
import { CForm } from './BancosParametros/CForm'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'

type CatalogosType = {
    Seguridad: IOidc
}

const BancoParametros = (props: CatalogosType) => {
    let isMounted = React.useRef(true)
    const DatosDefecto = {
        BancoID: 0,
        Cuenta: '',
        NombreCuenta: '',
        UsuarioId: 0,
        DispersionConvenio: '',
        PuedeDispersar: false,
        LogoImg: '',
        activa: false,
        global: false,
        orden: 0,
        importeEnBalance: 0,
        importePendienteBalance: 0
    }
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const optBancos: any[] = []
    const optUsuarios: any[] = []
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
        },
        optBancos,
        optUsuarios
    })

    const FNGetLocal = () => {

        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGet(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    /*  respuesta.forEach((element : any) => {
                          element.numeroCuenta = element.catCuentasBanco.numeroCuenta
                          element.saldo = element.catCuentasBanco.saldo
                      });*/
                    setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta }))
                    console.log(respuesta)
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
                }
            })
    }

    /* const FnGetBancos = () => {
         setState(s => ({ ...s }))
         FnBancos.FNGet(props.Seguridad)
             .then((respuesta: any) => {
                 if (isMounted.current === true) {
 
                     var bancos = respuesta.map((valor: any) => {
                         var obj = { value: valor.BancoID, label: valor.Banco };
                         return obj
                     });
 
                     setState(s => ({ ...s, optBancos: bancos }))
                 }
             })
             .catch(() => {
                 if (isMounted.current === true) {
                     setState(s => ({ ...s, optBancos: [] }))
                 }
             })
     }*/

    /*  const FnGetUsuarios = () => {
          setState(s => ({ ...s }))
          FnUsuarios.FNObtener(props.Seguridad)
              .then((respuesta: any) => {
                  if (isMounted.current === true) {
  
                      var usuarios = respuesta.map((valor: any) => {
                          var obj = { value: valor.UsuarioID, label: `${valor.Usuario} - ${valor.Nombre}` };
                          return obj
                      });
  
                      setState(s => ({ ...s, optUsuarios: usuarios }))
                  }
              })
              .catch(() => {
                  if (isMounted.current === true) {
                      setState(s => ({ ...s, optUsuarios: [] }))
                  }
              })
      }
      {
        { name: 'Convenio Dispersión', selector: 'DispersionConvenio', sortable: true, },
        { name: 'Puede Dispersar', selector: 'PuedeDispersar', sortable: true, cell: (props) => <span>{props.PuedeDispersar ? "Si" : "No"}</span> },
        { name: 'Activa', selector: 'activa', sortable: true, cell: (props) => <span>{props.activa ? "Si" : "No"}</span> },
        { name: 'Es global', selector: 'global', sortable: true, cell: (props) => <span>{props.global ? "Si" : "No"}</span> },
        { name: 'Orden', selector: 'orden', sortable: true, },
        { name: 'Importe en Balance', selector: 'importeEnBalance', sortable: true, },
        { name: 'Importe Pendiente', selector: 'importePendienteBalance', sortable: true, },
    }*/



    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                { name: 'Id', selector: 'bancoID', sortable: true, },
                { name: 'Banco', selector: 'nombre', sortable: true, },
                { name: 'Cuenta de Banco', selector: 'activo', sortable: true, },
                //{ name: 'Nombre', selector: 'numeroCuenta', sortable: true, },
                //{ name: 'Saldo', selector: 'saldo', sortable: true, },
                //{ name: 'Numero Cuenta', selector: 'Cuenta', sortable: true, },
                //{ name: 'Saldo', selector: 'Cuenta', sortable: true, },
                //{ name: 'Cuenta', selector: 'Cuenta', sortable: true, },
                //{ name: 'Estatus Cuenta', selector: 'Cuenta', sortable: true, },
                //{ name: 'Fecha Registro', selector: 'Cuenta', sortable: true, },
                //{ name: 'Monto Mínimo', selector: 'Cuenta', sortable: true, },
                //{ name: 'Monto Máximo', selector: 'Cuenta', sortable: true, },


                {
                    name: 'Acciones', sortable: false,
                    cell: (props) =>
                        <button className="asstext" type={"button"} onClick={() => {
                            setState(s => ({
                                ...s,
                                Form: {
                                    ...s.Form, Mostrar: true,
                                    Datos: {
                                        BancoID: props.BancoID,
                                        Cuenta: props.Cuenta,
                                        NombreCuenta: props.NombreCuenta,
                                        UsuarioId: props.UsuarioId,
                                        DispersionConvenio: props.DispersionConvenio,
                                        PuedeDispersar: props.PuedeDispersar,
                                        LogoImg: props.LogoImg,
                                        activa: props.activa,
                                        global: props.global,
                                        orden: props.orden,
                                        importeEnBalance: props.importeEnBalance,
                                        importePendienteBalance: props.importePendienteBalance
                                    },
                                    Id: props.CuentaID
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
        FNGetLocal()
        //FnGetBancos()
        //FnGetUsuarios()
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
        setState({
            ...state, Datos: [...state.Datos, item],
            Form: {
                ...state.Form, Mostrar: false,
                Datos: {
                    BancoID: 0,
                    Cuenta: '',
                    NombreCuenta: '',
                    UsuarioId: 0,
                    DispersionConvenio: '',
                    PuedeDispersar: false,
                    LogoImg: '',
                    activa: false,
                    global: false,
                    orden: 0,
                    importeEnBalance: 0,
                    importePendienteBalance: 0
                }
            }
        })

    /** funcion Callback al actualizar un item */
    const cbActualizar = (item: any) =>
        setState({
            ...state, Datos: state.Datos.map(Dato => Dato.CuentaID === item.CuentaID ? item : Dato), Form: {
                ...state.Form, Mostrar: false,
                Datos: {
                    BancoID: 0,
                    Cuenta: '',
                    NombreCuenta: '',
                    UsuarioId: 0,
                    DispersionConvenio: '',
                    PuedeDispersar: false,
                    LogoImg: '',
                    activa: false,
                    global: false,
                    orden: 0,
                    importeEnBalance: 0,
                    importePendienteBalance: 0
                }
            }
        })

    /** funcion para cancelar la forma */
    const fnCancelar = () => setState({ ...state, Form: { ...state.Form, Mostrar: false } })

    return (
        <div className="row">
            <div className="col-12">
                <Card Title="Administrar Cuentas">
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
                                                        <input type="text" className="form-control" placeholder="Buscar cuentas" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
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
                                        keyField={"bancoID"}
                                        defaultSortField={"bancoID"}
                                        columns={Columns}
                                    />
                                    <ModalWin open={state.Form.Mostrar}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>
                                                {state.Form.Id ? "Editar cuenta" : "Agregar cuenta"}
                                            </h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <CForm
                                                Seguridad={props.Seguridad}
                                                initialValues={state.Form.Datos}
                                                Id={state.Form.Id}
                                                cbActualizar={cbActualizar}
                                                cbGuardar={cbAgregar}
                                                fnCancelar={fnCancelar}
                                                optBancos={state.optBancos}
                                                optUsuarios={state.optUsuarios} />
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
    Seguridad: state.oidc
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(BancoParametros)
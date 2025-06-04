import React from 'react'
import Yup from '../../../global/yupLocale'
import { CustomFieldDatePicker2, CustomFieldText2, CustomSelect2 } from '../../global'
import { Sexos, ControlAsentamientos, BuscarAsentamiento, EstadosPais, OrientacionVialidadesTipo, VialidadesTipo, EstadoCivil, Escolaridad, ViviendasTipo, TipoVivienda } from '../../selectores'
import ModalWin, { MODAL_TITLE_CLASS } from '../../global/ModalWin'

type DireccionTipo = {
    Prefijo: string,
    Titulo: string,
    SubTitulo: string
}

export const FormaDatosGenerales = ({ Prefijo, Titulo, SubTitulo }: DireccionTipo) => {

    //Asentamiento
    const [showAsentamiento, setShowAsentamiento] = React.useState(false)

    const [AsentamientoID, setAsentamientoID] = React.useState(0)

    const [sexo, setSexo] = React.useState('')

    const [EstadoPais, setEstadoPais] = React.useState('')

    const [viviendasTipo, setViviendasTipo] = React.useState(0)

    const [orientacionVialidadesTipo, setOrientacionVialidadesTipo] = React.useState(0)

    const InitialValues: any = {}
    InitialValues[`${Prefijo}AsentamientoID`] = ''
    InitialValues[`${Prefijo}NombreVialidad`] = ''
    InitialValues[`${Prefijo}NumeroExterior`] = ''
    InitialValues[`${Prefijo}NumeroInterior`] = ''
    InitialValues[`${Prefijo}vialidadTipoId`] = 0
    InitialValues[`${Prefijo}orientacionVialidadTipoId`] = 0
    InitialValues[`${Prefijo}ViviendaTipoId`] = 0
    InitialValues[`${Prefijo}Telefono`] = ''

    const ValSchemaObjecet: any = {}

    ValSchemaObjecet[`${Prefijo}AsentamientoID`] = Yup.number().typeError('Ingrese un número').required().min(1)
    ValSchemaObjecet[`${Prefijo}NombreVialidad`] = Yup.string().required()
    ValSchemaObjecet[`${Prefijo}NumeroExterior`] = Yup.string().required()
    ValSchemaObjecet[`${Prefijo}vialidadTipoId`] = Yup.number().required("Seleccione una opcion").moreThan(0, 'Seleccione una opcion')
    ValSchemaObjecet[`${Prefijo}orientacionVialidadTipoId`] = Yup.number().required("Seleccione una opcion").moreThan(0, 'Seleccione una opcion')
    ValSchemaObjecet[`${Prefijo}ViviendaTipoId`] = Yup.number().required("Seleccione una opcion").moreThan(0, 'Seleccione una opcion')
    ValSchemaObjecet[`${Prefijo}Telefono`] = Yup.string().min(10).max(10)




    const fnOpen = () => setShowAsentamiento(true)

    const fnCancelar = () => setShowAsentamiento(false)

    const sexoSelected = (val: string) => setSexo(val)

    const estadoPaisSelected = (val: string) => setEstadoPais(val)

    const cbAceptar = (id: number) => {
        setShowAsentamiento(false);
        setAsentamientoID(id);
    }

    const viviendasTipoSelected = (val: number) => setViviendasTipo(val)
    const orientacionVialidadesTipoSelected = (val: number) => setOrientacionVialidadesTipo(val)


    return {
        InitialValues,
        Propiedades: {},
        Titulo,
        SubTitulo,
        ValidationSchema: Yup.object().shape(ValSchemaObjecet),
        Componente: (cprops: any) => (
            <div>
                <div>

                    {/* <div className={"row"}>
                        <div className={"col-sm-12 col-md-6"}>
                            <CustomFieldText2 {...cprops} label={'Nombre'} name={`${Prefijo}Nombre`} placeholder={'Nombre(s)'} />
                        </div>
                        <div className={"col-sm-12 col-md-6"}>
                            <CustomFieldText2 {...cprops} label={'A.Paterno'} name={`${Prefijo}ApellidoPaterno`} placeholder={'Apellido paterno'} />
                        </div>
                    </div> */}

                    {/* <div className={"row"}>
                        <div className={"col-sm-12 col-md-6"}>
                            <CustomFieldText2 {...cprops} label={'A.Materno'} name={`${Prefijo}ApellidoMaterno`} placeholder={'Apellido materno'} />
                        </div>
                        <div className={"col-sm-12 col-md-6"}>
                            <CustomFieldDatePicker2 {...cprops} label={'F.Nacimiento'} name={`${Prefijo}FechaNacimiento`} placeholder={'Fecha nacimiento'} />
                        </div>
                    </div> */}

                    {/* <div className={"row"}>
                        <div className={"col-sm-12 col-md-6"}>
                            <CustomFieldText2 disabled={cprops.Cargando} label={'Tel.Movil'} name={`${Prefijo}TelefonoMovil`} placeholder={'Telefono movil'} />
                        </div>
                        <div className={"col-sm-12 col-md-6"}>
                            <Sexos {...cprops} label={'Sexo'} name={`${Prefijo}SexoID`} accion={sexoSelected} valor={sexo} />
                        </div>
                    </div> */}

                    {/* <div className={"row"}>
                        <div className={"col-sm-12 col-md-6"}>
                            <CustomFieldText2 {...cprops} label={'Correo'} name={`${Prefijo}Correo`} placeholder={'Correo'} />
                        </div>
                        <div className={"col-sm-12 col-md-6"}>
                            <EstadosPais {...cprops} label={'E.Nacimiento'} name={`${Prefijo}LugarNacimiento`} accion={estadoPaisSelected} valor={EstadoPais} />
                        </div>
                        
                    </div> */}

                </div>

                <div>
                    <h6 className={MODAL_TITLE_CLASS}>*Domicilio</h6>
                    <ControlAsentamientos name={`${Prefijo}AsentamientoID`} valor={AsentamientoID} fnOpen={fnOpen} />

                    <div className={"row"}>
                        <div className={"col-sm-12 col-md-6"}>
                            <CustomFieldText2 {...cprops} label={'Nombre Vialidad'} datoType='text' name={`${Prefijo}NombreVialidad`} placeholder={'Nombre Vialidad'} />
                            <VialidadesTipo {...cprops} label={'Tipo de Vialidad'} name={`${Prefijo}vialidadTipoId`} placeholder={'vialidadTipoId'} />

                            <ViviendasTipo {...cprops} label={'Tipo Vivienda'} name={`${Prefijo}ViviendaTipoId`} accion={viviendasTipoSelected} valor={viviendasTipo} placeholder={'Tipo Vivienda'} />

                            <OrientacionVialidadesTipo {...cprops} label={'Tipo Orientacion'} name={`${Prefijo}orientacionVialidadTipoId`} accion={orientacionVialidadesTipoSelected} valor={orientacionVialidadesTipo} placeholder={'Tipo Orientacion'} />

                        </div>
                        <div className={"col-sm-12 col-md-6"}>

                            <CustomFieldText2 {...cprops} label={'Número Exterior'} datoType='text' name={`${Prefijo}NumeroExterior`} placeholder={'Número Exterior'} />
                            <CustomFieldText2 {...cprops} label={'Número Interior'} datoType='text' name={`${Prefijo}NumeroInterior`} placeholder={'Número Interior (Opcional)'} />
                            <CustomFieldText2 {...cprops} label={'Tel.Domicilio'} datoType='number' name={`${Prefijo}Telefono`} placeholder={'Teléfono Fijo'} />
                        </div>

                    </div>

                </div>

                <ModalWin open={showAsentamiento}>
                    <ModalWin.Header>
                        <h5 className={MODAL_TITLE_CLASS}>
                            {"Buscar Asentamiento"}
                        </h5>
                    </ModalWin.Header>
                    <ModalWin.Body>
                        {showAsentamiento &&
                            <BuscarAsentamiento
                                initialValues={{
                                    EstadoId: 0,
                                    MunicipioId: 0,
                                    TipoAsentamientoId: 0,
                                    CodigoPostalID: 0,
                                    AsentamientoID: 0
                                }}
                                cbAceptar={cbAceptar}
                                fnCancelar={fnCancelar}
                            />}
                    </ModalWin.Body>
                </ModalWin>
            </div>
        )
    }
}
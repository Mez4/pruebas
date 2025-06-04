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


    const InitialValues: any = {}
    InitialValues[`${Prefijo}Nombre`] = ''
    InitialValues[`${Prefijo}ApellidoPaterno`] = ''
    InitialValues[`${Prefijo}ApellidoMaterno`] = ''
    InitialValues[`${Prefijo}FechaNacimiento`] = ''
    InitialValues[`${Prefijo}SexoID`] = ''
    InitialValues[`${Prefijo}cp`] = ''
    InitialValues[`${Prefijo}Telefeno`] = ''
    InitialValues[`${Prefijo}Correo`] = ''
    InitialValues[`${Prefijo}LugarNacimiento`] = ''
    InitialValues[`${Prefijo}viviendaTipoId`] = 0


    InitialValues[`${Prefijo}AsentamientoID`] = ''
    InitialValues[`${Prefijo}Localidad`] = ''
    InitialValues[`${Prefijo}Calle`] = ''
    InitialValues[`${Prefijo}NumeroExterior`] = ''
    InitialValues[`${Prefijo}vialidadTipoId`] = 0
    InitialValues[`${Prefijo}orientacionVialidadTipoId`] = 0

    const ValSchemaObjecet: any = {}
    ValSchemaObjecet[`${Prefijo}Nombre`] = Yup.string().required().min(3).max(120)
    ValSchemaObjecet[`${Prefijo}ApellidoPaterno`] = Yup.string().required().min(3).max(120,)
    ValSchemaObjecet[`${Prefijo}FechaNacimiento`] = Yup.string().required()

    ValSchemaObjecet[`${Prefijo}SexoID`] = Yup.string().required().min(1).max(1, 'Selecciona una opción valida')
    ValSchemaObjecet[`${Prefijo}Telefeno`] = Yup.string().required().min(10).max(10)
    ValSchemaObjecet[`${Prefijo}Correo`] = Yup.string().required().min(3).max(120)
    ValSchemaObjecet[`${Prefijo}LugarNacimiento`] = Yup.string().required().min(3).max(120)

    ValSchemaObjecet[`${Prefijo}AsentamientoID`] = Yup.number().typeError('Ingrese un número').required().min(1)
    ValSchemaObjecet[`${Prefijo}Calle`] = Yup.string().required()
    ValSchemaObjecet[`${Prefijo}NumeroExterior`] = Yup.string().required()
    ValSchemaObjecet[`${Prefijo}vialidadTipoId`] = Yup.number().required("Seleccione una opcion").moreThan(0, 'Seleccione una opcion')
    ValSchemaObjecet[`${Prefijo}orientacionVialidadTipoId`] = Yup.number().required("Seleccione una opcion").moreThan(0, 'Seleccione una opcion')
    ValSchemaObjecet[`${Prefijo}viviendaTipoId`] = Yup.number().required("Seleccione una opcion").moreThan(0, 'Seleccione una opcion')



    const fnOpen = () => setShowAsentamiento(true)

    const fnCancelar = () => setShowAsentamiento(false)

    const sexoSelected = (val: string) => setSexo(val)

    const estadoPaisSelected = (val: string) => setEstadoPais(val)

    const cbAceptar = (id: number) => {
        setShowAsentamiento(false);
        setAsentamientoID(id);
    }



    return {
        InitialValues,
        Propiedades: {},
        Titulo,
        SubTitulo,
        ValidationSchema: Yup.object().shape(ValSchemaObjecet),
        Componente: (cprops: any) => (
            <div>
                <div>

                    <div className={"row"}>
                        <div className={"col-sm-12 col-md-6"}>
                            <CustomFieldText2 {...cprops} label={'Nombre'} datoType='text' name={`${Prefijo}Nombre`} placeholder={'Nombre(s)'} />
                        </div>
                        <div className={"col-sm-12 col-md-6"}>
                            <CustomFieldText2 {...cprops} label={'A.Paterno'} datoType='text' name={`${Prefijo}ApellidoPaterno`} placeholder={'Apellido paterno'} />
                        </div>
                    </div>

                    <div className={"row"}>
                        <div className={"col-sm-12 col-md-6"}>
                            <CustomFieldText2 {...cprops} label={'A.Materno'} datoType='text' name={`${Prefijo}ApellidoMaterno`} placeholder={'Apellido materno'} />
                        </div>
                        <div className={"col-sm-12 col-md-6"}>
                            <CustomFieldDatePicker2 {...cprops} label={'F.Nacimiento'} name={`${Prefijo}FechaNacimiento`} placeholder={'Fecha nacimiento'} />
                        </div>
                    </div>

                    <div className={"row"}>
                        <div className={"col-sm-12 col-md-6"}>
                            <CustomFieldText2 disabled={cprops.Cargando} label={'Tel.Movil'} datoType='number' name={`${Prefijo}Telefeno`} placeholder={'Telefono movil'} />
                        </div>
                        <div className={"col-sm-12 col-md-6"}>
                            <Sexos {...cprops} label={'Sexo'} name={`${Prefijo}SexoID`} accion={sexoSelected} valor={sexo} />
                        </div>
                    </div>

                    <div className={"row"}>
                        <div className={"col-sm-12 col-md-6"}>
                            <CustomFieldText2 {...cprops} label={'Correo'} datoType='text' name={`${Prefijo}Correo`} placeholder={'Correo'} />
                        </div>
                        <div className={"col-sm-12 col-md-6"}>
                            <EstadosPais {...cprops} label={'E.Nacimiento'} name={`${Prefijo}LugarNacimiento`} accion={estadoPaisSelected} valor={EstadoPais} />
                        </div>
                    </div>

                </div>

                <div>
                    <h6 className={MODAL_TITLE_CLASS}>*Domicilio</h6>
                    <ControlAsentamientos name={`${Prefijo}AsentamientoID`} valor={AsentamientoID} fnOpen={fnOpen} />

                    <div className={"row"}>
                        <div className={"col-sm-12 col-md-6"}>
                            <ViviendasTipo {...cprops} label={'viviendaTipoId'} name={`${Prefijo}viviendaTipoId`} />
                        </div>
                        <div className={"col-sm-12 col-md-6"}>
                            <CustomFieldText2 {...cprops} label={'Calle'} datoType='text' name={`${Prefijo}Calle`} placeholder={'Calle'} />
                        </div>
                    </div>

                    <div className={"row"}>
                        <div className={"col-sm-12 col-md-6"}>
                            <VialidadesTipo {...cprops} label={'vialidadTipoId'} name={`${Prefijo}vialidadTipoId`} placeholder={'vialidadTipoId'} />
                        </div>
                        <div className={"col-sm-12 col-md-6"}>
                            <CustomFieldText2 {...cprops} label={'Numero'} datoType='text' name={`${Prefijo}NumeroExterior`} placeholder={'Numero Exterior'} />
                        </div>
                    </div>

                    <div className={"row"}>
                        <div className={"col-sm-12 col-md-6"}>
                            <OrientacionVialidadesTipo {...cprops} label={'orientacionID'} name={`${Prefijo}orientacionVialidadTipoId`} placeholder={'orientacionVialidadTipoId'} />
                        </div>
                        <div className={"col-sm-12 col-md-6"}>
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
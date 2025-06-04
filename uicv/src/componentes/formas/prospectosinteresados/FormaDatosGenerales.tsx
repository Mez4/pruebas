import React from 'react'
import Yup from '../../../global/yupLocale'
import { CustomFieldDatePicker, CustomFieldDatePicker2, CustomFieldText2 } from '../../global'
import { Sexos, ControlAsentamientos, BuscarAsentamiento, EstadosPais } from '../../selectores'
import ModalWin, { MODAL_TITLE_CLASS } from '../../global/ModalWin'
import axios from 'axios'
import { GetServerUrl } from '../../../global/variables'
import { IOidc } from '../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'
import styled from 'styled-components';
import moment from 'moment'

type DireccionTipo = {
    Prefijo: string,
    Titulo: string,
    SubTitulo: string,
    SexoID?: string,
    LugarNac?: string,
    AsentID?: number,
    TelefonoMovil?: string,
    BC?: number,
    oidc: IOidc,
}

export const FormaDatosGenerales = ({ Prefijo, Titulo, SubTitulo, SexoID, LugarNac, AsentID, TelefonoMovil, BC, oidc }: DireccionTipo) => {

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
    InitialValues[`${Prefijo}TelefonoMovil`] = ''
    InitialValues[`${Prefijo}LugarNacimiento`] = ''
    InitialValues[`${Prefijo}CURP`] = ''

    InitialValues[`${Prefijo}AsentamientoID`] = ''
    InitialValues[`${Prefijo}Localidad`] = ''
    InitialValues[`${Prefijo}Calle`] = ''
    InitialValues[`${Prefijo}NumeroExterior`] = ''
    InitialValues[`${Prefijo}Telefono`] = ''

    const ValSchemaObjecet: any = {}
    ValSchemaObjecet[`${Prefijo}Nombre`] = Yup.string().required().min(3).max(120)
    ValSchemaObjecet[`${Prefijo}ApellidoPaterno`] = Yup.string().required().min(1).max(120)
    ValSchemaObjecet[`${Prefijo}ApellidoMaterno`] = Yup.string().required().min(1).max(120)
    ValSchemaObjecet[`${Prefijo}FechaNacimiento`] = Yup.string().required().test("FechaNacimiento", "La persona interesada debe ser mayor de edad", (value: any) => moment().diff(moment(value), "years") >= 18)
    ValSchemaObjecet[`${Prefijo}SexoID`] = Yup.string().required().min(1).max(1, 'Selecciona una opción valida')
    ValSchemaObjecet[`${Prefijo}TelefonoMovil`] = Yup.string().required().min(10).max(10)
    ValSchemaObjecet[`${Prefijo}Telefono`] = Yup.string().min(10).max(10)
    ValSchemaObjecet[`${Prefijo}LugarNacimiento`] = Yup.string().required().min(3).max(120)
    ValSchemaObjecet[`${Prefijo}CURP`] = Yup.string().required("OBLIGATORIO").min(18, '19 CARACTERES').max(18, '18 CARACTERES')

    ValSchemaObjecet[`${Prefijo}AsentamientoID`] = Yup.number().typeError('Ingrese un número').required().min(1)
    ValSchemaObjecet[`${Prefijo}Localidad`] = Yup.string().required().min(1).max(50)
    ValSchemaObjecet[`${Prefijo}Calle`] = Yup.string().required().min(1).max(50)
    ValSchemaObjecet[`${Prefijo}NumeroExterior`] = Yup.string().required().min(1).max(10)

    const fnOpen = () => setShowAsentamiento(true)

    const fnCancelar = () => setShowAsentamiento(false)

    const sexoSelected = (val: string) => setSexo(val)

    const estadoPaisSelected = (val: string) => setEstadoPais(val)

    const cbAceptar = (id: number) => {
        setShowAsentamiento(false);
        setAsentamientoID(id);
    }

    if (SexoID && sexo === '')
        sexoSelected(SexoID)

    if (LugarNac && EstadoPais === '')
        estadoPaisSelected(LugarNac)

    if (AsentID && AsentamientoID === 0) {
        setAsentamientoID(AsentID)
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
                    <CustomFieldText2 {...cprops} datoType='text' disabled={BC === 2} label={'Nombre'} name={`${Prefijo}Nombre`} placeholder={'Nombre(s)'} />
                    <div className={"row"}>
                        <div className={"col-sm-12 col-md-6"}>
                            <CustomFieldText2 {...cprops} datoType='text' disabled={BC === 2} label={'A.Paterno'} name={`${Prefijo}ApellidoPaterno`} placeholder={'Apellido Paterno'} />
                        </div>
                        <div className={"col-sm-12 col-md-6"}>
                            <CustomFieldText2 {...cprops} datoType='text' disabled={BC === 2} label={'A.Materno'} name={`${Prefijo}ApellidoMaterno`} placeholder={'Apellido Materno'} />
                        </div>
                    </div>
                    <div className={"row"}>
                        <div className={"col-sm-12 col-md-6"} >
                            <CustomFieldDatePicker2 {...cprops} disabled={BC === 2} label={'F.Nacimiento'} name={`${Prefijo}FechaNacimiento`} placeholder={'Fecha Nacimiento'} />
                        </div>
                        <div className={"col-sm-12 col-md-6"}>
                            <Sexos {...cprops} label={'Sexo'} disabled={BC === 2} name={`${Prefijo}SexoID`} accion={sexoSelected} valor={sexo} />
                        </div>
                    </div>
                    <div className={"row"}>
                        <div className={"col-sm-12 col-md-6"}>
                            <CustomFieldText2 {...cprops} datoType='text' disabled={BC === 2} label={'CURP'} name={`${Prefijo}CURP`} placeholder={'CURP'} />
                           
                        </div>
                        <div className={"col-sm-12 col-md-6"}>
                            <CustomFieldText2 disabled={cprops.Cargando} label={'Tel.Móvil'} datoType='text' name={`${Prefijo}TelefonoMovil`} placeholder={'Teléfono Móvil'} />
                        </div>
                    </div>
                    <div className={"row"}>
                        <div className={"col-sm-12 col-md-6"}>
                            <EstadosPais {...cprops} label={'E.Nacimiento'} name={`${Prefijo}LugarNacimiento`} accion={estadoPaisSelected} valor={EstadoPais} />
                        </div>
                    </div>


                </div>

                <div>
                    <h6 className={MODAL_TITLE_CLASS}>*Domicilio del Interesado</h6>
                    <ControlAsentamientos name={`${Prefijo}AsentamientoID`} valor={AsentamientoID} fnOpen={fnOpen} />
                    <div className={"row"}>
                        <div className={"col-sm-12 col-md-6"}>
                            <CustomFieldText2 {...cprops} datoType='text' label={'Calle'} name={`${Prefijo}Calle`} placeholder={'Calle'} />
                        </div>
                        <div className={"col-sm-12 col-md-6"}>
                            <CustomFieldText2 {...cprops} datoType='text' label={'Localidad'} name={`${Prefijo}Localidad`} placeholder={'Localidad o Ciudad'} />
                        </div>
                    </div>
                    <div className={"row"}>
                        <div className={"col-sm-12 col-md-6"}>
                            <CustomFieldText2 {...cprops} datoType='text' label={'Número'} name={`${Prefijo}NumeroExterior`} placeholder={'Número Exterior'} />
                        </div>
                        <div className={"col-sm-12 col-md-6"}>
                            <CustomFieldText2 {...cprops} datoType='number' label={'Tel.Domicilio'} name={`${Prefijo}Telefono`} placeholder={'Teléfono Fijo(Opcional)'} />
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
import Yup from "../../../global/yupLocale";
import { CustomFieldDatePicker, CustomFieldDatePicker2, CustomFieldText2, CustomSelect2 } from "../../global";

export const FormaBasicoAgregarUsuarioRapido = (productosOptions: { value: number, label: string }[]) => {
  return {
    InitialValues: {
      Nombre: "",
      ApellidoPat: "",
      ApellidoMat: "",
      CorreoElectronico: "",
      CURP: "",
    },
    Propiedades: {},
    Titulo: "Datos personas",
    SubTitulo: "Basicos",
    ValidationSchema: Yup.object().shape({
      Nombre: Yup.string().required().min(3).max(120),
      ApellidoPat: Yup.string().required().min(3).max(120),
      ApellidoMat: Yup.string().required().min(3).max(120),
      FechaNacimiento: Yup.date().required(),
      SACId: Yup.number().required(),
      CorreoElectronico: Yup.string().required().email(),
      CURP: Yup.string()
        .required()
        .matches(
          /^[A-Za-z]{4}\d{6}[H,M][A-Za-z]{5}[A-Za-z\d]{2}$/i,
          "Introduce una CURP válida"
        ),
      ProductoID: Yup.number().required(),
    }),
    Componente: (cprops: any) => (
      <div>
        <CustomFieldText2
          {...cprops}
          disabled={false}
          label={"Nombre"}
          name={"Nombre"}
          placeholder={"Nombre(s)"}
        />
        <CustomFieldText2
          {...cprops}
          disabled={false}
          label={"A.Paterno"}
          name={"ApellidoPat"}
          placeholder={"Apellido Paterno"}
        />
        <CustomFieldText2
          {...cprops}
          disabled={false}
          label={"A.Materno"}
          name={"ApellidoMat"}
          placeholder={"Apellido Materno"}
        />
        <CustomFieldText2
          {...cprops}
          disabled={false}
          datoType="text"
          label={"CURP"}
          name={"CURP"}
          placeholder={"CURP"}
        />
        <CustomFieldText2
          {...cprops}
          disabled={false}
          datoType="number"
          label={"Id SAC"}
          name={"SACId"}
          placeholder={"Id SAC"}
        />
        <CustomFieldDatePicker2
          {...cprops}
          disabled={false}
          label={"F.Nacimiento"}
          name={"FechaNacimiento"}
          placeholder={"Fecha de nacimiento"}
        />
        <CustomSelect2
          name="ProductoID"
          disabled={false}
          label="Producto"
          options={productosOptions}
          placeholder="Selecciona un producto"
          addDefault={false}
        />
        <CustomFieldText2
          {...cprops}
          disabled={false}
          label={"E-Mail"}
          datoType="text"
          name={"CorreoElectronico"}
          placeholder={"Correo electronico (Opcional)"}
        />
      </div>
    ),
  };
};

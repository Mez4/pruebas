/*eslint-disable no-template-curly-in-string*/
import printValue from 'yup/lib/util/printValue'
type notPropsType = {
    path: any,
    type: any,
    value: any,
    originalValue: any
}
export const mixed = {
    default: 'No es válido.',
    required: 'Campo obligatorio',
    oneOf: 'Debe de ser uno de los siguientes valores: ${values}',
    notOneOf: 'No debe de ser uno de los siguientes valores: ${values}',
    notType: ({ path, type, value, originalValue }: notPropsType) => {
        const isCast = originalValue != null && originalValue !== value;
        let msg =
            `${path} debe ser un \`${type}\` Tipo, ` +
            `pero el valor final fue: \`${printValue(value, true)}\`` +
            (isCast ?
                ` (Reparto del valor \`${printValue(originalValue, true)}\`).` :
                '.');
        if (value === null) {
            msg +=
                `\n Si "nulo" pretende ser un valor vacío, asegúrese de marcar el esquema como` +
                ' `.nullable()`';
        }
        return msg;
    }
};
export const string = {
    length: 'Debe ser contener ${length} caracteres',
    min: 'Minimo ${min} caracteres',
    max: 'Maximo ${max} caracteres',
    matches: 'Debe coincidir con: "${regex}"',
    email: 'Correo electrónico inválido',
    url: 'URL inválida',
    trim: 'Debe ser una cadena recortada',
    lowercase: '${path} debe ser una cadena en minúsculas',
    uppercase: '${path} debe ser una cadena en mayúsculas',
};
export const number = {
    min: '${path} debe ser mayor que o igual a ${min}',
    max: '${path} debe ser menor que o igual a ${max}',
    lessThan: '${path} debe ser inferior a ${less}',
    moreThan: '${path} debe ser mayor que ${more}',
    positive: '${path} debe ser un número positivo',
    negative: '${path} debe ser un número negativo',
    integer: '${path} debe ser un entero',
};
export const date = {
    min: '${path} campo debe ser posterior a ${min}',
    max: '${path} campo debe ser anterior a ${max}',
};
export const boolean = {};
export const object = {
    noUnknown: '${path} campo no puede tener llaves no especificados en la forma del objeto',
};
export const array = {
    min: '${path} campo debe tener al menos ${min} elementos',
    max: '${path} campo debe tener menos de o igual a ${max} elementos',
};

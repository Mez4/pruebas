import React from 'react';
import { Formik, Form, Field, FieldArray, getIn, ErrorMessage } from 'formik';
import * as Yup from 'yup';

 type Type = {
   initialValues: {
       friends: any[]
   }
 }

const ArrayList = (props: Type) => {

    const ErrorItem = ({ name }: any) => (
        <Field
          name={name}
          render={({ form }: any) => {
            const error = getIn(form.errors, name);
            const touch = getIn(form.touched, name);
            return touch && error ? error : null;
          }}
        />
      );

    return(
        <div>
            <h1>Friend List</h1>
            <Formik
            initialValues={ props.initialValues }
            enableReinitialize
            validationSchema={Yup.object().shape({
                friends: Yup.array()
                .of(
                    Yup.object().shape({
                    name: Yup.string().min(4, 'too short').required('Required'), 
                    value: Yup.string().min(3, 'cmon').required('Required'), 
                    })
                )
                .required('Must have friends') 
                .min(3, 'Minimum of 3 friends'),
            })}
            onSubmit={(values: any) =>
                    console.log(values)
            }
            render={({ values }) => (
                <Form>
                    <div className="mb-3">
                <FieldArray
                    name="friends"
                    render={arrayHelpers => (
                    <div>
                        {values.friends && values.friends.length > 0 ? (
                        values.friends.map((friend, index) => (
                            <div key={index}>
                                <Field name={`friends[${index}].name`} />
                                <Field name={`friends.${index}.value`} />
                                <button
                                    type="button"
                                    onClick={() => arrayHelpers.remove(index)} 
                                >
                                    -
                                </button>
                                <button
                                    type="button"
                                    onClick={() => arrayHelpers.push({ name: '', value: '' })} 
                                >
                                    +
                                </button> 
                                <ErrorItem name={`friends[${index}].name`} />
                            </div>
                        ))
                        ) : (
                            <>
                        <button type="button" onClick={() => arrayHelpers.push({ name: '', value: '' })}>
                            Add a friend
                        </button>
                        </>
                        )}
                        <div>
                        <button type="submit">Submit</button>
                        </div>
                    </div>
                    )}
                />
                <ErrorMessage component="div" name='friends' className="text-danger" />
                </div>
                </Form>
            )}
            />
        </div>
    )
}

export default ArrayList
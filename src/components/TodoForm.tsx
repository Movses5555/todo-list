import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Button, Input, DatePicker } from 'antd';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { addTodo, editTodo, Todo, selectedTodo } from '../features/todos/todosSlice';
import dayjs, { Dayjs } from 'dayjs';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

interface TodoForm {
  title?: string;
  description?: string;
  deadline?: string;
}

interface TodoFormProps extends TodoForm {
  todo: selectedTodo,
  isEdit: boolean;
}


const TodoForm: React.FC<TodoFormProps> = ({
  todo,
  isEdit,
}) => {
  const dispatch = useDispatch();

  const handleSubmit = ({title, description, deadline}: Omit<selectedTodo, 'id' | 'status'>) => {
    const data:selectedTodo = {
      id: isEdit ? todo.id: uuidv4(),
      title: title,
      description: description,
      deadline: deadline,
      status: isEdit ? todo.status: "pending",
    };
    if(isEdit) {
      dispatch(editTodo(data));
    } else {
      dispatch(addTodo(data));
    }
  }
  
  const initialValues= { 
    title: todo.title, 
    description: todo.description,
    deadline: todo.deadline 
  }

  const disabledDate = (current: Dayjs):boolean => {
    return current && current < dayjs().startOf('day');
  }

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize={true}
      validationSchema={Yup.object({
        title: Yup.string().required('Required'),
        description: Yup.string(),
        deadline: Yup.date()
      })}
      onSubmit={(values, { resetForm }) => {
        handleSubmit({...values})
        resetForm();
      }}
    >
      {({ setFieldValue, values }) => {        
        return (
          <Form className="space-y-4">
            <div>
              <label htmlFor="title">Title</label>
              <Field name="title" as={Input} className="block w-full px-2 py-1 border rounded-lg" />
              <ErrorMessage name="title" component="div" className="text-red-600" />
            </div>
            <div>
              <label htmlFor="description">Description</label>
              <Field name="description" as={Input.TextArea} className="block w-full px-2 py-1 border rounded-lg" />
            </div>
            <div className='flex flex-col max-w-40'>
              <label htmlFor="deadline">Deadline</label>
              <DatePicker
                disabledDate={disabledDate}
                allowClear
                value={values.deadline ? moment(values.deadline) : null}
                onChange={(date, dateString) => setFieldValue('deadline', dateString)}
              />
              <ErrorMessage name="deadline" component="div" className="text-red-600" />
            </div>
            <div className='flex justify-center'>
              <Button type="primary" htmlType="submit">
                {isEdit ? "Save" : "Add Todo"}
              </Button>
            </div>
          </Form>
        )
      }}
    </Formik>
  );
};

export default TodoForm;

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { Modal, Button } from 'antd';
import TodoForm from './TodoForm';
import { changeAddToDoModalState } from '../features/todos/todosSlice';

const AddTodoModal: React.FC = () => {
  const dispatch = useDispatch();
  const openAddToDoModal = useSelector((state: RootState) => state.todos.openAddToDoModal);
  const isEditModal = useSelector((state: RootState) => state.todos.isEditModal);
  const selectedTodo = useSelector((state: RootState) => state.todos.selectedTodo);

  const showModal = () => {
    dispatch(changeAddToDoModalState(true));
  };

  const handleCancel = () => {
    dispatch(changeAddToDoModalState(false));
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Add New ToDo
      </Button>
      <Modal
        title={ isEditModal ? "Edit ToDo" : "Add New ToDo" }
        open={!!openAddToDoModal}
        onCancel={handleCancel}
        footer={null}
      >
        {
          openAddToDoModal && (
            <TodoForm
              todo={selectedTodo}
              isEdit={isEditModal}
            />
          )
        }
      </Modal>
    </>
  );
};

export default AddTodoModal;

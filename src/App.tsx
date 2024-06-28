import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { Droppable } from 'react-beautiful-dnd';
import TodoList from './components/TodoList';
import AddTodoModal from './components/AddTodoModal';
import { RootState } from './app/store';
import { checkOverdue, updateStatus, Status } from './features/todos/todosSlice';
import { Typography, Row } from "antd";

const { Title } = Typography;

const App: React.FC = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state: RootState) => state.todos.todos);

  useEffect(() => {
    dispatch(checkOverdue());
    const interval = setInterval(() => {
      dispatch(checkOverdue());
    }, 86400000);

    return () => clearInterval(interval);
  }, [dispatch]);

  const lists = {
    pending: todos.filter((todo) => todo.status === 'pending'),
    completed: todos.filter((todo) => todo.status === 'completed'),
    overdue: todos.filter((todo) => todo.status === 'overdue'),
    removed: todos.filter((todo) => todo.status === 'removed'),
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    let newStatus: Status;
    switch (destination.droppableId) {
      case 'pending':
        newStatus = 'pending';
        break;
      case 'completed':
        newStatus = 'completed';
        break;
      case 'overdue':
        newStatus = 'overdue';
        break;
      case 'removed':
        newStatus = 'removed';
        break;
      default:
        return;
    }

    dispatch(updateStatus({ id: draggableId, status: newStatus }));
  };

  return (
    <div className="flex flex-col h-screen items-center p-8 space-y-8">
      <Title>Todo List App</Title>
      <div className="self-start">
        <AddTodoModal />
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Row gutter={1} className='w-full h-full overflow-x-auto'>
          <Droppable droppableId="lists" direction="horizontal" type="list">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="flex gap-6 items-start h-full"
              >
                <TodoList title="Pending List" todos={lists.pending} droppableId="pending" />
                <TodoList title="Completed List" todos={lists.completed} droppableId="completed" />
                <TodoList title="Overdue List" todos={lists.overdue} droppableId="overdue" />
                <TodoList title="Removed List" todos={lists.removed} droppableId="removed" />
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </Row>
      </DragDropContext>
    </div>
  );
};

export default App;

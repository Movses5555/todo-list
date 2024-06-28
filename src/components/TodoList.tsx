import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { Todo } from '../features/todos/todosSlice';
import TodoItem from './TodoItem';
import { Card, Col } from 'antd';

interface TodoListProps {
  title: string;
  todos: Todo[];
  droppableId: string;
}

const TodoList: React.FC<TodoListProps> = ({ title, todos, droppableId }) => {  
  return (
    <Col className='min-w-96 max-w-96 h-full '>
      <Card
        title={title}
        bordered={true}
        bodyStyle={{ paddingInline: '8px' }}
      >
        <Droppable droppableId={droppableId}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="min-h-24 max-h-[calc(100vh-400px)] overflow-y-auto"
              
            >
              {todos.map((todo, index) => {
                return (
                  <Draggable key={todo.id.toString()} draggableId={todo.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <TodoItem todo={todo} />
                      </div>
                    )}
                  </Draggable>
                )}
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </Card>
    </Col>
  );
};

export default TodoList;

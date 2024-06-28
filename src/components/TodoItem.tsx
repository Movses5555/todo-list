import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Todo, removeTodo, markComplete, selectedTodo, Status } from '../features/todos/todosSlice';
import { Typography, Button, Dropdown, Menu, Card, Tag, Modal } from 'antd';
import { MoreOutlined, EditTwoTone, DeleteTwoTone } from '@ant-design/icons';


const { Text, Title } = Typography;

interface TodoItemProps {
  todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const dispatch = useDispatch();
  const [openDetailsModal, setOpenDetailsModal] = useState<boolean>(false)

  const handelEdit = () => {
    dispatch(selectedTodo(todo))
  }

  const menu = (
    <Menu
      style={{padding: "12px"}}
    >
      <Menu.Item
        onClick={() => handelEdit()}
      >
        <EditTwoTone className='mr-2'/> 
        <Text className='text-blue-600'>Edit</Text>
      </Menu.Item>
      <Menu.Item
        onClick={() => dispatch(removeTodo(todo.id))}
        className='my-4'
      >
        <DeleteTwoTone
          twoToneColor="#dc2626"
          className='mr-2'
        />
        <Text className='text-[#dc2626]'>Delete</Text>
      </Menu.Item>
      {
        ['todo', 'pending'].includes(todo.status) && (
          <Button
            onClick={() => dispatch(markComplete(todo.id))} 
            type="primary"
            className='p-2'
          >
            Mark as Complete
          </Button>
        )
      }
    </Menu>
  );

  const statusColor = (status: Status): string => {
    let color = "";
    switch (status) {
      case 'pending':
        color = '#1777fe';
        break;
      case 'completed':
        color = '#87d068';
        break;
      case 'overdue':
        color = 'warning';
        break;
      case 'removed':
        color = '#f50';
        break;
      default:
        return "";
    }
    return color
  }

  return (
    <>
      <Card
        onClick={() => setOpenDetailsModal(true)}
        className='relative mb-4 group'
      >
        <div>
          <Title level={3} className='truncate group-hover:overflow-visible group-hover:whitespace-normal group-hover:max-w-full pr-4'>{todo.title}</Title>
          <Text className='block mb-1 group-hover:overflow-visible group-hover:whitespace-normal group-hover:max-w-full'>{todo.description}</Text>
          {
            todo.deadline && (
              <Text className='block mb-1'>Deadline: {new Date(todo.deadline).toLocaleDateString()}</Text>
            )
          }
          <Text className='block'>
            Status: 
            <Tag
              className='capitalize ml-2'
              color={statusColor(todo.status)}
            >
              {todo.status}
            </Tag>
          </Text>
        </div>
        <div className="space-x-2">
          <Dropdown
            overlay={menu}
            placement="bottomRight"
            trigger={['click']}
            className='absolute top-2 right-2'
          >
            <Button icon={<MoreOutlined />} />
          </Dropdown>
        </div>
      </Card>
      <Modal
        title="Todo Delails"
        open={openDetailsModal}
        onCancel={() => setOpenDetailsModal(false)}
        footer={null}
      >
        <div className=''>
          <div>
            <Title level={3} className='pr-4'>{todo.title}</Title>
            <Text className='block mb-1 '>{todo.description}</Text>
            {
              todo.deadline && (
                <Text className='block mb-1 font-bold'>
                  Deadline: {new Date(todo.deadline).toLocaleDateString()}
                </Text>
              )
            }
            <Text className='block font-bold'>
              Status: 
              <Tag
                className='capitalize ml-2'
                color={statusColor(todo.status)}
              >
                {todo.status}
              </Tag>
            </Text>
          </div>
          <div className="flex flex-wrap justify-end space-x-2 mt-4">
            <Button
              onClick={() => handelEdit()} 
              type="primary"
              className='p-2'
            >
              <EditTwoTone twoToneColor="white" className='mr-2'/> 
              <Text className='text-white'>Edit</Text>
            </Button>
            <Button
              onClick={() => dispatch(removeTodo(todo.id))} 
              type="primary"
              danger
              className='p-2'
            >
              <DeleteTwoTone twoToneColor="white" className='mr-1' />
              <Text className='text-white'>Delete</Text>
            </Button>
            {
              ['todo', 'pending'].includes(todo.status) && (
                <Button
                  onClick={() => dispatch(markComplete(todo.id))} 
                  type="primary"
                  className='p-2'
                >
                  Mark as Complete
                </Button>
              )
            }
          </div>
        </div>
      </Modal>
    </>
  )
};

export default TodoItem;


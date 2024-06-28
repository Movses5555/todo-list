import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { v4 as uuidv4 } from 'uuid';

export type Status =  'pending' | 'completed' | 'overdue' | 'removed';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  deadline?: string;
  status: Status;
}

export interface selectedTodo {
  id: string;
  title: string;
  description: string;
  deadline: string;
  status: Status;
}

interface TodosState {
  todos: Todo[];
  trash: Todo[];
  openAddToDoModal: boolean;
  isEditModal: boolean;
  selectedTodo: selectedTodo;
}

const selectedTodoInitial: selectedTodo = {
  id: uuidv4(),
  title: "",
  description: "",
  deadline: "",
  status: "pending",
}

const initialState: TodosState = {
  todos: [],
  trash: [],
  openAddToDoModal: false,
  isEditModal: false,
  selectedTodo: selectedTodoInitial,
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<Omit<Todo, 'id' | 'status'>>) => {
      const newTodo: Todo = {
        id: uuidv4(),
        status: 'pending',
        ...action.payload,
      };
      state.todos.push(newTodo);
      state.openAddToDoModal = false;
      state.selectedTodo = selectedTodoInitial
    },
    editTodo: (state, action: PayloadAction<Todo>) => {
      const index = state.todos.findIndex(todo => todo.id === action.payload.id);
      if (index !== -1) {
        state.todos[index] = action.payload;
      }
      state.openAddToDoModal = false;
      state.selectedTodo = selectedTodoInitial
    },
    removeTodo: (state, action: PayloadAction<string>) => {
      const index = state.todos.findIndex(todo => todo.id === action.payload);
      if (index !== -1) {
        state.todos[index].status = 'removed';
      }
    },
    markComplete: (state, action: PayloadAction<string>) => {
      const index = state.todos.findIndex(todo => todo.id === action.payload);
      if (index !== -1) {
        state.todos[index].status = 'completed';
      }
    },
    checkOverdue: (state) => {
      const now = new Date().toISOString();
      state.todos.forEach(todo => {
        if (todo.deadline && todo.deadline < now) {
          todo.status = 'overdue';
        }
      });
    },
    updateStatus: (state, action: PayloadAction<{ id: string; status: Todo['status'] }>) => {
      const index = state.todos.findIndex(todo => todo.id === action.payload.id);
      if (index !== -1) {
        state.todos[index].status = action.payload.status;
      }
    },
    changeAddToDoModalState: (state, action: PayloadAction<boolean>) => {
      if(action.payload) {        
        state.selectedTodo = selectedTodoInitial;
      }
      state.openAddToDoModal = action.payload;
    },
    selectedTodo: (state, action: PayloadAction<Todo>) => {
      const { id, title, description, deadline, status } = action.payload
      state.selectedTodo = {
        id: id,
        title: title,
        description: description || "",
        deadline: deadline || "",
        status,
      };
      state.openAddToDoModal = true;
      state.isEditModal = true;
    },
  },
});

export const { 
  addTodo, 
  editTodo, 
  removeTodo, 
  markComplete, 
  checkOverdue, 
  updateStatus,
  changeAddToDoModalState,
  selectedTodo,
} = todosSlice.actions;
export const selectTodos = (state: RootState) => state.todos.todos;
export const selectTrash = (state: RootState) => state.todos.trash;
export default todosSlice.reducer;

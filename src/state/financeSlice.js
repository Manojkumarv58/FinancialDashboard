import { createSlice } from '@reduxjs/toolkit'
import { initialTransactions } from './mockData'

function genId() {
  return `t_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`
}

const initialState = {
  role: 'viewer',
  currency: 'USD',
  transactions: initialTransactions,
  query: '',
  typeFilter: 'all',
  categoryFilter: 'all',
  sortKey: 'date',
  sortDir: 'desc',
}

const financeSlice = createSlice({
  name: 'finance',
  initialState,
  reducers: {
    setRole: (state, action) => {
      state.role = action.payload
    },
    addTransaction: (state, action) => {
      state.transactions.unshift({ id: genId(), ...action.payload })
    },
    updateTransaction: (state, action) => {
      const { id, ...patch } = action.payload
      const row = state.transactions.find((t) => t.id === id)
      if (row) Object.assign(row, patch)
    },
    setQuery: (state, action) => {
      state.query = action.payload
    },
    setTypeFilter: (state, action) => {
      state.typeFilter = action.payload
    },
    setCategoryFilter: (state, action) => {
      state.categoryFilter = action.payload
    },
    setSort: (state, action) => {
      const key = action.payload
      if (key === state.sortKey) {
        state.sortDir = state.sortDir === 'asc' ? 'desc' : 'asc'
      } else {
        state.sortKey = key
        state.sortDir = 'desc'
      }
    },
  },
})

export const {
  setRole,
  addTransaction,
  updateTransaction,
  setQuery,
  setTypeFilter,
  setCategoryFilter,
  setSort,
} = financeSlice.actions

export default financeSlice.reducer

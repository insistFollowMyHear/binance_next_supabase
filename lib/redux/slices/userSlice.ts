import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 定义用户状态接口
export interface UserState {
  id: string | null;
  email: string | null;
  apiKey: string | null;
  secretKey: string | null;
  binanceUserId: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
}

// 初始状态
const initialState: UserState = {
  id: null,
  email: null,
  apiKey: null,
  secretKey: null,
  binanceUserId: null,
  isLoggedIn: false,
  isLoading: false,
  error: null,
};

// 创建用户切片
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // 设置用户信息
    setUser: (state, action: PayloadAction<Partial<UserState>>) => {
      return {
        ...state,
        ...action.payload,
        isLoggedIn: true,
        error: null,
      };
    },
    // 退出登录
    logoutUser: (state) => {
      return {
        ...initialState,
      };
    },
    // 设置当前币安用户ID
    setBinanceUser: (state, action: PayloadAction<string>) => {
      state.binanceUserId = action.payload;
    },
    // 设置加载状态
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    // 设置错误信息
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

// 导出 actions
export const { setUser, logoutUser, setBinanceUser, setLoading, setError } = userSlice.actions;

// 导出 reducer
export default userSlice.reducer; 
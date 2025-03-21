import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// 类型化的dispatch hook
export const useAppDispatch = () => useDispatch<AppDispatch>();

// 类型化的selector hook
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; 
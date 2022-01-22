import { useSelector } from 'react-redux';

export const getTextList = () => (
  useSelector((state) => state.home.textList)
)

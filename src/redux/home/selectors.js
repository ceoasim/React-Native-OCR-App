import { useSelector } from 'react-redux';

export const getEmployeeList = () => (
  useSelector((state) => state.home.employeeList)
)

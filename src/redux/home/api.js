import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const currentDate = new Date();
  const timestamp = currentDate.getTime();

const employeeRef = () => firestore()
  .collection('Employees')

export const Api = {

  getEmployeeList: async () => {
    const userId = auth().currentUser.uid;
    try {
      const querySnapshot = await employeeRef()
        .doc(userId)
        .collection('EmployeeData')
        .get();
      var employeeList = [];
      for (const list of querySnapshot.docs) {
        employeeList.push({ id: list.id, ...list.data() });
      }
      return employeeList;

    }


    catch (e) {
      throw e;
    }
  },
  addEmployee: async (data) => {
    const {
      employeeName,
      employeeAddress,
      city,
      state,
      position,
      salary,
      phone,
      emailId
    } = data;
    const userId = auth().currentUser.uid;
    try {

      const querySnapshot = await employeeRef()
        .doc(userId)
        .collection('EmployeeData')
        .add({
          employeeName: employeeName,
          employeeAddress: employeeAddress,
          city: city,
          state: state,
          position: position,
          salary: salary,
          phone: phone,
          emailId: emailId,
          joiningDate: timestamp,
          lastApprasal: timestamp,
        });
      return querySnapshot?.id

    }


    catch (e) {
      throw e;
    }
  },

  updateEmployee: async (data) => {
    const {
      id,
      employeeName,
      employeeAddress,
      city,
      state,
      position,
      salary,
      phone,
      emailId
    } = data;
    const userId = auth().currentUser.uid;
    try {

      const querySnapshot = await employeeRef()
        .doc(userId)
        .collection('EmployeeData')
        .doc(id)
        .update({
          employeeName: employeeName,
          employeeAddress: employeeAddress,
          city: city,
          state: state,
          position: position,
          salary: salary,
          phone: phone,
          emailId: emailId,
        });
      return querySnapshot?.id

    }


    catch (e) {
      throw e;
    }
  },
}
import React, { useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { View, TouchableOpacity, Text } from 'react-native';

const MarkAttendance = ({ item }) => {
  const currentDate = new Date();
  const timestamp = currentDate.getTime();
  const [isPresent, setIsPresent] = useState(true);
  const [loading, setLoading] = useState(true)


  const absent = 'Absent'
  const present = 'Present'


  useEffect(() => {

    async function fetchData() {
      await firestore()
      .collection('Employees')
      .doc(auth()?.currentUser?.uid)
      .collection('EachEmployeeAttendance')
      .doc(item.id)
      .set({
        Name: item.employeeName,
        Attendance: present,
        Date: timestamp
      });
      setLoading(false)
    }
    fetchData();
    
  }, [])

  const backend = async (isPresent) => {
    await firestore()
      .collection('Employees')
      .doc(auth()?.currentUser?.uid)
      .collection('EachEmployeeAttendance')
      .doc(item.id)
      .set({
        Name: item.employeeName,
        Attendance: isPresent,
        Date: timestamp
      });
  }

  if(!loading)
  {
  return (<View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{fontSize:20}}>P</Text>

    <TouchableOpacity onPress={() => {
      setIsPresent(true);
      backend(present)

    }} style={{ width: 20, height: 20, backgroundColor: isPresent ? 'green' : null, borderWidth: 0.5, borderColor: 'blue', borderRadius: 20 }} >
    </TouchableOpacity>
    <Text style={{fontSize:20,  marginLeft: 10}}>A</Text>

    <TouchableOpacity
      onPress={() => {
        setIsPresent(false)
        backend(absent)

      }}
      style={{ width: 20, height: 20, borderWidth: 0.5, backgroundColor: !isPresent ? 'red' : null, borderColor: 'blue', borderRadius: 20, }} >
    </TouchableOpacity>
  </View>
  )
    }
    else{
      return(
        <View style={{ alignItems:'center'}}>
          <Text style={{fontSize:20}}>&#x25cc;</Text>
        </View>
      )
    }
}


export default MarkAttendance;
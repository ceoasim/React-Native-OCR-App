import React from 'react'
import { TouchableOpacity, Text } from 'react-native';


export default function ({ id,text, onClick, style, disabled, approved, disapproved }) {

  if (disabled == undefined) {
    disabled = false;
  }

  return (
    <TouchableOpacity key={id} disabled={disabled} onPress={onClick} style={[style, { flexDirection: 'row', justifyContent: 'center', borderRadius: 5, backgroundColor: approved ? 'green' : disapproved ? 'red' : '#00AEF0' }]}>
      <Text style={{ fontSize: 16, color: 'white', marginVertical: 16 }}>
        {text}
      </Text>
    </TouchableOpacity>
  )
}
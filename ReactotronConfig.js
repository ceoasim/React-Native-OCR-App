import Reactotron from 'reactotron-react-native'
import { reactotronRedux } from 'reactotron-redux'
import AsyncStorage from '@react-native-community/async-storage';
import sagaPlugin from 'reactotron-redux-saga'

const reactotron = Reactotron
  .setAsyncStorageHandler(AsyncStorage) // AsyncStorage would either come from `react-native` or `@react-native-community/async-storage` depending on where you get it from
  .configure({host: '192.168.0.116'}) // controls connection & communication settings
  .use(reactotronRedux())
  .use(sagaPlugin())
  .useReactNative() // add all built-in react native plugins
  .connect() // let's connect!


// monkey patch console.log to send log to reactotron
const yeOldeConsoleLog = console.log
console.log = (...args) => {
    yeOldeConsoleLog(...args)
    Reactotron.display({
        name: 'CONSOLE.LOG',
        value: args,
        preview: args.length > 0 && typeof args[0] === 'string' ? args[0] : null
    })
}


const warn = console.warn;
export function logWarning(...warnings ){
  let showWarning = true;
  warnings.forEach(warning => {
    if     (warning.includes("UNSAFE_"))    showWarning = false;
    else if(warning.includes("SourceMap"))  showWarning = false;
    else if(warning.includes("DevTools"))   showWarning = false;
  });
  if(showWarning) warn(...warnings);
}


console.warn  = logWarning;

export default reactotron;
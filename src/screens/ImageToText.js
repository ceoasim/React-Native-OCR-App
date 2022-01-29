import React, { useState } from 'react';
import { Button, StyleSheet, Text, View, Image, StatusBar, PermissionsAndroid } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-crop-picker';
import ProgressCircle from 'react-native-progress/Circle';
import { getStatusBarHeight } from 'react-native-status-bar-height';

import * as Actions from '../redux/actions';
import { useDispatch } from 'react-redux';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFetchBlob from 'rn-fetch-blob';


import * as selectors from '../redux/home/selectors';

import images from './../constants/images';
import colors from './../constants/colors';


import TesseractOcr, {
  LANG_ENGLISH,
  useEventListener,
} from 'react-native-tesseract-ocr';

const DEFAULT_HEIGHT = 500;
const DEFAULT_WITH = 600;
const defaultPickerOptions = {
  cropping: true,
  height: DEFAULT_HEIGHT,
  width: DEFAULT_WITH,
};

function ImageToText() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [imgSrc, setImgSrc] = useState(null);
  const [text, setText] = useState('');
  const dispatch = useDispatch();

  useEventListener('onProgressChange', (p) => {
    setProgress(p.percent / 100);
  });

  const recognizeTextFromImage = async (path) => {
    setIsLoading(true);

    try {
      const tesseractOptions = {};
      const recognizedText = await TesseractOcr.recognize(
        path,
        LANG_ENGLISH,
        tesseractOptions,
      );
      setText(recognizedText);
    } catch (err) {
      console.error(err);
      setText('');
    }

    setIsLoading(false);
    setProgress(0);
  };

  const recognizeFromPicker = async (options = defaultPickerOptions) => {
    try {
      const image = await ImagePicker.openPicker(options);
      setImgSrc({ uri: image.path });
      await recognizeTextFromImage(image.path);
    } catch (err) {
      if (err.message !== 'User cancelled image selection') {
        console.error(err);
      }
    }
  };

  const recognizeFromCamera = async (options = defaultPickerOptions) => {
    try {
      const image = await ImagePicker.openCamera(options);
      setImgSrc({ uri: image.path });
      await recognizeTextFromImage(image.path);
    } catch (err) {
      if (err.message !== 'User cancelled image selection') {
        console.error(err);
      }
    }
  };

  const downloadHistory = async (filePath, file, fileName) => {

    const fs = RNFetchBlob.fs;
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Permission granted");

        const fs = RNFetchBlob.fs;
        const base64 = RNFetchBlob.base64
        // const base64 = RNFetchBlob.base64;

        const dirs = RNFetchBlob.fs.dirs;

        const NEW_FILE_PATH = dirs.DownloadDir + `/${fileName + Date.now()}.pdf`;
        fs.createFile(NEW_FILE_PATH, base64.encode(file), 'base64');
        alert("File is saved successfully")

      } else {
        console.log('Permission denied');
      }
    } catch (err) {
      alert("File is not saved successfully, Please try again");
    }

  }

  const historyDownload = (filePath, file, fileName) => {
    //Function to check the platform
    //If iOS the start downloading
    //If Android then ask for runtime permission
    if (Platform.OS === 'ios') {
      downloadHistory();
    } else {
      try {
        PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'storage title',
            message: 'storage_permission',
          },
        ).then(granted => {
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //Once user grant the permission start downloading
            console.log('Storage Permission Granted.');
            downloadHistory(filePath, file, fileName);
          } else {
            //If permission denied then show alert 'Storage Permission 
            // 'Not Granted'
            Alert.alert('storage_permission');
          }
        });
      } catch (err) {
        //To handle permission related issue
        console.log('error', err);
      }
    }
  }

  const createPDF = async (text) => {
    let options = {
      html: `<h1>${text}</h1>`,
      fileName: `${text.substring(0, 4)}`,
      directory: "docs",
      base64: true
    };

    let file = await RNHTMLtoPDF.convert(options)
    // console.log(file.filePath);
    alert(file.filePath);
    historyDownload(file.filePath, file, text.substring(0, 4))
  }

  return (
    <View style={styles.container}>
      <StatusBar translucent barStyle="dark-content" backgroundColor="#fff" />
      <View
        style={{
          marginTop:
            StatusBar.currentHeight + getStatusBarHeight(true) + 25,
          marginBottom: 20,
          marginHorizontal: 25,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <Text />
          <Text
            style={{
              fontFamily: 'Montserrat-SemiBold',
              fontSize: 21,
              color: colors.lightBlack,
            }}>
            Image To Text
          </Text>
          <View />
        </View>
      </View>
      <View
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          opacity: 0.4,
          height: 6,
          borderWidth: 0.2,
          borderColor: '#F8F9F9',
          elevation: 10,
          shadowColor: 'rgba(0, 0, 0, 0.9)',
          shadowOpacity: 0.5,
        }}
      />
      <ScrollView >
        <Text style={styles.instructions}>Select an image source:</Text>
        <View style={styles.options}>
          <View style={styles.button}>
            <Button
              disabled={isLoading}
              title="Camera"
              onPress={() => {
                recognizeFromCamera();
              }}
            />
          </View>
          <View style={styles.button}>
            <Button
              disabled={isLoading}
              title="Picker"
              onPress={() => {
                recognizeFromPicker();
              }}
            />
          </View>
        </View>
        {imgSrc && (
          <View style={styles.imageContainer}>
            <Image style={styles.image} source={imgSrc} />
            {isLoading ? (
              <ProgressCircle showsText progress={progress} />
            ) : (
              <>
                <Text style={styles.title}>Text extracted from image</Text>
                <ScrollView style={{ height: 180, marginHorizontal: 20 }}>
                  <Text selectable={true}>{text}</Text>
                </ScrollView>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20 }}>
                  <Button
                    disabled={isLoading}
                    title="Save"
                    onPress={() => {
                      dispatch(Actions.addText(text))
                    }}
                  />
                  <View style={{ marginLeft: 20 }}>

                    <Button
                      disabled={isLoading}
                      title="Convert to pdf"
                      onPress={() => {
                        createPDF(text)
                      }}
                    />
                  </View>
                </View>
              </>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  options: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    alignSelf: 'center'
  },
  button: {
    marginHorizontal: 10,
    marginBottom: 20
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    marginVertical: 15,
    height: DEFAULT_HEIGHT / 2.5,
    width: DEFAULT_WITH / 2.5,
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    fontWeight: 'bold'
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    fontSize: 18,
    marginVertical: 15
  },
});

export default ImageToText;

import { View, Text, Button, Pressable } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StyleSheet } from 'react-native'
import { ScrollView } from 'react-native'
import { Audio } from 'expo-av'
import Playback from '../components/memolist/Playback'


const index = () => {

    const [recording, setRecording] = useState();
    const [memos, setMemos] = useState([]);

    async function startRecording() {
        try {
          // console.log('Requesting permissions..');
          await Audio.requestPermissionsAsync();
          await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            playsInSilentModeIOS: true,
          });
          
          console.log('Starting recording..');
            const { recording } = await Audio.Recording.createAsync( Audio.RecordingOptionsPresets.HIGH_QUALITY
            );
            setRecording(recording);
            console.log('Recording started');
            } catch (err) {
            console.error('Failed to start recording', err);
            }
        }

        async function stopRecording() {
            // console.log('Stopping recording..');
            setRecording(undefined);
            await recording.stopAndUnloadAsync();
            await Audio.setAudioModeAsync(
              {
                allowsRecordingIOS: false,
              }
            );
            const uri = recording.getURI();
            // console.log('Recording stopped and stored at', uri);

            if(uri){
                setMemos((existingMemos) => [uri, ...existingMemos])
            }
          }

          const deleteMemo = (indexToDelete) => {
            const updatedMemos = [...memos];
            updatedMemos.splice(indexToDelete, 1);
            setMemos(updatedMemos);
          };
          
          
          
  return (
    <SafeAreaView style={styles.screen}>

      <Text style={styles.header}>All Recordings</Text>

      <View style={styles.list}>
        {
          memos.length <= 0 ? 
          <View style={styles.noRecord}>
            <View style={styles.waves}>
              <View style={[styles.wave, {height: 8,}]}></View>
              <View style={[styles.wave, {height: 23,}]}></View>
              <View style={[styles.wave, {height: 33,}]}></View>
              <View style={[styles.wave, {height: 18,}]}></View>
              <View style={[styles.wave, {height: 27,}]}></View>
              <View style={[styles.wave, {height: 10,}]}></View>
            </View>
            <Text style= {{fontWeight: 'bold', fontSize: 25,}}>No Recordings</Text>
            <Text style={{fontWeight: 300, color: 'gray', fontSize: 15,}}>Voice memos you record will appear here.</Text>
          </View>
          :
          <ScrollView showsVerticalScrollIndicator={false} >
            {memos.map((memo, index) => (
                <Playback 
                uri={memo} 
                key={index} 
                length={memos.length} 
                index={index} 
                deleteMemo={() => deleteMemo(index)} />
            ))}   
        </ScrollView>
        }
      </View>

      <View style={styles.fotter}>

        <View style={styles.container}>

          <Pressable 
          onPress={recording ? stopRecording : startRecording} 
          style={[styles.recorder,  { width: recording ? 25 : 50 }, { borderRadius: recording ? 3 : 50 }]} />

        </View>

      </View>

    </SafeAreaView>
  )
}





const styles = StyleSheet.create({
    screen: {
        position: 'relative',
        backgroundColor: '#F5F5F5'
    },
    header: {
        fontWeight: 'bold',
        fontSize: 35,
        padding: 10,
    },
    fotter: {
        width: 'auto',
        height: 200,
        backgroundColor: '#DCDCDC',
        alignItems: 'center',
        justifyContent: 'center',
    },
    list: {
        height: 550,
        width: 'auto',
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 6,
    },
    container: {
      height: 60,
      width: 60,
      borderColor: 'gray',
      borderRadius: 50,
      borderWidth: 3,
      alignItems: 'center',
      justifyContent: 'center',
    },
    recorder: {
      aspectRatio: 1,
      backgroundColor: 'orangered',
      
    },
    noRecord: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
    },
    wave: {
      width: 3,
      backgroundColor: 'gray',
      borderRadius: 30,
    },
    waves: {
      display: 'flex',
      flexDirection: 'row',
      gap: 4,
      alignItems: 'center',
      marginBottom: 8,

    }
})

export default index
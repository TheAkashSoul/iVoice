import { View, Text, StyleSheet, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Audio } from 'expo-av';
import { Foundation } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';


const Playback = ({uri, index, length, deleteMemo}) => {

    const [sound, setSound] = useState();
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackStatus, setPlaybackStatus] = useState({});
    const [currentPosition, setCurrentPosition] = useState(0);
    const [duration, setDuration] = useState(0);

    const count = length - index 


    async function loadSound() {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync({ uri });
    setSound(sound);

    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) {
        setIsPlaying(false);
        setPlaybackStatus(status);
      }

      const currentPositionMillis = status.positionMillis;
      const durationMillis = status.durationMillis;

      // console.log(`Current position: ${currentPositionMillis} milliseconds`);
      // console.log(`Duration: ${durationMillis} milliseconds`);

      setPlaybackStatus(status);
      setCurrentPosition(currentPositionMillis);
      setDuration(durationMillis);

    });
  }

  // console.log(currentPosition)
  // console.log(duration)
  

  async function playSound() {
    if (!sound) {
      return;
    }
    // console.log('Playing Sound');
    await sound.playAsync();
    setIsPlaying(true);

  }

  useEffect(() => {
    loadSound();
    return () => {
      if (sound) {
        console.log('Unloading Sound');
        sound.unloadAsync();
      }
    };
  }, [uri]);

  async function pauseSound() {
    if (sound) {
      // console.log('Pausing Sound');
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  }

  async function replaySound() {
    if (sound) {
      // console.log('Replaying Sound');
      await sound.replayAsync();
      setIsPlaying(true);
    }
  }
  

  const millisToMinutesAndSeconds = (millis) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return `${minutes}:${(seconds < 10 ? '0' : '')}${seconds}`;
  };
      

  async function backWard() {

    if(currentPosition >= 30000){
      await sound.playFromPositionAsync(currentPosition-30000);
      setIsPlaying(true)
    }else if(currentPosition < 30000){
      await sound.playFromPositionAsync(0);
      setIsPlaying(true)
    }

  }

  async function forWard() {

    if(currentPosition <= duration-30000){
      await sound.playFromPositionAsync(currentPosition+30000);
      setIsPlaying(true)
    }else if(currentPosition > duration-30000){
      await sound.playFromPositionAsync(duration);
      setIsPlaying(true);
    }

  }

  return (
    <View style={{paddingHorizontal: 6}}>
      <View style={styles.playback}>
        <Text style={{fontWeight: '700', fontSize: 18}}>New Recording { count <= 1 ? '' : count}
        </Text>

        

        

        <View style={{display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center', marginVertical: 15, justifyContent: 'space-between'}}>

        <Text style={{fontWeight: '300', fontSize: 14}}>
          {millisToMinutesAndSeconds(currentPosition)} /{' '}
          {millisToMinutesAndSeconds(duration)}
        </Text>

          <View style={{display: 'flex', flexDirection: 'row', gap: 30}}>

          <Pressable onPress={backWard}>
            <MaterialIcons name="replay-30" size={24} color="black" />
          </Pressable>

          {
            millisToMinutesAndSeconds(currentPosition) === millisToMinutesAndSeconds(duration) ? 

            <Pressable 
            onPress={replaySound}>
              <Text>
              <FontAwesome name="play" size={24} color="black" />
              </Text>
            </Pressable>

            :

            <Pressable 
            onPress={ isPlaying ? pauseSound : playSound }>
              <Text>{ isPlaying ? 
                <Foundation name="pause" size={24} color="black" /> 
                : 
                <FontAwesome name="play" size={24} color="black" /> }</Text>
            </Pressable>

          }

          <Pressable onPress={forWard}>
            <MaterialIcons name="forward-30" size={24} color="black" />
          </Pressable>
          
          </View>

          <View>
            <Pressable onPress={deleteMemo}>
              <Ionicons name="ios-trash-outline" size={24} color="orangered" />
            </Pressable>
          </View>

          
          
        </View>

        

      </View>
    </View>
  )
}


const styles = StyleSheet.create({
    playback: {
        height: 'auto',
        width: 'auto',
        backgroundColor: '#F5F5F5',
        marginVertical: 1,
        borderTopWidth: 0.2,
        paddingVertical: 5
    }

})

export default Playback
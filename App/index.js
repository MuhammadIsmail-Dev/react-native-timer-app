import React from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  Picker,
  Platform
} from "react-native";

const screen = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#07121B",
    alignItems: "center",
    justifyContent: "center"
  },
  button: {
    borderColor: "#89AAFF",
    borderWidth: 10,
    width: screen.width / 2,
    height: screen.width / 2,
    borderRadius: screen.width / 2,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30
  },
  buttonStop: {
    borderColor: "#FF851B"
  },
  buttonTextStop: {
    color: "#FF851B"
  },
  buttonText: {
    fontSize: 45,
    color: "#89AAFF"
  },
  timerText: {
    color: "#fff",
    fontSize: 90
  },
  pickerContainer:{
    flexDirection: "row",
    alignItems: "center",
  },
  picker: {
    width: 50,
    ...Platform.select({
        android: {
          color: "#fff",
          backgroundColor: "#07121B",
          marginLeft: 10
        }
    })
  },
  pickerItem: {
    color: "#fff",
    fontSize: 20
  }
});

const formatNumber = number => `0${number}`.slice(-2);

const getRemaning = time => {
  const minutes = Math.floor(time / 60);
  const seconds = time - minutes * 60;
  return { minutes: formatNumber(minutes), seconds: formatNumber(seconds) };
};

const createArray = length => {
  const arr = [];
  let i = 0;
  while(i < length){
    arr.push(i.toString());
    i += 1;
  }

  return arr;
}

const AVAILABLE_MINUTES = createArray(10);
const AVAILABLE_SECONDS = createArray(60);


export default class App extends React.Component {
  interval = null;
  
  constructor(props){
    super(props)
    this.state = {
      remainingSeconds: 5,
      isRunning: false,
      selectedSeconds: "5",
      selectedMinutes: "0"
    };
  }
  
  componentDidUpdate(prevProp, prevState){
    if(this.state.remainingSeconds === 0 && prevState.remainingSeconds !== 0){
      this.stop();
    }
  }

  componentWillUnmount(){
    if(this.interval){
      clearInterval(this.interval);
    }
  }
  
  start = () => {
    this.setState(state => ({
      remainingSeconds: parseInt(state.selectedMinutes,10) * 60 +
      parseInt(state.selectedSeconds,10) - 1,
      isRunning: true
    }))

    this.interval = setInterval(() => {
      this.setState(state => ({
        remainingSeconds: state.remainingSeconds - 1
      }))
    },1000)
  }

  stop = () => {
    clearInterval(this.interval);
    this.interval = null;
    this.setState({
      remainingSeconds: 5,
      isRunning: false
    });
  }

  renderPickers = () => {
    return (
      <View style={styles.pickerContainer}>
        <Text style={styles.pickerItem}>minutes</Text>
        <Picker
          mode="dropdown"
          style={styles.picker}
          itemStyle={styles.pickerItem}
          selectedValue={this.state.selectedMinutes}
          onValueChange={itemValue => {
            //update state
            this.setState({ selectedMinutes: itemValue });
          }}
        >
          {AVAILABLE_MINUTES.map(val => (
            <Picker.Item key={val} label={val} value={val} />
          ))}
        </Picker>
        <Text style={styles.pickerItem}>seconds</Text>
        <Picker
          mode="dropdown"
          style={styles.picker}
          itemStyle={styles.pickerItem}
          selectedValue={this.state.selectedSeconds}
          onValueChange={itemValue => {
            //update state
            this.setState({ selectedSeconds: itemValue });
          }}
        >
          {AVAILABLE_SECONDS.map(val => (
            <Picker.Item key={val} label={val} value={val} />
          ))}
        </Picker>
      </View>
    );
  }

  render() {
    const { minutes, seconds } = getRemaning(this.state.remainingSeconds);
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#07121B" />
        {this.state.isRunning ? ( 
          <Text style={styles.timerText}>{`${minutes}:${seconds}`}</Text>
          ) : (
            this.renderPickers()
          )}
        {this.state.isRunning ? (
          <TouchableOpacity onPress={this.stop} style={[styles.button,styles.buttonStop]}>
            <Text style={[styles.buttonText, styles.buttonTextStop]}>Stop</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={this.start} style={styles.button}>
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
        ) }
      </View>
    );
  }
}

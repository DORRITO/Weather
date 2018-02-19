import React from 'react';
import { Grid, Segment } from 'semantic-ui-react';
import ReactRain from 'react-rain-animation';
 
import "react-rain-animation/lib/style.css";

class Weather extends React.Component {
    ///////////////////////
    constructor(props) {
        super(props);
        this.state = {
            weather: 'grabbing your weather...',
            cTemp: '',
            location: '',
            country: '',
            condition: '',
            rain: false,
            background: ''
        };
    }///////////////////////

    //*********************************************************************
    componentDidMount(){
        navigator.geolocation.getCurrentPosition((position) => {
            //coordinates
            var lon = position.coords.longitude;
            var lat = position.coords.latitude; 
            var api = `https://api.apixu.com/v1/current.json?key=4f1825ef1bd4496b94c231250181802&q=${lat},${lon}`;
            
            this.callAPI(api)
                .then(res => {
                    let fTemp = res.current.temp_f;
                    let cTemp = res.current.temp_c;
                    let country = res.location.country;
                    let location = res.location.region;
                    let condition = res.current.condition.text;
                    let rain = res.current.condition.text.includes('rain') || res.current.condition.text.includes('drizzle')|| res.current.condition.text.includes('sleet');
                    this.setState({weather: fTemp + '°F', cTemp: cTemp + '°C', location, country, condition, rain});

                    if(fTemp >= 95){
                        this.setState({background: 'App-Hot'});
                    }else if(fTemp <= 30){
                        this.setState({background: 'App-Freezing'});
                    }else if(fTemp <= 55){
                        this.setState({background: 'App-Cold'})
                    }
                })
                .catch(err => console.log(err));
        });
    }//*********************************************************************

    /////////////////////////////////////////////
    callAPI = async (api) =>{
        const response = await fetch(api);
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
    }/////////////////////////////////////////////

    ////////////////////////////////////////////////////////////////////////////
    render() {
      return (
        <div className={`App ${this.state.background}`}>
        <Grid centered columns={2}>
            {this.state.rain ? <ReactRain numDrops="500" /> : null}
            <Segment style={{backgroundColor: '#D6E3E8B3'}} padded raised>
            <Grid.Row centered>
                <Grid.Column textAlign='center'>
                    <h1 className='Decoration'>{this.state.weather}</h1>
                    <h2 className='Decoration'>{this.state.condition ? this.state.condition : ''}</h2>
                    <h2 className='Decoration'>{this.state.location ? `At your location in ${this.state.location}` : ''}</h2>
                </Grid.Column>
            </Grid.Row>
            </Segment>
        </Grid>
        </div>
      );
    }//////////////////////////////////////////////////////////////////////////////
  }

  export default Weather;
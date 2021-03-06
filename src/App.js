import React, {Component} from 'react';
import {Map, GoogleApiWrapper, InfoWindow, Marker} from 'google-maps-react';

const vancouverCoordinates = {lat: 49.2827, lng: -123.1207};
const tempCoord = {lat: 49.282822, lng: -123.121647};


export class MapContainer extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        showingInfoWindow: false,   // Hides or the shows the infoWindow
        activeMarker: {},           // Shows the active marker upon click
        selectedPlace: {},          // Shows the infoWindow to the selected place upon a marker
        data: "LOADING"             // Initial state of data
    };

    componentDidMount() {
        /** creates a promise (asynchronous) that waits for data from server at URL.
         * promise either resolves or is rejected
         * .then() takes 2 arguments: 1st is if promise is returned
         * 2nd (optional) is if promise is rejected
         * in code below: first .then() calls a function that takes response and returns it as json
         * .json() is also a promise that takes a response stream and reads it to completion.
         * It is promise chaining into the next .then(),
         * which takes the json object, and sets data in state to the returned json object
         * apparently it is also a promise chain that then console logs in the next .then()
         **/
        fetch('http://localhost:5001/disabilityParkingRequest')
            .then(response => response.json())
            .then(json => {
                this.setState({data: json.data})
            })
            .then(() => console.log("received this data: ", this.state.data));
    }

    onMarkerClick = (props, marker, e) => {
        console.log("onmarker click")
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true
        })
    };

    onClose = props => {
        console.log("onclose")
        if (this.state.showingInfoWindow) {
            this.setState({
                showingInfoWindow: false,
                activeMarker: null
            });
        }
    };

    createMarkers = () => {
        console.log("creating marker with data: ", this.state.data);

        if (this.state.data !== "LOADING") {
            let markerClick = this.onMarkerClick;
            const markerList = this.state.data.map(function (entry) {
                return (
                    <Marker
                        position={{lat: entry.fields.geom.coordinates[1], lng: entry.fields.geom.coordinates[0]}}
                        onClick={markerClick}
                        name={entry.fields.location}
                    />)
            });
            console.log("MARKER LIST: ", markerList);
            return markerList
        }

    };

    render() {
        return (
            <Map
                google={this.props.google}
                zoom={12}
                initialCenter={vancouverCoordinates}
            >
                {this.createMarkers()}

                <InfoWindow
                    marker={this.state.activeMarker}
                    visible={this.state.showingInfoWindow}
                    onClose={this.onClose}
                >
                    <div>
                        <h4>{"Location\n"}</h4>
                        <span>{this.state.selectedPlace ? this.state.selectedPlace.name : ""}</span>
                    </div>
                </InfoWindow>
            </Map>
        );
    }

}


export default GoogleApiWrapper({
    apiKey: 'api_key_here'
})(MapContainer);

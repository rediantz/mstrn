import React, { Component } from 'react';
import Config from '../Config/Config';
import Chart from 'react-apexcharts';
import Axios from 'axios';
class DashBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Outstand : {
                hit : 0,
                nhit : 0
            },
            Arrival : {
                hit : 0,
                nhit : 0
            },
            Consol : {
                hit : 0,
                nhit : 0
            },
            SLoad : {
                hit : 0,
                nhit : 0
            },
            FLoad : {
                hit : 0,
                nhit : 0
            },
            SSJ : {
                hit : 0,
                nhit : 0
            },
            FSJ : {
                hit : 0,
                nhit : 0
            },
            /*lActual : [2,3,4,5,7,8,9,9,9,10,11,11,12,12,12,13,13,13,14,14,14,14,14,15],
            lPlan : [1,1,1,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,6,6,7,7,7,8],*/
            lActual : [],
            lPlan : [],
            DC : localStorage.getItem('dc')
        }
    }
    componentDidMount(){
        console.log(this.state.DC)
        Axios.get(Config.api+"/linechart/"+this.state.DC).then(res=>{
            console.log(res);
            this.setState({
                lPlan : res.data.plan,
                lActual : res.data.actual
            });
        })
        Axios.get(Config.api+"/dashbordout/"+this.state.DC).then(res=>{
            console.log(res);
            if(res.data!== false){
                let data = res.data;
                console.log(data)
                this.setState({
                    Outstand : {
                        hit : parseInt(data[0].jactual),
                        nhit : parseInt(data[0].jplan) - parseInt(data[0].jactual)
                    },
                    Arrival : {
                        hit : parseInt(data[1].jactual),
                        nhit : parseInt(data[1].jplan) - parseInt(data[1].jactual)
                    },
                    Consol : {
                        hit : parseInt(data[2].jactual),
                        nhit : parseInt(data[2].jplan) - parseInt(data[2].jactual)
                    },
                    SLoad : {
                        hit : parseInt(data[3].jactual),
                        nhit : parseInt(data[3].jplan) - parseInt(data[3].jactual)
                    },
                    FLoad : {
                        hit : parseInt(data[4].jactual),
                        nhit : parseInt(data[4].jplan) - parseInt(data[4].jactual)
                    },
                    SSJ : {
                        hit : parseInt(data[5].jactual),
                        nhit : parseInt(data[5].jplan) - parseInt(data[5].jactual)
                    },
                    FSJ : {
                        hit : parseInt(data[6].jactual),
                        nhit : parseInt(data[6].jplan) - parseInt(data[6].jactual)
                    }
                })
            }
        })
    }
    handleDounat(dat1, lab1, dat2, lab2, judul){
        if(dat1 !== null && dat2 !== null){
        let series=  [dat1, dat2];
        let chartOptions=  {
                chart: {
                type: 'donut'
              },
              labels: [lab1, lab2],
              colors:['#008000', '#FF0000']
        };
        return(
        <>
        <p className="text-center"><b>{judul}</b></p>
            <Chart options={chartOptions} series={series} type="donut" className="w-100" />
            
        </>);
        }
    }
    handleLineChart(target, actual){
        let series= [{
            name: 'Target',
            data: target
        },
        {
            name: 'Actual',
            data: actual
        }];
        let chartOptions=  {
            xaxis: {
                categories: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]
            }
        };
        return(
        <>
            <p className="text-center"><b>Complete Outbound</b></p>
            <Chart options={chartOptions} series={series} type="line" className="w-100" />
        </>);
    }
    render() { 
        return ( 
            <>
                <div className="container-fluid row">
                    <div className="col-6">
                        {this.handleLineChart(this.state.lPlan, this.state.lActual)}
                    </div>
                    <div className="col-6 row p-0">
                        <div className="col-4 border p-0">
                            {this.handleDounat(this.state.Outstand.hit, "Complete", this.state.Outstand.nhit, "Outstanding", "Complete Outbound")}
                        </div>
                        <div className="col-4 border p-0">
                            {this.handleDounat(this.state.Arrival.hit, "Hit", this.state.Arrival.nhit, "Not Hit", "On Time Arrival")}
                        </div>
                        <div className="col-4 border p-0">
                         {this.handleDounat(this.state.Consol.hit, "Hit", this.state.Consol.nhit, "Not Hit", "On Time Consolidation")}
                        </div>
                        <div className="col-4 border p-0">
                            {this.handleDounat(this.state.SLoad.hit, "Hit", this.state.SLoad.nhit, "Not Hit", "On Time Start Loading")}
                        </div>
                        <div className="col-4 border p-0">
                            {this.handleDounat(this.state.FLoad.hit, "Hit", this.state.FLoad.nhit, "Not Hit", "On Time Finish Loading")}
                        </div>
                        <div className="col-4 border p-0">
                            {this.handleDounat(this.state.SSJ.hit, "Hit", this.state.SSJ.nhit, "Not Hit", "On Time Start Surat Jalan")}
                        </div>
                        <div className="col-4 border p-0">
                            {this.handleDounat(this.state.FSJ.hit, "Hit", this.state.FSJ.nhit, "Not Hit", "On Time Finish Surat Jalan")}
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
 
export default DashBoard;
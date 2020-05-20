import React, { Component } from 'react';
import { Container, Row, Button, Form, Table, Pagination} from 'react-bootstrap';
import moment from 'moment';
import OutboundAdd from './OutboundAdd';
import Axios from 'axios';
import Config from '../Config/Config';
import readXlsxFile from 'read-excel-file';
import ExPernc from '../../Files/Contoh.xlsx';
import Workbook from 'react-excel-workbook';
import ModalYesNo from '../Config/ModalYesNo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faUpload, faPaperPlane, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
class Outbound extends Component {
    constructor(props) {
        let newDate = new Date();
        super(props);
        this.state = {
            Search : '',
            listCabang : [],
            listExp : [],
            listKend : [],
            filterDateAw : moment(newDate).format('YYYY-MM-DD').toString(),
            filterDateAk : moment(newDate).format('YYYY-MM-DD').toString(),
            initialListOutbound : [],
            listOutbound : [],
            addModalShow : false,
            DC : localStorage.getItem('dc'),
            User : localStorage.getItem('username'),
            Type : "add",
            Data : '',
            textListPickNo : false,
            isReadFileDone : true,
            isReadFile : false,
            listAdd : [],
            activePage : 0,
            showPage : 5,
            isFilter : false,
            modalYesNo : false,
            textModalYesNo : '',
            dataModalYesNo : '',
            isLoadingModalYesNo : false
        }
    }
    getDataCabang(){
        Axios.get(Config.api+'/getdatacab').then(res=>{
            if(res.data !== false){
                this.setState({
                    listCabang : res.data
                })
            }
        })
        Axios.get(Config.api+'/getmasterekspedisi').then(res=>{
            //console.log(res.data);
            if(res.data !== false){
                this.setState({
                    listExp : res.data
                })
            }
        })
        Axios.get(Config.api+'/getjeniskend').then(res=>{
            //console.log(res.data);
            if(res.data !== false){
                this.setState({
                    listKend : res.data
                })
            }
        })
    }
    componentDidMount(){
        this.getDataPerencanaan();
        this.getDataCabang();
    }
    handleWorkDatas(data){
        let activePage = this.state.activePage;
        let showPage = this.state.showPage;
        let Data = [];
        Data = data.slice(showPage*(activePage-1), (showPage*activePage)-1);
        //console.log(Data);
        return(
            <>
            <Workbook filename={"datas.xlsx"} element={
                <button disabled={Data.length !== 0 ? false : true} className="btn btn-success mx-1">
                    <FontAwesomeIcon icon={faDownload}/> Export Data
                </button>}
                >
                <Workbook.Sheet data={Data} name="Sheet 1">
                    <Workbook.Column value={"listpick"}/>
                    <Workbook.Column value={"namacab"}/>
                    <Workbook.Column value={"expname"}/>
                    <Workbook.Column value={row => moment(row.dateplan).format("DD/MM HH:mm")}/>
                    <Workbook.Column value={row => row.dateactual ? moment(row.dateactual).format("DD/MM HH:mm") : "---"}/>
                    <Workbook.Column value={"jeniskend"}/>
                    <Workbook.Column value={"kubikasi"}/>
                    <Workbook.Column value={"kubikasi"}/>
                    <Workbook.Column value={row => moment(row.planpicking).format("DD/MM HH:mm")}/>
                    <Workbook.Column value={row => row.actualpicking ? moment(row.actualpicking).format("DD/MM HH:mm") : "---"}/>
                    <Workbook.Column value={row => moment(row.planpacking).format("DD/MM HH:mm")}/>
                    <Workbook.Column value={row => row.actualpacking ? moment(row.actualpacking).format("DD/MM HH:mm") : "---"}/>
                    <Workbook.Column value={row => moment(row.plankonsol).format("DD/MM HH:mm")}/>
                    <Workbook.Column value={row => row.actualkonsol ? moment(row.actualkonsol).format("DD/MM HH:mm") : "---"}/>
                    <Workbook.Column value={row => moment(row.splanload).format("DD/MM HH:mm")}/>
                    <Workbook.Column value={row => moment(row.fplanload).format("DD/MM HH:mm")}/>
                    <Workbook.Column value={row => row.sactualload ? moment(row.sactualload).format("DD/MM HH:mm") : "---"}/>
                    <Workbook.Column value={row => row.factualload ? moment(row.factualload).format("DD/MM HH:mm") : "---"}/>
                    <Workbook.Column value={row => moment(row.splan_sj).format("DD/MM HH:mm")}/>
                    <Workbook.Column value={row => moment(row.fplan_sj).format("DD/MM HH:mm")}/>
                    <Workbook.Column value={row => row.sactual_sj ? moment(row.sactual_sj).format("DD/MM HH:mm") : "---"}/>
                    <Workbook.Column value={row => row.factual_sj ? moment(row.factual_sj).format("DD/MM HH:mm") : "---"}/>
                </Workbook.Sheet>
            </Workbook>
            </>
        )
    }
    handlerWork(datas, keys){
        let ex = "";
        let nama = '';
        let lnama = '';
        let lex = '';
        let btn = true;
        if(keys === "Cabang"){
            ex = "kodecab";
            nama = "namacab";
            lex = 'Kode Cabang';
            lnama = 'Nama Cabang';
        }else if(keys === "Kendaraan"){
            ex = "kodekend";
            nama = "jeniskend";
            lex = 'Kode Kendaraan';
            lnama = 'Nama Kendaraan';
        }else if(keys === "Ekspedisi"){
            ex = "expcode";
            nama = "expname";
            lex = 'Kode Ekspedisi';
            lnama = 'Nama Ekspedisi';
        }
        //console.log(datas.length);
        if(datas.length > 0){
            btn = false;
        }
        //console.log(datas);
        return(
            <>
            <Workbook filename={keys+".xlsx"} element={
            <button disabled={btn} className="btn btn-success mx-1">
                <FontAwesomeIcon icon={faDownload}/> List {keys}
            </button>}>
            <Workbook.Sheet data={datas} name="Sheet 1">
                <Workbook.Column label={lex} value={ex}/>
                <Workbook.Column label={lnama} value={nama}/>
            </Workbook.Sheet>
            </Workbook>
            </>
        );
    }
    onSearch(e){
        this.setState({
            [e.target.name] : e.target.value,
            activePage : 1
        })
        let updateList = this.state.initialListOutbound;
        updateList = updateList.filter(function(item){
            /*return item.NamaEkspedisi.toLowerCase().search(
              e.target.value.toLowerCase()) !== -1;*/
            return(
                item.namacab.toLowerCase().includes(e.target.value.toLowerCase()) ||
                item.listpick.toLowerCase().includes(e.target.value.toLowerCase()) ||
                item.expname.toLowerCase().includes(e.target.value.toLowerCase())
            )
        });
        this.setState({
            listOutbound : updateList
        });
    }
    formatDate(data){
        if(data !== null){
            let datas = moment(data).format("DD-MM HH:mm");
            return(datas);    
        }
        return(null);
    }
    getDataPerencanaan(){
        this.setState({
            isFilter : true,
            listOutbound : []
        })
        let Data = {
            awal : moment(this.state.filterDateAw).format("YYYY-MM-DD 00:00:00"),
            akhir : moment(this.state.filterDateAk).format("YYYY-MM-DD 23:59:59"),
            DC : this.state.DC
        }
        //console.log(Data);
        Axios.post(Config.api+'/getperenc', {
            data : Data
        }).then(res=>{
            let newData = res.data;
            if(newData.length > 0){
                this.setState({
                    activePage : 1
                });
            }
            this.setState({
                listOutbound : newData,
                initialListOutbound : newData,
                isFilter : false
            });
            //console.log(res);
        })
    }
    onSubmit(e){
        e.preventDefault();
        if(this.state.filterDateAw <= this.state.filterDateAk){
            //console.log("berhasil");
            this.getDataPerencanaan();
        }else{
            console.log("gagal");
            alert("Waktu Filter tidak benar")
        }
    }
    onChange(e){
        this.setState({
            [e.target.name] : e.target.value
        })
        console.log(this.state.filterDateAw);
    }
    closeModal(){
        this.setState({addModalShow : false});
    }
    showingModal(){
        this.setState({
            addModalShow : true,
            Type : "add",
            Data : "",
            textListPickNo : false
        });
    }
    editModal(index){
        this.setState({
            addModalShow : true,
            Type : "update",
            Data : this.state.listOutbound[index],
            textListPickNo : true
        });
    }
    onupload(e){
        this.setState({
            isReadFileDone : true,
            isReadFile : true
        })
        let DataList = [];
        console.log(e.target.files);
        readXlsxFile(e.target.files[0]).then((rows) => {
            //console.log(rows);
            for(let i = 3 ; i < rows.length ; i++){
                //console.log(rows[i]);
                let Data = {
                    CabangTujuan : rows[i][1],
                    NamaEkspedisi : rows[i][3],
                    JenisKendaraan : rows[i][4],
                    ListPickingNo : rows[i][2],
                    Kedatangan : moment(rows[i][5]).subtract(19, 'hour').format("YYYY-MM-DD HH:mm:00"),
                    Picking : moment(rows[i][6]).subtract(19, 'hour').format("YYYY-MM-DD HH:mm:00"),
                    Packing : moment(rows[i][7]).subtract(19, 'hour').format("YYYY-MM-DD HH:mm:00"),
                    Consol : moment(rows[i][8]).subtract(19, 'hour').format("YYYY-MM-DD HH:mm:00"),
                    LoadingStart : moment(rows[i][9]).subtract(19, 'hour').format("YYYY-MM-DD HH:mm:00"),
                    LoadingFinish : moment(rows[i][10]).subtract(19, 'hour').format("YYYY-MM-DD HH:mm:00"),
                    SuratJalanStart : moment(rows[i][11]).subtract(19, 'hour').format("YYYY-MM-DD HH:mm:00"),
                    SuratJalanFinish : moment(rows[i][12]).subtract(19, 'hour').format("YYYY-MM-DD HH:mm:00"),
                    DC : rows[i][0],
                    User : this.state.User
                }
                DataList.push(Data);
            }
            console.log(DataList.length);
            if(rows[2][0].toString()==="DC1" && rows[2][1].toString()==="MDN" && rows[2][2].toString()==="176351" && DataList.length>0){
                this.setState({
                    listAdd : DataList,
                    isReadFileDone : false
                })
            }else{
                console.log(rows[2][0]+" "+rows[2][1]+" "+rows[2][2]);
                //alert("File Tidak Valid");
            }
            this.setState({
                isReadFile : false
            })
        })
    }
    onAddList(){
        this.setState({
            isReadFileDone : true
        })
        Axios.post(Config.api+"/addperencanaanlist", {
            data : this.state.listAdd
        }).then(res =>{
            console.log(res);
            if(res.data === false){
                alert("Gagal Insert");
            }else{
                window.location.reload(true);
            }
            this.setState({
                isReadFileDone : true
            })
        })
    }
    clickPage(e){
        let activePage = this.state.activePage;
        let maxActivePage = Math.ceil(this.state.listOutbound.length/this.state.showPage);
        let showPage = this.state.showPage;
        //console.log(e.target.name)
        if(e.target.name === "next" && activePage < maxActivePage){
            activePage ++;
            this.setState({
                activePage
            })
        }
        if(e.target.name === "prev" && activePage > 1){
            activePage --;
            this.setState({
                activePage
            })
        }
        if(e.target.name === "start" && activePage > 1){
            activePage = 1;
            this.setState({
                activePage
            })
        }
        if(e.target.name === "end" && activePage < maxActivePage){
            activePage = maxActivePage;
            this.setState({
                activePage
            })
        }
        if(e.target.name === "showpage"){
            showPage = e.target.value;
            this.setState({
                showPage
            })
        }
    }
    viewPagination(){
        return(
            <>
            <div className="mr-auto form-row ml-3 form-inline">
                <label className="mr-2">Show Item </label>
                <select className="form-control" 
                name="showpage" 
                onChange={this.clickPage.bind(this)}
                defaultValue="5">
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                </select>
            </div>
            <div className="ml-auto my-auto">
            <Pagination>
                <Pagination.First 
                    name="start" 
                    onClick={this.clickPage.bind(this)}
                />
                <Pagination.Prev name="prev" 
                    onClick={this.clickPage.bind(this)}
                />
                <Pagination.Item 
                    style={{width:50}} 
                    className="text-center text-white">
                        {this.state.activePage ? this.state.activePage : "..."}
                </Pagination.Item>
                <Pagination.Next name="next" 
                    onClick={this.clickPage.bind(this)}/>
                <Pagination.Last name="end"
                    onClick={this.clickPage.bind(this)}/>
                <div className="my-auto ml-2">
                    Page : {this.state.activePage ? this.state.activePage : "..."} from {this.state.listOutbound.length ? Math.ceil(this.state.listOutbound.length/this.state.showPage) : "..." } | {this.state.listOutbound.length ? this.state.listOutbound.length : "..."} Data
                </div>
            </Pagination>
            </div>
            </>
        )
    }
    showModalYesNo(data){
        console.log(data);
        this.setState({
            ModalYesNo : true,
            dataModalYesNo : data,
            textModalYesNo : <>Apakah ingin menghapus item <br/> List Pick : {data.listpick}, <br/>Cabang Tujuan : {data.namacab}, <br/>Nama Ekspedisi : {data.expname}</>
        });
    }
    closeModalYesNo(){
        this.setState({
            ModalYesNo : false,
            dataModalYesNo : ''
        })
    }
    yesModalYesNo(data){
        console.log(data)
        this.setState({
            isLoadingModalYesNo : true
        })
        let Data = {
            kodecaba : data.kodecaba,
            lispick : data.listpick,
            kodecabt : data.kodecabt,
            expcode : data.expcode
        }
        console.log(Data)
        Axios.post(Config.api+'/deleteperencanaan', {
            data : Data
        }).then(res=>{
            if(res.data !== false){
                window.location.reload(true);
            }
            this.setState({
                isLoadingModalYesNo : false
            })
        })
    }
    renderColumn(data){
        let activePage = this.state.activePage;
        let showPage = this.state.showPage;
        let Data = data.slice(showPage*(activePage-1), (showPage*activePage)-1);
        //console.log(Data);
        if(this.state.isFilter === false){
            if(Data.length === 0){
                return(
                    <><td colSpan={7}><h4>No Data...</h4></td></>
                )
            }
            else{
            return(
                <>
                    {Data.map((list, index)=>(
                        <tr key={index}>
                            <td>{list.listpick}</td>
                            <td><Button onClick={this.editModal.bind(this, index)} 
                                disabled={this.state.listExp.length === 0 && this.state.listCabang.length === 0 && this.state.listKend.length === 0? true : false}
                                className="btn-success">
                                <FontAwesomeIcon icon={faEdit} className="mx-auto"/>
                                </Button>
                            </td>
                            <td>{list.namacab}</td>
                            <td>{list.expname}</td>
                            <td>{this.formatDate(list.dateplan)}</td>
                            <td>{this.formatDate(list.dateactual)}</td>
                            <td>{list.dateactual ? "" :
                                <Button variant="success"
                                onClick={this.showModalYesNo.bind(this, list)}>
                                <FontAwesomeIcon icon={faTrashAlt}/>
                                </Button>
                            }
                            </td>
                            <td>{list.jeniskend}</td>
                            <td>{list.kubikasi}</td>
                            <td>{list.tonase}</td>
                            <td>{this.formatDate(list.planpicking)}</td>
                            <td>{this.formatDate(list.actualpicking)}</td>
                            <td>{this.formatDate(list.planpacking)}</td>
                            <td>{this.formatDate(list.actualpacking)}</td>
                            <td>{this.formatDate(list.plankonsol)}</td>
                            <td>{this.formatDate(list.actualkonsol)}</td>
                            <td>{this.formatDate(list.splanload)}</td>
                            <td>{this.formatDate(list.fplanload)}</td>
                            <td>{this.formatDate(list.sactualload)}</td>
                            <td>{this.formatDate(list.factualload)}</td>
                            <td>{this.formatDate(list.splan_sj)}</td>
                            <td>{this.formatDate(list.fplan_sj)}</td>
                            <td>{this.formatDate(list.sactual_sj)}</td>
                            <td>{this.formatDate(list.factual_sj)}</td>
                        </tr>
                    ))}
                </>
            )
            }
        }else if(this.state.isFilter === true){
            return(
                <><td colSpan={7}><h4>Loading..</h4></td></>
            )
        }
    }
    render() { 
        return (
            <>
            <Container fluid>
            <Row className="my-2 ml-2">
                <Button 
                    className="form-control col-12 col-xs-6 col-lg-2 mr-4 btn-success" 
                    onClick={this.showingModal.bind(this)}
                    disabled={this.state.listExp.length === 0 && this.state.listCabang.length === 0 && this.state.listKend.length === 0? true : false}
                    >Add Outbound</Button>
                <input className="form-control col-12 col-xs-6 col-lg-4" placeholder="Search" 
                    onChange={this.onSearch.bind(this)}
                    readOnly={this.state.initialListOutbound.length===0 ? true : false}
                />
            </Row>
            <Row className="my-2 ml-2">
            <input className="my-auto" onChange={this.onupload.bind(this)} type="file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"></input>
            <button type="button" disabled={this.state.isReadFileDone} className="btn btn-success" onClick={this.onAddList.bind(this)}>
                {this.state.isReadFile ? "Read File..": <><FontAwesomeIcon icon={faUpload}/> Upload</>}
            </button>
            <a href={ExPernc} download className="btn btn-success mx-1"><FontAwesomeIcon icon={faDownload}/> Download Template</a>
            {this.handlerWork(this.state.listCabang, "Cabang")}
            {this.handlerWork(this.state.listKend, "Kendaraan")}
            {this.handlerWork(this.state.listExp, "Ekspedisi")}
            {this.handleWorkDatas(this.state.listOutbound)}
            </Row>
            <Form autoComplete="off" onSubmit={this.onSubmit.bind(this)}>
                <Row className="my-1">
                    <Form.Label className="my-auto mx-1"> Data dari tinggal </Form.Label>
                    <Form.Control className="col-md-4 col-lg-2 mx-1" value={this.state.filterDateAw} type="date" name="filterDateAw" onChange={this.onChange.bind(this)} required/>
                    <Form.Label className="my-auto mx-1"> s/d </Form.Label>
                    <Form.Control className="col-md-4 col-lg-2 mx-1" value={this.state.filterDateAk} type="date" name="filterDateAk" onChange={this.onChange.bind(this)} required />
                    <Button type="submit" className="btn-success" disabled={this.state.isFilter}>{this.state.isFilter ? "Loading..." : <><FontAwesomeIcon icon={faPaperPlane}/> Filter</> }</Button>
                </Row>
            </Form>
            <div className="col-12 row p-0">
                {this.viewPagination()}
            </div>
            <Table responsive className="text-center">
                <thead>
                    <tr>
                    <th rowSpan="3" className="align-middle">Queue Number</th>
                    <th rowSpan="3" className="align-middle">Action</th>
                    <th rowSpan="3" className="align-middle">Cabang</th>
                    <th colSpan="7" className="align-middle">Ekspedisi</th>
                    <th rowSpan="3" className="align-middle">Plan Picking</th>
                    <th rowSpan="3" className="align-middle">Actual Picking</th>
                    <th rowSpan="3" className="align-middle">Plan Packing</th>
                    <th rowSpan="3" className="align-middle">Actual Packing</th>
                    <th rowSpan="3" className="align-middle">Plan Consol</th>
                    <th rowSpan="3" className="align-middle">Actual Consol</th>
                    <th rowSpan="2" colSpan="2" className="align-middle">Plan Loading</th>
                    <th rowSpan="2" colSpan="2" className="align-middle">Actual Loading</th>
                    <th rowSpan="2" colSpan="2" className="align-middle">Plan Surat Jalan</th>
                    <th rowSpan="2" colSpan="2" className="align-middle">Actual Surat Jalan</th>
                    </tr>
                    <tr>
                    <th rowSpan="2" className="align-middle">Nama</th>
                    <th rowSpan="1" colSpan="3" className="align-middle">Jam</th>
                    <th rowSpan="2" className="align-middle">Type</th>
                    <th rowSpan="2" className="align-middle">Kubikasi</th>
                    <th rowSpan="2" className="align-middle">Tonase</th>
                    </tr>
                    <tr>
                    <th>DC1</th>
                    <th>Actual</th>
                    <th></th>
                    <th>Start</th>
                    <th>Finish</th>
                    <th>Start</th>
                    <th>Finish</th>
                    <th>Start</th>
                    <th>Finish</th>
                    <th>Start</th>
                    <th>Finish</th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderColumn(this.state.listOutbound)}
                </tbody>
            </Table>
            <ModalYesNo 
                    show={this.state.ModalYesNo} 
                    onHide={this.closeModalYesNo.bind(this)}
                    yesClick={this.yesModalYesNo.bind(this)}
                    text={this.state.textModalYesNo}
                    data = {this.state.dataModalYesNo}
                    isLoading = {this.state.isLoadingModalYesNo}
                />
            <OutboundAdd 
                ekspedisi = {this.state.listExp} 
                cabTj = {this.state.listCabang}
                kend = {this.state.listKend}
                show={this.state.addModalShow} 
                onHide={this.closeModal.bind(this)}
                type={this.state.Type}
                datas = {this.state.Data}
                textListPickNo = {this.state.textListPickNo}  
            />
            </Container>
            </>
        );
    }
}
 
export default Outbound;
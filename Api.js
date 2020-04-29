var express = require("express");
var axios = require('axios');
var cors = require('cors');
var bodyParser = require('body-parser');
var moment = require('moment');
var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const { Pool, Client } = require('pg')
//const connectionString = 'postgresql://postgres:dianhuang1998@localhost:5432/test'
//const connectionString = 'postgresql://mostrans:Enseval2018@mostrans.ccoltfh3q1mc.us-east-2.rds.amazonaws.com:5432/mostrans_prod'
const connectionString = 'postgresql://db_dios:Dios2019@mostrans.ccoltfh3q1mc.us-east-2.rds.amazonaws.com:5432/mostrans_dev'
const pool = new Pool({
  connectionString: connectionString,
})  

pool.query(``, (err, result)=>{
  
})

app.get('/linechart/:key',async (req, result)=>{
  let actual = [], plan = [], counter = 0;
  for(let i = 1 ; i <= 24 ; i++){
    let query = `select kodecaba,sum(jplan) as jplan,sum(jactual) as jactual from graphlinecompleteo_v where jam<=`+i+` and kodecaba='`+req.params.key+`' group by kodecaba;`;
    pool.query(query, async(err, res)=>{
      //console.log(i);
      if(res.rowCount == 0){
        actual[i-1] = 0;
        plan[i-1] = 0;
        counter++;
      }else{
        actual[i-1] = parseInt(res.rows[0].jactual);
        plan[i-1] = parseInt(res.rows[0].jplan);
        counter++;
      }
      if(counter == 24){
        console.log("result");
        let datas = {
          actual : actual,
          plan : plan
        }
        result.json(datas);
      }
    })
  }
})

app.post('/login', (req, result)=>{
  query =`select rdc, manp01 from dc_manp where manp01 = '`+req.body.data.username+`' and manp02 = '`+req.body.data.password+`';`;
  console.log(query);
  pool.query(query, (err, res)=>{
    if(err){
      result.json(false);
    }else{
      result.json(res.rows);
    }
  })
})
app.post('/deleteperencanaan', (req, result)=>{
  query =`delete from dc_plano where kodecaba = '`+req.body.data.kodecaba+`' and listpick = '`+req.body.data.lispick+`' and kodecabt = '`+req.body.data.kodecabt+`' and expcode = '`+req.body.data.expcode+`';`;
  console.log(query);
  pool.query(query, (err, res)=>{
    if(err){
      result.json(false)
    }else{
      result.json(true)
    }
  })
})
app.post('/addperencanaanlist', (req, result)=>{
  let now = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
  //console.log(req.body.data[0]);
  let query = `insert into dc_plano (listpick,kodecaba,dateplan,kodecabt,expcode,kodekend,plankonsol,splanload,fplanload,splan_sj,fplan_sj,screated_by,screated_date,planpicking,planpacking,upload_batch) values`;
  for(let i = 0 ; i < req.body.data.length ; i++){
    query += ` ('`+req.body.data[i].ListPickingNo+`', '`+req.body.data[i].DC+`', '`+req.body.data[i].Kedatangan+`', '`+req.body.data[i].CabangTujuan+`', '`+req.body.data[i].NamaEkspedisi+`', '`+req.body.data[i].JenisKendaraan+`', '`+req.body.data[i].Consol+`', '`+req.body.data[i].LoadingStart+`', '`+req.body.data[i].LoadingFinish+`', '`+req.body.data[i].SuratJalanStart+`', '`+req.body.data[i].SuratJalanFinish+`', '`+req.body.data[i].User+`', '`+now+`', '`+req.body.data[i].Picking+`', '`+req.body.data[i].Packing+`', '') `;
    if(i != req.body.data.length-1){
      query += ',';
    }
  }
  query += ';';
  pool.query(query, (err, res)=>{
    if(err){
      result.json(false);
    }else{
      result.json(true);
    }
  })
  console.log(query);
})
app.post('/addperencanaan', (req, result)=>{
  console.log(req.body.data);
  let now = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
  let query = '';
  if(req.body.data.Type == "add"){
    query = `insert into dc_plano (listpick,kodecaba,dateplan,kodecabt,expcode,kodekend,plankonsol,splanload,fplanload,splan_sj,fplan_sj,screated_by,screated_date,planpicking,planpacking,upload_batch) 
    values ('`+req.body.data.ListPickingNo+`', '`+req.body.data.DC+`', '`+req.body.data.Kedatangan+`', '`+req.body.data.CabangTujuan+`', '`+req.body.data.NamaEkspedisi+`', '`+req.body.data.JenisKendaraan+`', '`+req.body.data.Consol+`', '`+req.body.data.LoadingStart+`', '`+req.body.data.LoadingFinish+`', '`+req.body.data.SuratJalanStart+`', '`+req.body.data.SuratJalanFinish+`', '`+req.body.data.User+`', '`+now+`', '`+req.body.data.Picking+`', '`+req.body.data.Packing+`', '');`;    
  }else if(req.body.data.Type == "update"){
    query = `update dc_plano set kodecaba = '`+req.body.data.DC+`', kodecabt = '`+req.body.data.CabangTujuan+`',
    dateplan='`+req.body.data.Kedatangan+`', expcode='`+req.body.data.NamaEkspedisi+`', kodekend = '`+req.body.data.JenisKendaraan+`', plankonsol='`+req.body.data.Consol+`', splanload='`+req.body.data.LoadingStart+`', fplanload='`+req.body.data.LoadingFinish+`', splan_sj = '`+req.body.data.SuratJalanStart+`', fplan_sj='`+req.body.data.SuratJalanFinish+`', planpicking='`+req.body.data.Picking+`', planpacking='`+req.body.data.Packing+`' where listpick = '`+req.body.data.ListPickingNo+`';`;
  }
  console.log(query);
  pool.query(query, (err, res)=>{
    if(err){
      console.log(false);
      result.json(false);
    }else{
      result.json(true);
    }
  })
})

app.post('/addkedatanganoutbound', (req, result)=>{
  console.log(req.body.data);
  let dates = new Date();
  //console.log(dates);
  console.log(`select * from dc_plano where listpick  = '`+req.body.data.ListPickingNo+`' and kodecaba = '`+req.body.data.DC+`' and expcode ='`+req.body.data.Expedisi+`' and to_char(dateplan, 'YYYY-MM-DD') = '`+moment(dates).format('YYYY-MM-DD')+`' and dateactual is null;`);
  pool.query(`select * from dc_plano where listpick  = '`+req.body.data.ListPickingNo+`' and kodecaba = '`+req.body.data.DC+`' and expcode ='`+req.body.data.Expedisi+`' and to_char(dateplan, 'YYYY-MM-DD') = '`+moment(dates).format('YYYY-MM-DD')+`' and dateactual is null;`, (err, res)=>{
    if(err){
      result.json("Error In Server");
    }else{  
      if(res.rowCount == 0){
        //console.log("Tidak ada Jadwal hari ini");
        result.json("Tidak ada jadwal Hari ini");
      }else{
        pool.query(`select * from dc_kedatangano where listpick='`+req.body.data.ListPickingNo+`';`, (err, res)=>{
          if(err){
            result.json("Error In server");
          }else if(res.rowCount == 0){
            let query = `insert into dc_kedatangano (listpick,kodecaba,expcode,kodekend,nokend,namadriver,kedatangan,pkedatangan) 
            values ('`+req.body.data.ListPickingNo+`', '`+req.body.data.DC+`', '`+req.body.data.Expedisi+`', '`+req.body.data.JenisKendaraan+`', '`+req.body.data.NomorKendaraan+`', '`+req.body.data.NamaDriver+`', '`+moment(dates).format('YYYY-MM-DD HH:mm:ss')+`', '`+req.body.data.User+`')`;
            console.log(query);
            pool.query(query, (err, res)=>{
              if(err){
                console.log("error in server");
              }else{
                let que = `update dc_plano set dateactual='`+moment(dates).format('YYYY-MM-DD HH:mm:ss')+`' where listpick='`+req.body.data.ListPickingNo+`';`;
                console.log(que);
                pool.query(que, (err, res)=>{
                  if(err){
                    console.log("error in server");
                  }else{
                    result.json(true);
                  }
                })
              }
            })
          }else{
            result.json("Data tidak berhasil disimpan!");
          }
        })
      }
    }
  })
})

app.post('/getperenc', (req, result)=>{
  console.log(req.body.data);
  //select a.* from dc_plano_v a  (readpast) where a.kodecaba='`+req.body.data.DC+`' and dateplan between '`+req.body.data.awal+`' and '`+req.body.data.akhir+`' order by a.dateplan desc;
  //
  //console.log(`select * from dc_plano_v where kodecaba = '`+req.body.data.DC+`' and dateplan between '`+req.body.data.awal+`' and '`+req.body.data.akhir+`' order by dateplan desc;`);
  pool.query(`select * from dc_plano_v where kodecaba = '`+req.body.data.DC+`' and dateplan between '`+req.body.data.awal+`' and '`+req.body.data.akhir+`' order by dateplan desc;`, (err, res)=>{
    if(err){
      console.log(false);
      result.json(false);
    }else{
      result.json(res.rows);
    }
  })
})

app.post('/editmasterekspedisi', (req, result)=>{
  let KodeEkspedisi = req.body.data.KodeEkspedisi;
  let NamaEkspedisi = req.body.data.NamaEkspedisi;
  let SpellingNamaEkspedisi = req.body.data.SpellingNamaEkspedisi;
  let Email = req.body.data.Email;
  let NoWA = req.body.data.NoWA;
  let IDuser = req.body.data.IDuser;
  let Password = req.body.data.Password;
  pool.query(`UPDATE db_dios.dc_expedisi SET expname = '`+NamaEkspedisi+`', expnamespell = '`+SpellingNamaEkspedisi+`', email = '`+Email+`', hpwa = '`+NoWA+`', userid = '`+IDuser+`', userpass = '`+Password+`' WHERE expcode = '`+KodeEkspedisi+`';`, (err, res) => {
    if(err){
      result.json({message : 'error'});
    }else if(res.rowCount > 0){
      result.json(true);
    }else{
      result.json({message : 'error'});
    }
  })
})

app.post('/addkedinbound', (req, result)=>{
  console.log(req.body.data);
  let myprd = moment(new Date()).format('YY').toString().charAt(1) + String.fromCharCode(65 + parseInt(moment(new Date()).format('M'))-1); 
  let myres = "000";
  console.log(myprd);
  pool.query(`select seq from db_dios.dc_seq where kodedc = '`+req.body.data.DC+`' AND prd = '`+myprd+`';`, (err, res)=>{
    if(err){
      result.json(false);
    }else if(res.rowCount > 0){
      pool.query(`update db_dios.dc_seq set seq=seq+1 where kodedc = '`+req.body.data.DC+`' AND prd = '`+myprd+`' returning seq;`, (err, res)=>{
        myres += res.rows[0].seq;
        myres = myres.substring(myres.length-3);
        myres = myprd + myres;
        console.log("myres" + myres);
        console.log();
        pool.query(`insert into db_dios.dc_kedatangani (kodedc,noantrian,expcode,kodekend,nokend,namadriver,kedatangan,pkedatangan,tpantrian,flagstatus) 
        values ('`+req.body.data.DC+`', '`+myres+`', '`+req.body.data.Ekspedisi+`', '`+req.body.data.JenisKendaraan+`', '`+req.body.data.NomorKendaraan+`', '`+req.body.data.NamaDriver+`', '`+moment(new Date()).format('YYYY-MM-DD hh:mm:ss').toString()+`', '`+req.body.data.User+`', '`+req.body.data.Antrian+`', '20') returning *;`, (err, res)=>{
            if(err){
              console.log(false);
            }else{
              console.log(myres);
              //console.log(true);
              result.json(true);
            }
        })
      })    
    }else{
      pool.query(`insert into db_dios.dc_seq values ('`+req.body.data.DC+`', '`+myprd+`', '2') returning seq;`, (err, res)=>{
        myres += res.rows[0].seq;
        myres = myres.substring(myres.length-3);
        myres = myprd + myres;
        console.log("myres" + myres);
        pool.query(`insert into db_dios.dc_kedatangani (kodedc,noantrian,expcode,kodekend,nokend,namadriver,kedatangan,pkedatangan,tpantrian,flagstatus) 
        values ('`+req.body.data.DC+`', '`+myres+`', '`+req.body.data.Ekspedisi+`', '`+req.body.data.JenisKendaraan+`', '`+req.body.data.NomorKendaraan+`', '`+req.body.data.NamaDriver+`', '`+moment(new Date()).format('YYYY-MM-DD hh:mm:ss').toString()+`', '`+req.body.data.User+`', '`+req.body.data.Antrian+`', '20') returning *;`, (err, res)=>{
            if(err){
              console.log(false);
            }else{
              console.log(myres);
              //console.log(true);
              result.json(true);
            }
        })
      })
    }
  })
})

app.post('/addekspedisi', (req, result)=>{
  //console.log(req.body.data);
  pool.query("SELECT * FROM db_dios.dc_expedisi where expname = '"+req.body.data.NamaEkspedisi+"';",(err, res)=>{
    //console.log(res);
    if(err){
      console.log(err);
      result.json(false);
    }
    else if(res.rowCount>0){
      //console.log("data sudah ada");
      console.log("data sudah ada");
      result.json("dataada");
    }else{
      pool.query("SELECT count(expcode) FROM db_dios.dc_expedisi;",(err, res)=>{
        let count = res.rows[0].count;
        let expc = "X";
        for(let i = 0 ; i < (5-(count.toString().length)) ; i++){
          expc += "0";
        }
        expc += count.toString();
        console.log(expc);
        pool.query(`INSERT INTO db_dios.dc_expedisi (expcode , expname, expnamespell) VALUES ('`+expc+`', '`+req.body.data.NamaEkspedisi+`', '`+req.body.data.SpellingNamaEkspedisi+`') RETURNING *;`,(err, res)=>{
          if(err){
            result.json(false);
          }
          result.json(res.rows[0]);
        });
      });
    }
  });
})
app.get("/getjeniskend", (req, result, next) => {
  pool.query('select * from db_dios.dc_jeniskend order by kodekend;', (err, res) => {
    if(err){
      console.log(err);
      result.json({message : 'error'});
    }else{ 
      result.json(res.rows);
    }
  })
})

app.get("/getdatacab", (req, result, next) => {
  pool.query('select * from db_dios.dc_cab order by kodecab;', (err, res) => {
    if(err){
      console.log(err);
      result.json(false);
    }else{ 
      result.json(res.rows);
    }
  })
})

app.get("/getmasterekspedisi", (req, result, next) => {
  pool.query('select * from db_dios.dc_expedisi order by expname;', (err, res) => {
    if(err){
      result.json({message : 'error'});
    }else{ 
      result.json(res.rows);
    }
  })
});
app.get("/getdoccheck/:key", (req, result, next) => {
  pool.query(`select noantrian,expname,jeniskend,nokend,kedatangan, tipeantrian,expnamespell,namadriver from kedatangani_v where flgstatus='Arrival' and kodedc= '`+req.params.key+`' order by flagstatus, tpantrian, noantrian;`, (err, res) => {
    if(err){
      result.json(false);
    }else{ 
      result.json(res.rows);
    }
  })
});

app.get("/getdocbatal/:key", (req, result, next) => {
  pool.query(`select noantrian,expname,jeniskend,nokend,kedatangan, tipeantrian,expnamespell,namadriver from kedatangani_v where flgstatus='Hold' and kodedc= '`+req.params.key+`' order by flagstatus, tpantrian, noantrian;`, (err, res) => {
    if(err){
      result.json(false);
    }else{ 
      result.json(res.rows);
    }
  })
});

app.get("/dashbordout/:key", (req, result, next) => {
  pool.query(`select * from graphpieo_v where kodecaba='`+req.params.key+`';`, (err, res) => {
    if(err){
      result.json(false);
    }else if(res.rowCount==0){
      result.json(false); 
    }else{
      result.json(res.rows);
    }
  })
});

app.post("/checkdoc", (req, result)=>{
  console.log(req.body.data);
  let query = `update dc_kedatangani Set flagstatus='`+req.body.data.Flag+`',pcheckdokumen='`+req.body.data.User+`',tcheckdokumen='`+moment(new Date()).format("YYYY-MM-DD HH:mm:ss")+`' where kodedc='`+req.body.data.DC+`' and noantrian='`+req.body.data.NoAntrian+`' and flagstatus='`+req.body.data.FlagStat+`';`
  console.log(query);
  pool.query(query, (err, res)=>{
    //console.log(res);
    if(err){
      result.json("Error")
    }else{
      result.json(true);
    }
  })
})

app.get('/getpetugas/:key', (req, result)=>{
  pool.query(`select dc_petugas from dc_petugas where dc='`+req.params.key+`' and dc_type='INBOUND' and dc_level=1 order by dc_petugas;`, (err, res)=>{
    if(err){
      result.json(false)
    }else{
      result.json(res.rows);
    }
  })
})
app.get("/getsunload/:key", (req, result)=>{
  console.log(req.params.key);
  pool.query(`select noantrian,expname,jeniskend,nokend,kedatangan, tipeantrian,expnamespell,namadriver, dc_petugas from kedatangani_v where flgstatus='Waiting' and kodedc='`+req.params.key+`' order by flagstatus, tpantrian, noantrian;`, (err, res)=>{
    if(err){
      result.json();
    }else{
      result.json(res.rows);
    }
  })
})
app.get("/getfunload/:key/:keys", (req, result)=>{
  console.log(req.params.key+" "+req.params.keys);
  let query = `select noantrian,expname,jeniskend,nokend,kedatangan, tipeantrian, namadriver, expnamespell from kedatangani_v where flgstatus='Process' and kodedc='`+req.params.key+`' and punload='`+req.params.keys+`' order by flagstatus, tpantrian, noantrian `;
  pool.query(query, (err, res)=>{
    if(err){
      result.json();
    }else{
      result.json(res.rows);
    }
  })
})
app.post("/addsunload", (req, result)=>{
  console.log(req.body.data);
  pool.query(`update dc_kedatangani set flagstatus='`+req.body.data.Flag+`',punload='`+req.body.data.User+`',startunload='`+moment(new Date).format("YYYY-MM-DD HH:mm:ss")+`',dc_petugas='`+req.body.data.Petugas+`' where kodedc='`+req.body.data.DC+`' and noantrian='`+req.body.data.Antrian+`' and flagstatus='`+req.body.data.FlagStat+`'`, (err, res)=>{
    if(err){
      result.json(false);
    }else{
      result.json(true);
    }
  })
})

app.post("/addfunload", (req, result)=>{
  console.log(req.body.data);
  let query = `update dc_kedatangani set flagstatus='`+req.body.data.Flag+`',finunload='`+moment(new Date).format("YYYY-MM-DD HH:mm:ss")+`' where kodedc='`+req.body.data.DC+`' and noantrian='`+req.body.data.Antrian+`' and flagstatus='`+req.body.data.FlagStat+`' and punload='`+req.body.data.User+`';`;
  console.log(query);
  pool.query(query, (err, res)=>{
    if(err){
      result.json(false);
    }else{
      result.json(true);
    }
  })
})

app.get("/getinbound/:key", (req, result)=>{
  console.log(req.params.key);
  pool.query(`select * from kedatangani_v where kodedc='`+req.params.key+`' and flgstatus<>'Cancel' and ( (DATE_PART('day', now() - finunload) * 24 + DATE_PART('hour', now() - finunload))<11 or finunload is null) order by flagstatus,tpantrian,noantrian;`, (err, res)=>{
    if(err){
      result.json(false);
    }else{
      result.json(res.rows);
    }
  })
})

app.post("/updatdock", (req, result)=>{
  console.log(req.body.data);
  let query = `update dc_kedatangano Set dock_no='`+req.body.data.dock+`',staging_line='`+req.body.data.stag+`' where listpick='`+req.body.data.listpick+`' and dock_no='';`;
  console.log(query);
  pool.query(query, (err, res)=>{
    if(err){
      result.json(false);
    }else{
      result.json(true);
    }
  })
})
app.get("/getoubound/:key", (req, result)=>{
  let query = `select * from kedatangano_v where kodecaba='`+req.params.key+`' order by kedatangan desc`;
  pool.query(query, (err, res)=>{
    if(err){
      result.json(false);
    }else{
      result.json(res.rows);
    }
  })
})
app.get("/getmonoutbound/:key/:updates",async(req, result)=>{
  //console.log(req.params.updates);
  async function update(){
    console.log("Update..");
    let qquery = `select listpick from db_dios.monitorox_v1 where kodecaba='DC1' order by dateplan;`;
    //console.log(qquery);
    let res = await pool.query(qquery);
    if(res && res.rows.length){
        for(let i = 0 ; i < res.rows.length ; i++){
          let stringres = '';
          //call ke api nnti di sni
          var url = 'https://sandboxdev.enseval.com/MostransDios/api/GetOutboundActual/'+res.rows[i].listpick; // Sandbox
          //console.log(url);
          await axios.get(url)
          .then(response => {
            let data = response.data.dt.split(`'`);
            stringres = data[1];
            //console.log(stringres);
          })
          .catch(error=> {
              console.log("Error Get Data List Pick : "+ res.rows[i].listpick);
          });
          //let s = `2020-04-24 20:32~2020-04-24 20:32~~~2020-04-24 08:52~2020-04-24 10:30~2020-04-24 10:50`;
          let a = stringres.split("~");
          for(let i = 0 ; i < a.length ; i++){
            if(a[i] == ''){
              a[i] = null;
            }else{
              a[i] = "'"+a[i]+"'";
            }
          }
          let query = `update dc_plano set actualpicking=`+a[0]+`, actualpacking=`+a[1]+`, actualkonsol=`+a[2]+`, sactualload=`+a[3]+`, factualload=`+a[4]+`, sactual_sj=`+a[5]+`, factual_sj=`+a[6]+` where listpick='`+res.rows[i].listpick+`' and kodecaba ='DC1';`;
          //console.log(query);
          let resultz = await pool.query(query);
          if(resultz){
            console.log("Sukses Update");
          }else{
            console.log("error update data " + res.rows[i].listpick);
          }
      }
      console.log("Clear Update Data");
    }
  }
  //update
  if(req.params.updates == "true"){
    await update();
  }
  //endupdate

  //let query = `select *,row_number() over (order by dateplan) nourut from monitorox_v where kodecaba='DC1' order by dateplan;`;
  //Query asli select *,row_number() over (order by dateplan) nourut from db_dios.monitorox_v1 where kodecaba='DC1' order by dateplan;
  console.log("Query select a.");
  let query = `select a.namacab, a.nokend, a.dock_no, a.warrival, a.wconsol, a.wsload, a.wfload, a.wssj, a.wfsj, b.* from db_dios.monitorox_v1 a inner join dc_plano b on a.listpick = b.listpick where a.kodecaba='`+req.params.key+`' order by a.dateplan;`;
  let data = [];
  pool.query(query, (err, res)=>{
    if(err){
      result.json(false);
    }else{
      data = res.rows;
      for(let i = 0 ; i < data.length ; i ++){
        data[i].parrival = "";
        data[i].pconsol = "";
        data[i].pls = "";
        data[i].plf = "";
        data[i].pssj = "";
        data[i].pfsj = "";
        //Arrival
        if(data[i].dateactual == null){
          data[i].parrival = "W";
        }
        else if(data[i].dateplan > data[i].dateactual){
          data[i].parrival = "OK";
        }else{
          data[i].parrival = "NOK";
        }
        //Consol
        if(data[i].actualkonsol == null){
          data[i].pconsol = "W";
        }
        else if(data[i].plankonsol > data[i].actualkonsol){
          data[i].pconsol = "OK";
        }else{
          data[i].pconsol = "NOK";
        }
        //loadingStart
        if(data[i].sactualload == null){
          data[i].pls = "W";
        }
        else if(data[i].splanload > data[i].sactualload){
          data[i].pls = "OK";
        }else{
          data[i].pls = "NOK";
        }
        //LoadingFinish
        if(data[i].factualload == null){
          data[i].plf = "W";
        }
        else if(data[i].fplanload > data[i].factualload){
          data[i].plf = "OK";
        }else{
          data[i].plf = "NOK";
        }
        //Surat Jalan Start
        if(data[i].sactual_sj == null){
          data[i].pssj = "W";
        }
        else if(data[i].splan_sj > data[i].sactual_sj){
          data[i].pssj = "OK";
        }else{
          data[i].pssj = "NOK";
        }
        //SJ FInish
        if(data[i].factual_sj == null){
          data[i].pfsj = "W";
        }
        else if(data[i].fplan_sj > data[i].factual_sj){
          data[i].pfsj = "OK";
        }else{
          data[i].pfsj = "NOK";
        }
      }
      result.json(data);
      //console.log("Result done");
      //console.log(data);
    }
  })
})
app.listen(2000, () => {
    console.log("Server running on port 2000");
});
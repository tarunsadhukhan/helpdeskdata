const express = require('express');
const router = express.Router();
const db = require('../Connection');
 
const cors = require('cors');
const bodyParser = require('body-parser');

// Create Express app
const app = express();

app.use(cors()); // Allow cross-origin requests
app.use(bodyParser.json()); // Parse incoming JSON requests



router.get('/doctor', (req, res) => {
  // Correct way to log and access query parameters
  console.log('Received body:', req.query);  // This should show correct varfromdate, vartodate
  
  // Destructure query parameters from req.query
  const { varfromdate, vartodate, varebno, vardepartment, company_id } = req.query;
  
  // Log to verify individual variables
  console.log('varfromdate:', varfromdate);
  console.log('vartodate:', vartodate);
  
  // Check if the query params exist and are valid
  if (!varfromdate || !vartodate) {
    return res.status(400).json({ error: 'Invalid dates provided' });
  }

  // Function to format the date
  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Convert received string date to a Date object
  const fdate = new Date(varfromdate);
  const tdate = new Date(vartodate);

  // Format the dates to YYYY-MM-DD
  const formattedFromDate = formatDate(fdate);
  const formattedToDate = formatDate(tdate);

  // Log the formatted dates
  console.log('Formatted from date:', formattedFromDate);
  console.log('Formatted to date:', formattedToDate);
//  const formattedVarFromDate = formatDate(varfromdate);
//  const formattedVarToDate = formatDate(vartodate); // Remove this line

  // Create a query based on form input
  //let query = `select * from company_master `;
  
  const params = [];
  
  let query = `select `;
//  console.log(req.body.varfromdate);
  query += `?` ;
  params.push(formattedFromDate);
  query +=  ` startdate,`; 
  query += `?` ;
  params.push(formattedToDate);
  query +=  ` enddate,`; 
  
  query += ` eb_no,first_name,dept_desc,desig,sum(working_hours-idle_hours) whrs from daily_attendance da 
    join department_master dm on dm.dept_id =da.worked_department_id 
    join designation d on d.id =da.worked_designation_id 
    join tbl_hrms_ed_personal_details thepd on thepd.eb_id =da.eb_id 
    where da.is_active =1 `
    query += ` and da.company_id = ?`;
    params.push(company_id);
    query += ` and attendance_date between ?`;
    params.push(formattedFromDate);
    query += ` and  ?`;
    params.push(formattedToDate);
    
//    and da.worked_department_id =2 
//    group by eb_no,first_name,dept_desc,desig`;
  //`SELECT * FROM your_table WHERE 1=1`;



/*
  if (varfromdate) {
    query += ` AND date_column >= ?`;
    params.push(varfromdate);
  }
  if (vartodate) {
    query += ` AND date_column <= ?`;
    params.push(vartodate);
  }
  */

  
  if (varebno !== null && varebno !== '' && varebno !== 'null') {
    query += ` AND eb_no = ?`;
    params.push(varebno);
  }
    if (vardepartment !== null && vardepartment !== 0 && vardepartment !== 'null')   {
    query += ` AND da.worked_department_id  = ?`;
    params.push(vardepartment);
  }

  query += ` group by eb_no,first_name,dept_desc,desig order by eb_no`;

  // Execute the query
  console.log('Query:', query);
  
  db.query(query, params, (err, result) => {
    if (err) {
      console.error('Error fetching table data:', err);
      return res.status(500).send('Server error');
    }
    res.json(result);
  });
});


router.get('/framewise-summary', (req, res) => {
   // Correct way to log and access query parameters

   console.log('Received body:', req.query);  // This should show correct varfromdate, vartodate
  
   // Destructure query parameters from req.query
   const { varfromdate, vartodate , company_id } = req.query;
   
   // Log to verify individual variables
   console.log('varfromdate:', varfromdate);
   console.log('vartodate:', vartodate);
   
   // Check if the query params exist and are valid
   if (!varfromdate || !vartodate) {
     return res.status(400).json({ error: 'Invalid dates provided' });
   }
 
   // Function to format the date
   function formatDate(date) {
     const year = date.getFullYear();
     const month = String(date.getMonth() + 1).padStart(2, '0');
     const day = String(date.getDate()).padStart(2, '0');
     return `${year}-${month}-${day}`;
   
   }
 
   function formatDat(date) {
     const year = date.getFullYear();
     const month = String(date.getMonth() + 1).padStart(2, '0');
     const day = String(date.getDate()).padStart(2, '0');
     return `${day}-${month}-${year}`;
   
   }
 
   // Convert received string date to a Date object
   const fdate = new Date(varfromdate);
   const tdate = new Date(vartodate);
 
 
   // Format the dates to YYYY-MM-DD
   const formattedFromDate = formatDate(fdate);
   const formattedToDate = formatDate(tdate);
 
   const formattedFromDat = formatDat(fdate);
   const formattedToDat = formatDat(tdate);
  
   // Log the formatted dates
   console.log('Formatted from date:', formattedFromDate);
   console.log('Formatted to date:', formattedToDate);
 //  const formattedVarFromDate = formatDate(varfromdate);
 //  const formattedVarToDate = formatDate(vartodate); // Remove this line
 
   // Create a query based on form input
   //let query = `select * from company_master `;
   
   const params = [];
 
   /*  
   let query = `select `;
 //  console.log(req.body.varfromdate);
   query += `?` ;
   params.push(formattedFromDate);
   query +=  ` startdate,`; 
   query += `?` ;
   params.push(formattedToDate);
   query +=  ` enddate,`; 
   
   query += ` eb_no,first_name,dept_desc,desig,sum(working_hours-idle_hours) whrs from daily_attendance da 
     join department_master dm on dm.dept_id =da.worked_department_id 
     join designation d on d.id =da.worked_designation_id 
     join tbl_hrms_ed_personal_details thepd on thepd.eb_id =da.eb_id 
     where da.is_active =1 `
     query += ` and da.company_id = ?`;
     params.push(company_id);
     query += ` and attendance_date between ?`;
     params.push(formattedFromDate);
     query += ` and  ?`;
     params.push(formattedToDate);
     
   query += ` group by eb_no,first_name,dept_desc,desig order by eb_no`;
 */
 console.log(varfromdate);
/*
 let query=`SELECT 
     vpddd.mechine_id, 
     vpddd.frameno,
     SUM(vpddd.no_of_doff) AS noofdoff,
     round(SUM(vpddd.prod),0) AS prod,
     ROUND(SUM(prod) / SUM(vpddd.prod100) * 100, 2) AS eff,
     ROUND(SUM(prod / prod100) * 100, 2) AS effa,
     SUM(prod100) AS prod100,round(sum(prod)/sum(no_of_doff),2) avgwt,
     round(sum(prod)/sum(mcwhrs)*8,2) avgprod,round(sum(no_of_doff)/sum(mcwhrs)*8,2) avgnoofdoff, `
     query += `  ? fromDate, `;
     params.push( formattedFromDat );
     query += `  ? toDate `;
     params.push(formattedToDat);
     query+=`, 
     case when ROUND(SUM(prod) / SUM(vpddd.prod100) * 100, 2) <50 then 'bg-red'
     when ROUND(SUM(prod) / SUM(vpddd.prod100) * 100, 2) between 50 and 60 then 'bg-blue'
     when ROUND(SUM(prod) / SUM(vpddd.prod100) * 100, 2) between 60 and 70 then 'bg-yellow'
      else 'bg-green' end rowcolor `
     query += ` FROM 
   EMPMILL12.view_proc_daily_doff_details vpddd 
 WHERE `
   query += `  compid = ?`;
   params.push(company_id);
   query += ` and doffdate between ?`;
   params.push(formattedFromDate);
   query += ` and  ?`;
   params.push(formattedToDate);
 
   query += ` GROUP BY 
   mechine_id, frameno 
 ORDER BY CAST(frameno AS UNSIGNED)`;
 */
 
 let query=`SELECT
    vpddd.mc_id mechine_id,
    vpddd.frameno,
    SUM(vpddd.no_of_doff) AS noofdoff,
    round(SUM(vpddd.net_weight),0) AS prod,
    ROUND(SUM(net_weight) / SUM(vpddd.prod100) * 100, 2) AS eff,
    ROUND(SUM(net_weight / prod100) * 100, 2) AS effa,
    SUM(prod100) AS prod100,round(sum(net_weight)/sum(no_of_doff),2) avgwt,
    round(sum(net_weight)/sum(mchours)*8,2) avgprod,round(sum(no_of_doff)/sum(mchours)*8,2) avgnoofdoff, `
    query += `  ? fromDate, `;
     params.push( formattedFromDat );
     query += `  ? toDate `;
     params.push(formattedToDat);
     query+=`, 
     case when ROUND(SUM(net_weight) / SUM(vpddd.prod100) * 100, 2) <50 then 'bg-red'
    when ROUND(SUM(net_weight) / SUM(vpddd.prod100) * 100, 2) between 50 and 60 then 'bg-blue'
    when ROUND(SUM(net_weight) / SUM(vpddd.prod100) * 100, 2) between 60 and 70 then 'bg-yellow'
 	else 'bg-green' end rowcolor `
   query += ` FROM 
   EMPMILL12.tbl_doffdata_all_calc vpddd
 WHERE `
   query += `  company_id = ?`;
   params.push(company_id);
   query += ` and doffdate between ?`;
   params.push(formattedFromDate);
   query += ` and  ?`;
   params.push(formattedToDate);
 
   query += ` GROUP BY 
 mc_id, frameno
ORDER BY CAST(frameno AS UNSIGNED)`;

 
 
   // Execute the query
   console.log('Query:', query);
//   db.query(query, params, (err, lineData) => {
   
   db.query(query, params, (err, lineData) => {
     if (err) {
       console.error('Error fetching table data:', err);
       return res.status(500).send('Server error');
     }

//     res.json(result);
const headers = lineData.length > 0 ? Object.keys(lineData[0]).map(key => key) : [];

const response = {
    lineData: lineData,
    headers: headers, // Include headers in the response
    message: null,
    filterTable: true,
    defaultPageSize: 5,
    showPaginationTop: false,
    showPaginationBottom: true,
    totalRecords: lineData.length
};

res.json(response);

    });
 });

 
 router.get('/doffdetail-data', (req, res) => {
   // Correct way to log and access query parameters

   console.log('Received body:', req.query);  // This should show correct varfromdate, vartodate
  
   // Destructure query parameters from req.query
   const { varfromdate, vartodate , company_id, varframeno,varmechine_id } = req.query;
   
   // Log to verify individual variables
   console.log('varfromdate:', varfromdate);
   console.log('vartodate:', vartodate);
   
   // Check if the query params exist and are valid
   if (!varfromdate || !vartodate) {
     return res.status(400).json({ error: 'Invalid dates provided' });
   }
 
   // Function to format the date
   function formatDate(date) {
     const year = date.getFullYear();
     const month = String(date.getMonth() + 1).padStart(2, '0');
     const day = String(date.getDate()).padStart(2, '0');
  
   
  return `${year}-${month}-${day}`;
 
   }
 function fchange(fchng) {
   const yr = fchng.substring(6,10) ;
   const result = fchng.substring(4, 7);  
   const mn = fchng.substring(3,5) ;
   const da = fchng.substring(0,2) ;
 
 console.log(fchng,'=',yr,'=',mn,'=',da);
 
 return `${yr}-${mn}-${da}`;
 
 
 }
 
   // Convert received string date to a Date object
   const fd=fchange(varfromdate)
   const td=fchange(vartodate)
 console.log('after conv',fd,'=',td)
 
   const fdate = new Date(fd);
   const tdate = new Date(td);
 
   // Format the dates to YYYY-MM-DD
   const formattedFromDate = fdate;
   const formattedToDate = tdate;
 
   // Log the formatted dates
   console.log('Formatted from date:', formattedFromDate);
   console.log('Formatted to date:', formattedToDate);
    
   const params = [];
 
  

 let query=`SELECT
    vpddd.mc_id mechine_id,
    vpddd.frameno,DATE_FORMAT(doffdate,'%d-%m-%Y') doffdatem,
    SUM(vpddd.no_of_doff) AS noofdoff,
    round(SUM(vpddd.net_weight),0) AS prod,
    ROUND(SUM(net_weight) / SUM(vpddd.prod100) * 100, 2) AS eff,
    ROUND(SUM(net_weight / prod100) * 100, 2) AS effa,
    SUM(prod100) AS prod100,round(sum(net_weight)/sum(no_of_doff),2) avgwt,
    round(sum(net_weight)/sum(mchours)*8,2) avgprod,round(sum(no_of_doff)/sum(mchours)*8,2) avgnoofdoff, `
    query += `  ? fromDate, `;
    params.push(formattedFromDate);
    query += `  ? toDate `;
    params.push(formattedToDate);
    query+=`, 
     case when ROUND(SUM(net_weight) / SUM(vpddd.prod100) * 100, 2) <50 then 'bg-red'
    when ROUND(SUM(net_weight) / SUM(vpddd.prod100) * 100, 2) between 50 and 60 then 'bg-blue'
    when ROUND(SUM(net_weight) / SUM(vpddd.prod100) * 100, 2) between 60 and 70 then 'bg-yellow'
 	else 'bg-green' end rowcolor `
   query += ` FROM 
   EMPMILL12.tbl_doffdata_all_calc vpddd
 WHERE `
   query += `  company_id = ?`;
   params.push(company_id);
   query += ` and doffdate between ?`;
   params.push(formattedFromDate);
   query += ` and  ?`;
   params.push(formattedToDate);
   query += ` and mc_id= ?`;
   params.push(varmechine_id);
   query += ` GROUP BY 
   mc_id, frameno,doffdate 
 ORDER BY CAST(frameno AS UNSIGNED),doffdate`;


 
 
   // Execute the query
   console.log('Query:', query);
   
   db.query(query, params, (err, result) => {
     if (err) {
       console.error('Error fetching table data:', err);
       return res.status(500).send('Server error');
     }
     res.json(result);
   });

  });
 
 router.get('/fetchtrolly-data', (req, res) => {
  
  console.log('Received query:', req.query); // This logs the correct query parameters like varfromdate, varmechine_id, company_id, spell

  // Destructure query parameters from req.query
  const { trollyid, company_id, varmechine_id, spell,varfromdate  } = req.query;

  // Check if the required query params are provided
  if (!trollyid || !company_id || !varmechine_id || !spell) {
    return res.status(400).send('Missing required query parameters');
  }

  const params = [];

   

  let query=`select sum(bobbin_weight+trolly_weight) tarewt,sum(noofdoff) noofdoff,sum(tnetwt) tnetwt from (
    select
      bobbin_weight,
      0 trolly_weight,0 noofdoff,0 tnetwt
    from
      mechine_master
    where
      mechine_id =?`
      params.push(varmechine_id)
    query+=`   union all
    select
      0 bobbin_weight,
      trolly_weight+ basket_weight trolly_weight,0 noofdoff,0 tnetwt
    from
      trollymst
    where
      trollyid =?`
      params.push(trollyid)
    query+=` union all
          SELECT 0 bobbin_weight,
      0 trolly_weight, COUNT(*) AS noofdoff, IFNULL(ROUND(SUM(netwt), 2), 0) AS tnetwt
          FROM dofftable dftmx
          JOIN mechine_master mm ON dftmx.frameno = mm.frame_no AND dftmx.company_id = mm.company_id
          WHERE mm.mechine_id = ?`
          params.push(varmechine_id)
          query+=` AND dftmx.is_active = 1
          AND doffdate =?`
          params.push(varfromdate)
          query+=` AND dftmx.company_id = ?`
          params.push(company_id);
          query+=` AND spell =?`
          params.push(spell);
         query+=`) g `;

  console.log('Query:', query);
   
  db.query(query, params, (err, result) => {
    if (err) {
      console.error('Error fetching table data:', err);
      return res.status(500).send('Server error');
    }
    res.json(result);
  });
 


 }); 



 router.get('/fetchframe-data', (req, res) => {
  // Log query parameters
  console.log('Received query:', req.query); // This logs the correct query parameters like varfromdate, varmechine_id, company_id, spell

  // Destructure query parameters from req.query
  const { varfromdate, company_id, varmechine_id, spell } = req.query;

  // Check if the required query params are provided
  if (!varfromdate || !company_id || !varmechine_id || !spell) {
    return res.status(400).send('Missing required query parameters');
  }

  // Function to format the date from DD-MM-YYYY to YYYY-MM-DD
  function fchange(fchng) {
    const yr = fchng.substring(6, 10);
    const mn = fchng.substring(3, 5);
    const da = fchng.substring(0, 2);

    console.log('Formatted Date:', `${yr}-${mn}-${da}`);
    return `${yr}-${mn}-${da}`;
  }

  // Convert the input date to the correct format
  const fd = (varfromdate);

  console.log('After conversion, from date:', fd,'=',varfromdate);

  // Parameters for the first query
  const params = [];

  // Construct the first query
  let query = `
    SELECT mst.*, prd.* 
    FROM (
      SELECT ifnull(trollyid,0) trollyid,IFNULL(g.trollyno, ' ') AS trollyno, IFNULL(trolly_weight + basket_weight, 0) + bobbin_weight AS tarewt, mechine_id, g.company_id 
      FROM (
        SELECT mm.mechine_id, trollyno, dftmx.company_id, bobbin_weight  
        FROM dofftable dftmx 
        JOIN mechine_master mm ON dftmx.frameno = mm.frame_no AND dftmx.company_id = mm.company_id 
        WHERE mm.mechine_id = ?
      `;
  params.push(varmechine_id);
  query += ` AND dftmx.company_id = ?`;
  params.push(company_id);
  query += `
        AND dftmx.is_active = 1
        ORDER BY auto_id DESC LIMIT 1
      ) g 		
      LEFT JOIN trollymst trmst ON g.trollyno = trmst.trollyno AND g.company_id = trmst.company_id 
      WHERE process_type = 2 
    ) mst 
    LEFT JOIN (
      SELECT mechine_id, COUNT(*) AS noofdoff, IFNULL(ROUND(SUM(netwt), 2), 0) AS tnetwt 
      FROM dofftable dftmx 
      JOIN mechine_master mm ON dftmx.frameno = mm.frame_no AND dftmx.company_id = mm.company_id 
      WHERE mm.mechine_id = ?
  `;
  params.push(varmechine_id);

  query += `
      AND dftmx.is_active = 1
      AND doffdate = ?
  `;
  params.push(varfromdate);

  query += `
      AND dftmx.company_id = ?
      AND spell = ?
  `;
  params.push(company_id);
  params.push(spell);

  query += `) prd ON mst.mechine_id = prd.mechine_id`;

  // Execute the first query
  console.log('Query 1:', query);

  db.query(query, params, (err, result) => {
    if (err) {
      console.error('Error executing query 1:', err);
      return res.status(500).send('Server error');
    }

    // Ensure there is at least one result
    if (result.length > 0) {
      const bobbin_weight = result[0].bobbin_weight || 0;
      const updated_weight = bobbin_weight + 10; // Add 10 to bobbin_weight
      console.log('Original Bobbin Weight:', bobbin_weight);
      console.log('Updated Bobbin Weight:', updated_weight);
    }

    // Parameters for the second query
//    const params2 = [fd, spell, company_id, varmechine_id];
    const params2 = [];

    console.log(company_id,spell);
    // Construct the second query
    let query2 = `
    SELECT auto_id, DATE_FORMAT(doffdate, '%d-%m-%Y') AS doffdate, spell, frameno, trollyno, grosswt, tarewt, netwt, entrytime,
    case when entry_mode='M' then 'bg-yellow'
    when entry_mode='W' then    'bg-green' end rowcolor 
    FROM dofftable d
    LEFT JOIN mechine_master mm ON mm.frame_no = d.frameno AND d.company_id = mm.company_id
    WHERE doffdate = ?
  `;
  params2.push(varfromdate);  // Push varfromdate first
  
  query2 += ` AND d.company_id = ?`;
  params2.push(company_id);    // Push company_id next
  
  query2 += ` AND mm.mechine_id = ?`;
  params2.push(varmechine_id); // Push varmechine_id next
  
  query2 += ` AND spell = ? `;
  params2.push(spell);         // Push spell last
  
  query2 += ` AND is_active = 1 ORDER BY auto_id DESC`;
  
  console.log('Query2:', query2);
  console.log('Params:', params2);
  
    // Execute the second query
    db.query(query2, params2, (err2, result2) => {
      if (err2) {
        console.error('Error executing query 2:', err2);
        return res.status(500).send('Server error');
      }

      // If result2 has any rows, log and send response
      if (result2.length > 0) {
        const auto_id = result2[0].auto_id;
        console.log('Auto ID from result2:', auto_id);
      }

      // Send both results in the response
      res.json({
        result: result,  // First query result
        data: result2    // Second query result as 'data'
      });
    });
  });
});


router.post('/doffdatasave', (req, res) => {
  // Log the query parameters if needed
  console.log('Received querydddffdfdf:', req.query);

  // Destructure the form data from req.body
  const { frameNo, grossWeight, tareWeight, netWeight, totalNetWeight, doffNo, trollyNo, spell, doffingDate } = req.body;
console.log('dnddndn')
const companyId=2
  // Log form data to check if it's received correctly
  console.log('Form Data:', {
    frameNo,
    grossWeight,
    tareWeight,
    netWeight,
    totalNetWeight,
    doffNo,
    trollyNo,
    companyId,
    spell,
    doffingDate
  });

  // Get the current date and time
  const now = new Date();
  
  // Get the user's IP address
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log('User IP:', ip);

 
  const params5=[];
  let qty=`select frame_no frameno from mechine_master where mechine_id=`+frameNo
console.log(qty)
  db.query(qty, params5, (err2, result2) => {
        console.log(result2)  
    let frmno = result2[0].frameno;
      
      console.log('Frame No:', frmno);
      const params6=[];
      let qty=`select trollyno from trollymst where trollyid=`+trollyNo
      db.query(qty, params5, (err2, result3) => {
          let trlno=result3[0].trollyno 
    

  // Prepare the MySQL query and parameters
  const query = `
    INSERT INTO dofftable (company_id, doffdate, entrydate, entry_mode, frameno, grosswt, is_active, netwt, spell, 
    tarewt, tot_net_wt, trollyno, user_ip, entrytime) 
    VALUES (?, ?, ?, 'W', ?, ?, 1, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    companyId,             // company_id
    doffingDate,              // doffdate (coming from the form)
    now,                   // entrydate (current timestamp)
    frmno,               // frameno
    grossWeight,           // grosswt
    netWeight,             // netwt
    spell,                 // spell
    tareWeight,            // tarewt
    totalNetWeight,        // tot_net_wt
    trlno,              // trollyno
    ip,                    // user_ip
    now                    // entrytime (current timestamp)
  ];

  console.log('Executing Query:', query);
  console.log('Params:', params);

  // Execute the MySQL query
  db.query(query, params, (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ message: 'Server error', error: err });
    }

    // Success: return a success message
    console.log('Data inserted successfully:', result);
    res.status(201).json({ message: 'Data saved successfully!', data: result });
  });
});
})

})




 router.get('/doffdetailrecords', (req, res) => {
  // Log query parameters
  console.log('Received query:', req.query); // This logs the correct query parameters like varfromdate, varmechine_id, company_id, spell

  // Destructure query parameters from req.query
  const { varfromdate, spell,company_id } = req.query;

  // Check if the required query params are provided
  if (!varfromdate || !company_id  || !spell) {
    return res.status(400).send('Missing required query parameters');
  }

  // Function to format the date from DD-MM-YYYY to YYYY-MM-DD
  function fchange(fchng) {
    const yr = fchng.substring(6, 10);
    const mn = fchng.substring(3, 5);
    const da = fchng.substring(0, 2);

    console.log('Formatted Date:', `${yr}-${mn}-${da}`);
    return `${yr}-${mn}-${da}`;
  }

  // Convert the input date to the correct format
  const fd = (varfromdate);

  console.log('After conversion, from date:', fd,'=',varfromdate);

  // Parameters for the first query
  const params = [];

  // Construct the first query
 
 
    // Ensure there is at least one result
 
    // Parameters for the second query
//    const params2 = [fd, spell, company_id, varmechine_id];
    const params2 = [];

    console.log(company_id,spell);
    // Construct the second query
    let query2 = `
    SELECT auto_id, DATE_FORMAT(doffdate, '%d-%m-%Y') AS doffdate, spell, frameno, trollyno, grosswt, tarewt, netwt, entrytime,
    case when entry_mode='M' then 'bg-yellow'
    when entry_mode='W' then    'bg-green' end rowcolor 
    FROM dofftable d
    LEFT JOIN mechine_master mm ON mm.frame_no = d.frameno AND d.company_id = mm.company_id
    WHERE doffdate = ?
  `;
  params2.push(varfromdate);  // Push varfromdate first
  
  query2 += ` AND d.company_id = ?`;
  params2.push(company_id);    // Push company_id next
     
  query2 += ` AND spell = ? `;
  params2.push(spell);         // Push spell last
  
  query2 += ` AND is_active = 1 ORDER BY auto_id DESC`;
  
  console.log('Query2:', query2);
  console.log('Params:', params2);
  
    // Execute the second query
    db.query(query2, params2, (err2, result2) => {
      if (err2) {
        console.error('Error executing query 2:', err2);
        return res.status(500).send('Server error');
      }

      // If result2 has any rows, log and send response
      if (result2.length > 0) {
        const auto_id = result2[0].auto_id;
        console.log('Auto ID from result2:', auto_id);
      }

      // Send both results in the response
      res.json({
        data: result2    // Second query result as 'data'
      });
    });
  });


  router.get('/doffsummaryrecords', (req, res) => {
    // Log query parameters
    console.log('Received query:', req.query); // This logs the correct query parameters like varfromdate, varmechine_id, company_id, spell
  
    // Destructure query parameters from req.query
    const { varfromdate, spell,company_id } = req.query;
  
    // Check if the required query params are provided
    if (!varfromdate || !company_id  || !spell) {
      return res.status(400).send('Missing required query parameters');
    }
  
    // Function to format the date from DD-MM-YYYY to YYYY-MM-DD
    function fchange(fchng) {
      const yr = fchng.substring(6, 10);
      const mn = fchng.substring(3, 5);
      const da = fchng.substring(0, 2);
  
      console.log('Formatted Date:', `${yr}-${mn}-${da}`);
      return `${yr}-${mn}-${da}`;
    }
  
    // Convert the input date to the correct format
    const fd = fchange(varfromdate);
  
    console.log('After conversion, from date:', fd,'=',varfromdate);
  
    // Parameters for the first query
    const params = [];
  
    // Construct the first query
   
   
      // Ensure there is at least one result
   
      // Parameters for the second query
  //    const params2 = [fd, spell, company_id, varmechine_id];
      const params2 = [];
  
      console.log(company_id,spell);
      // Construct the second query
      let query2 = `
     SELECT DATE_FORMAT(doffdate, '%d-%m-%Y') AS doffdate, spell, frameno,count(*) noofdoff,round(sum(netwt),2) netwt, 
     max(entrytime) entrytime
    FROM dofftable d
    WHERE doffdate = ?`
    params2.push(varfromdate);  // Push varfromdate first
    query2 += ` AND d.company_id = ?`;
    params2.push(company_id);    // Push company_id next
       
    query2 += ` AND spell = ? `;
    params2.push(spell);         // Push spell last
    
    query2 += ` AND is_active = 1 GROUP BY doffdate, spell, frameno ORDER BY CAST(frameno AS UNSIGNED)`;
    

     
    console.log('Query2:', query2);
    console.log('Params:', params2);
    
      // Execute the second query
      db.query(query2, params2, (err2, result2) => {
        if (err2) {
          console.error('Error executing query 2:', err2);
          return res.status(500).send('Server error');
        }
  
        // If result2 has any rows, log and send response
        if (result2.length > 0) {
          const auto_id = result2[0].auto_id;
          console.log('Auto ID from result2:', auto_id);
        }
  
        // Send both results in the response
        res.json({
          data: result2    // Second query result as 'data'
        });
      });
    });
  

module.exports = router;


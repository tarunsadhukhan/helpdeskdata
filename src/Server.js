const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const db = require('./Connection');
const authRoutes = require('./routes/authRoutes');
const menuRoutes = require('./routes/menuRoutes');
const formRoutes = require('./routes/formRoutes');
const companyRoutes = require('./routes/companyRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const servdeskRoutes = require('./routes/servdeskRoutes');

const attd = require('./')


const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');




app.use(cors());

 
app.use(bodyParser.json());
 

const SECRET_KEY = 'your_jwt_secret'; // Replace with your own secret key


app.use('/api', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/form', formRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/servdeskRoutes', servdeskRoutes);

app.use('/api',menuRoutes)


app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  // Query the MySQL database to find the user
  const query = 'SELECT * FROM user_details WHERE user_login_id = ?';
  console.log('Query:', query);
  db.query(query, [username], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    console.log('Received body:', req.body);  // This should show correct varfromdate, vartodate
 
    const user = results[0];

    // Compare the hashed password
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err || !isMatch) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      // If password matches, generate a JWT token
      const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
      return res.json({  message: 'Login successful',
        token,
        user_id: user.user_id });
    });
  });
});

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ error: 'Access denied, no token provided' });
  }
  
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    req.user = decoded;
    next();
  });
};

// API route to verify if the user is logged in
app.get('/api/verify', verifyToken, (req, res) => {
  return res.json({ message: 'User is authenticated', user: req.user });
});



app.get('/api/menu', (req, res) => {
  let userId = req.headers['x-user-id']; // Optionally extract user_id from headers
  const compId = req.headers['x-comp-id']; // Optionally extract user_id from headers
  const params = [];

  if (userId >0) {
    console.log('User ID:', userId);
  } else  
    { userId = '2'; }
 
  console.log('User ID:', userId);
  console.log('Company ID:', compId);

let sqlQuery1 = '';
if (userId === '2') {
  sqlQuery1 = `
    select id,name,parent_id from (
      select menu_id id,menu_name name , case when   parent_id=0 then 0 else parent_id end parent_id ,mmenu_id
      from ( 
        SELECT menu_id, menu menu_name, 
        parent_id, menu_path path, menu_state component_name, report_path component_path,menu_id mmenu_id,
        menu_icon_name icon FROM menu_master where parent_id=0 
        union all 
        SELECT menu_id, menu menu_name, 
        parent_id, menu_path path, menu_state component_name, report_path component_path,parent_id  
        mmenu_id,menu_icon_name icon FROM menu_master where menu_id in 
        (select menu_id  from menu_master where parent_id>0 ) ) g ORDER BY   menu_id
    ) g order by mmenu_id limit 3290
  `;
} else { 
  sqlQuery1 = `select * from (
    select menu_id id,menu_name name , case when   parent_id=0 then 0 else parent_id end parent_id ,mmenu_id
    from (
      SELECT menu_id, menu menu_name,
      parent_id, menu_path path, menu_state component_name, report_path component_path,menu_id mmenu_id,
      menu_icon_name icon FROM menu_master where parent_id=0
      union all
      SELECT menu_id, menu menu_name,
      parent_id, menu_path path, menu_state component_name, report_path component_path,parent_id
      mmenu_id,menu_icon_name icon FROM menu_master where menu_id in
      (select menu_id  from menu_master where parent_id>0 ) ) g ORDER BY   menu_id
  ) g  join
  (select menu_id from user_grp_menu_master ugmm
  join user_group_map_master ugmm2 on ugmm.user_grp_id =ugmm2.user_grp_id
  where `;
  sqlQuery1 += ` ugmm2.user_id = ?`;
  params.push(userId);
  sqlQuery1 += ` and ugmm2.company_id =?`
  params.push(compId);
  sqlQuery1 += `  and ugmm.is_enable =1
  ) v on g.id=v.menu_id order by mmenu_id limit 3290`;
}
  
//      db.query(query, params, (err, result) => {
 
   db.query(sqlQuery1,params, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.get('/api/form', (req, res) => {
  const sqlQuery = 'SELECT union_3 as inputstructure FROM menu_searching_cols WHERE menu_id = ?';

  db.query(sqlQuery, [req.query.id], (err, results) => {
    if (err) {
      console.error('Error in /api/form:', err);
      return res.status(500).json({ error: 'Failed to fetch form data' });
    }

    try {
      let inputstructure = results[0].inputstructure;
      if (inputstructure.startsWith('data:')) {
        inputstructure = inputstructure.slice(5);  // Remove 'data:' prefix
      }
      const formData = JSON.parse(inputstructure); // Parse the corrected JSON
      res.json(formData);
    } catch (parseError) {
      console.error('Error parsing JSON in /api/form:', parseError);
      res.status(500).json({ error: 'Failed to parse form data' });
    }
  });
});

/*
app.get('/api/companies', (req, res) => {componentDidMount = () => {
  
}

  const { variable_name, company_id } = req.query;

  let sqlQuery;
  const queryParams = [];

  
    sqlQuery = 'SELECT comp_id, company_name FROM company_master ORDER BY company_name';
    queryParams.push(company_id);
   

  db.query(sqlQuery, queryParams, (err, results) => {
    if (err) {
      console.error('Error fetching combobox options:', err);
      return res.status(500).json({ error: 'Failed to fetch combobox options' });
    }
    res.json(results); // Send the fetched options as response
  });
});
*/

app.get('/api/companies',  (req, res) => {
  let userId = req.headers['x-user-id']; // Optionally extract user_id from headers
  if (userId >0) {
    console.log('User ID:', userId);
  } else  
    { userId = '2'; }

  //const query = 'SELECT comp_id, company_name FROM companies WHERE user_id = ?';
  //const query = 'SELECT comp_id, company_name FROM company_master ORDER BY company_name ';
  let query = '';
  if (userId === '2') {
    query = 'SELECT comp_id, company_name FROM company_master ORDER BY company_name';
  } else {  
  
   query = `SELECT comp_id, company_name 
                 FROM company_master cm 
                 JOIN user_group_map_master ugmm 
                 ON cm.comp_id = ugmm.company_id 
                 WHERE ugmm.user_id = ?`;
  }

  console.log('userId=:', userId);
  console.log('Query:', query);



  db.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error while fetching companies' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'No companies found for this user' });
    }

    return res.json(results);
  });
});





app.get('/api/combobox-department', (req, res) => {
  const { variable_name, company_id } = req.query;

  let sqlQuery;
  const queryParams = [];

  if (variable_name === 'vardepartment') {
    sqlQuery = 'SELECT dept_id, dept_desc FROM department_master WHERE company_id = ? ORDER BY dept_desc';
    queryParams.push(company_id);
  } else {
    return res.status(400).json({ error: 'Invalid variable_name' });
  }

  db.query(sqlQuery, queryParams, (err, results) => {
    if (err) {
      console.error('Error fetching combobox options:', err);
      return res.status(500).json({ error: 'Failed to fetch combobox options' });
    }
    res.json(results); // Send the fetched options as response
  });
});

app.get('/api/combobox-designation', (req, res) => {
  const { variable_name, company_id } = req.query;

  let sqlQuery;
  const queryParams = [];

  if (variable_name === 'vardesignation') {
    sqlQuery = 'SELECT id desg_id, desig FROM designation WHERE company_id = ? ORDER BY desig';
    queryParams.push(company_id);
  } else {
    return res.status(400).json({ error: 'Invalid variable_name' });
  }

  db.query(sqlQuery, queryParams, (err, results) => {
    if (err) {
      console.error('Error fetching combobox options:', err);
      return res.status(500).json({ error: 'Failed to fetch combobox options' });
    }
    res.json(results); // Send the fetched options as response
  });
});

app.get('/api/fetch-table-data', (req, res) => {
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

app.get('/api/doffsummary-data', (req, res) => {
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


app.get('/api/doffdetail-data', (req, res) => {
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
    vpddd.mechine_id, 
    vpddd.frameno,DATE_FORMAT(doffdate,'%d-%m-%Y') doffdatem,
    SUM(vpddd.no_of_doff) AS noofdoff,
    round(SUM(vpddd.prod),0) AS prod,
    ROUND(SUM(prod) / SUM(vpddd.prod100) * 100, 2) AS eff,
    ROUND(SUM(prod / prod100) * 100, 2) AS effa,
    SUM(prod100) AS prod100,round(sum(prod)/sum(no_of_doff),2) avgwt,
    round(sum(prod)/sum(mcwhrs)*8,2) avgprod,round(sum(no_of_doff)/sum(mcwhrs)*8,2) avgnoofdoff , `
    query += `  ? fromDate, `;
    params.push(formattedFromDate);
    query += `  ? toDate `;
    params.push(formattedToDate);
    query += ` FROM 
  EMPMILL12.view_proc_daily_doff_details vpddd 
WHERE `
  query += `  compid = ?`;
  params.push(company_id);
  query += ` and doffdate between ?`;
  params.push(formattedFromDate);
  query += ` and  ?`;
  params.push(formattedToDate);
  query += ` and mechine_id= ?`;
  params.push(varmechine_id);

  query += ` GROUP BY 
  mechine_id, frameno,doffdate 
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



app.listen(5000, () => {
  console.log('Server is running on port 5000');
});

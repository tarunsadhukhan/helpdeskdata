const express = require('express');
const router = express.Router();
const db = require('../Connection');

router.get('/', (req, res) => {
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

  
  router.get('/menu_items', (req, res) => {
    let userId = req.headers['x-user-id']; // Optionally extract user_id from headers
    let compId = req.headers['x-comp-id']; // Optionally extract user_id from headers
    const params = [];
    console.log('received body',req.query)
    if (req.headers='Undefined') {
      userId = req.query['x-user-id'];
     compId= req.query['x-comp-id'];
    }
    
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
    console.log('menu',sqlQuery1)
  //      db.query(query, params, (err, result) => {
   
     db.query(sqlQuery1,params, (err, results) => {
      if (err) throw err;
      res.json(results);
    });
  });


  router.get('/menuData', (req, res) => {
    let userId = req.headers['x-user-id']; // Optionally extract user_id from headers
    let compId = req.headers['x-comp-id']; // Optionally extract user_id from headers
    const params = [];
    console.log('received body',req.query)
    if (req.headers='Undefined') {
      userId = req.query['x-user-id'];
     compId= req.query['x-comp-id'];
    }
    
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
    console.log('menu',sqlQuery1)
  //      db.query(query, params, (err, result) => {
   
     db.query(sqlQuery1,params, (err, results) => {
      if (err) throw err;
      res.json(results);
    });
  });



  module.exports = router;
const fs = require('fs');


files = ['load_dept_names.txt', 'load_dept_emp.txt', 'load_salaries.txt', 'load_employee.txt']


// call parse (async) on each file to build theData, a 3d array
const theData = files.map(parse);


// called after data received and parsed out to arrays
function generateReport( data ) {

    let [dNames, dEmps, dSals, ...junk] = data

    // console.log(dNames[0])  // [ 'd001', 'Marketing' ]
    // console.log(dEmps[0])   // [ '10001', 'd005', '19860626', '99990101' ]
    // console.log(dSals[0])   // [ '10001', '60117', '19860626', '19870626' ]

    let report = dSals.filter(value => value[3] == 99990101)    // remove inactive employee ids
    report.forEach(record => record.splice(2, 2))               // trim unnecessary columns

    // add department id to the report table
    for (r of report) {
        let dept = getDeptID(r[0])
        if (dept) {
            r.push(dept)
        }
        // console.log(r)
    }

    // prepare another array to tabulate salary spend 
    let departments = [['d001', 0], ['d002', 0], ['d003', 0], ['d004', 0], ['d005', 0], ['d006', 0], ['d007', 0], ['d008', 0], ['d009', 0]]

    // tabulate salaries and add to respective department
    for (d of departments) {
        for (r of report) {
            if (d[0] === r[2]) {
                d[1] += parseInt(r[1], 10)
            }
        }
    }

    // finalize: replace dept_id with department name
    for (let i = 0; i < departments.length; i++) {
        departments[i][0] = dNames[i][1]
    }

    // moment we've all been waiting for
    for (d of departments) {
        console.log(d[0].padEnd(20) + d[1].toString().padStart(7))
    }

    function getDeptID(emp_id) {
        for (let i = 0; i < dEmps.length; i++) {
            if (dEmps[i][0] == emp_id) {
                return dEmps[i][1]
            }
        }
    }
}

// make sure all files parsed before we proceed with the report
Promise.all(theData)
.then(theData => {
    generateReport(theData)
})
.catch(reason => {
    // console.log(reason)
});


// parse wraps readFile with Promise
// after file is read, it is cleaned and turned into an array
// then pushed onto theData
function parse(filename) {
    return new Promise(
        function (resolve, reject) {
            fs.readFile(filename, 'utf8' ,
                (error, d) => {
                    if (error) {
                        console.log(error);
                        reject(error);
                    } else {
                        d = clean(d);
                        d = arrayify(d);
                        theData.push(d);
                        // console.log(theData)
                        resolve(d); 
                    }
                });
        });
}


// remove extra characters and blank lines, format for easy splitting to array
// clean format of each line is 'item, ... ,item;' last line unterminated
const clean = (d) => {
    d = d.replace(/INSERT.*UES \n?/g, "");  // remove sql
    d = d.replace(/[';\-/(\)]|\s*(?=$)|,\s*$/g, "");  //remove extra punctuation and blank lines
    d = d.replace(/,(?=\n)/g, ';')  // replace ending commas with ; (except for last item)
    // console.log(d);
    return d;
}


// turn clean data string into 2d array
const arrayify = (d) => {
    d = d.split(/;\n/)  // split each record to array on ';\n' 
    for (i = 0; i < d.length; i++) {
        d[i] = d[i].split(',')  // split actual inside record to array
    }
    // console.log(data)
    return d
}

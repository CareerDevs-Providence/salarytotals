const fs = require('fs');  

departmentNames = []

departmentEmployees = []

departmentSalaries = []

//------------------------------------------------------------------------------------

departments()

employees()

salaries()

displayCurrentTotals()

//console.log(departmentSalaries) 

//console.log(departmentEmployees[x])

function departments() {

    const data = fs.readFileSync('load_dept_names.txt','utf-8')

        fArray = data.replace(/'|\(|\)|;|/g, "")
        fArray = fArray.split('\n')

        for (let x =0; x < fArray.length; x++) {
            fArray[x] = fArray[x].replace(/,$/,'')
        }

        fArray.shift()


    for ( let i = 0; i < fArray.length; i++) {
    
        departmentNames[i] = fArray[i].split(',')

    }

    

}

function employees() {
    let data = fs.readFileSync('load_dept_emp.txt','utf-8')

    let pos = data.lastIndexOf('VALUES') + 7
    let length = data.length
    data = data.substr(pos, length)

    fArray = data.replace(/'|\(|\)|;|/g, "")

    fArray = fArray.split('\n')

    for (let x =0; x < fArray.length; x++) {
        fArray[x] = fArray[x].replace(/,$/,'')
    }

    for (let x =0; x < fArray.length; x++) {
        fArray[x] = fArray[x].split(',')
    }

    while (fArray[(fArray.length - 1)] == '') {
        fArray.pop()
    }

    for (let x = 0; x < departmentNames.length; x++) {
        departmentEmployees[x] = []
    }

    for (let x = 0; x < fArray.length; x++ ) {
        let dep = (parseInt(fArray[x][1].slice(-1)) - 1)
        departmentEmployees[dep].push(fArray[x])
  
    }
    

}

function salaries() {

    let data = fs.readFileSync('load_salaries.txt','utf-8')

    let pos = data.lastIndexOf('VALUES') + 7
    let length = data.length
    data = data.substr(pos, length)

    fArray = data.replace(/'|\(|\)|;|/g, "")

    fArray = fArray.split('\n')

    for (let x =0; x < fArray.length; x++) {
        fArray[x] = fArray[x].replace(/,$/,'')
    }

    for (let x =0; x < fArray.length; x++) {
        fArray[x] = fArray[x].split(',')
    }

    while (fArray[(fArray.length - 1)] == '') {
        fArray.pop()
    }

    for (let x = 0; x < departmentNames.length; x++) {
        departmentSalaries[x] = []
    }

    for (let x =0; x < fArray.length; x++) {                  
        for (let i = 0; i < departmentNames.length; i++) {
            for (let j = 0; j < departmentEmployees[i].length; j++) {
                if (fArray[x][0] == departmentEmployees[i][j][0]) {
                    departmentSalaries[i].push(fArray[x])
                }
            }
        }
        
    }

}

function displayCurrentTotals() {
    console.log("CURRENT TOTALS:")
    var total = 0

    for (let x = 0; x < departmentSalaries.length; x++) {
        for (let y = 0; y < departmentSalaries[x].length; y++) {
            if (departmentSalaries[x][y][3] == '9999-01-01') {

                total += parseInt(departmentSalaries[x][y][1])

            }
        }

        
    console.log(departmentNames[x][1] + " " + total) 
    total = 0  

    }

}


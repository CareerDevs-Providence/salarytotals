const fs = require('fs');  

departmentNames = []

departmentEmployees = []

departmentSalaries = []

personalInfo =[]

var arg = process.argv.slice(2) //look at switch for possible arguments

//------------------------------------------------------------------------------------

loadDepartments() //load* takes SQL into our arrays 

loadEmployees()

loadSalaries()

loadPersonalInfo()

switch(arg[0]) {  //takes arguments so usage can be like 'node salarytotals.js department 5' or 'node salarytotals.js employee 10001'

    case 'totals':

        displayCurrentTotals()
        break

    case 'department':

        let department = arg[1] - 1

        let current = arg[2]

        if (current == 'current') { 

            console.log(departmentNames[department][1])

            console.log(currentEmployees(department))

        } 
            else {

            console.log(departmentNames[department][1])

            console.log(departmentEmployees[department])
        }
        break
        

    case 'employee':

        let employeeID = arg[1]

        console.log(employeeLookup(employeeID))

        console.log("SALARY HISTORY")

        console.log(salaryTracker(employeeID))

        break

    default:

	    displayCurrentTotals()
    
        break



//console.log(departmentSalaries) 



}

function loadDepartments() {

    const data = fs.readFileSync('load_dept_names.txt','utf-8')

        let fArray = data.replace(/'|\(|\)|;|/g, "")
        fArray = fArray.split('\n')

        for (let x =0; x < fArray.length; x++) {
            fArray[x] = fArray[x].replace(/,$/,'')
        }

        fArray.shift()


    for ( let i = 0; i < fArray.length; i++) {
    
        departmentNames[i] = fArray[i].split(',')

    }

    

}

function loadEmployees() {
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

function loadSalaries() {

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

    currentEmps = currentEmployees('all')

    for (let x =0; x < fArray.length; x++) {                  
        for (let i = 0; i < departmentNames.length; i++) {
            for (let j = 0; j < currentEmps[i].length; j++) {
                if (fArray[x][0] == currentEmps[i][j][0]) {
                    departmentSalaries[i].push(fArray[x])
                }
            }
        }
        
    }

}

function displayCurrentTotals() {
    console.log("\nCURRENT DEPARTMENT SALARY TOTALS:\n")
    var total = 0
    var grand_total = 0

    for (let x = 0; x < departmentSalaries.length; x++) {
        for (let y = 0; y < departmentSalaries[x].length; y++) {
            if (departmentSalaries[x][y][3] == '9999-01-01') {
                total += parseInt(departmentSalaries[x][y][1])

            }
        }

    grand_total += total    
    console.log("\t" + departmentNames[x][1] + " " + total) 
    total = 0  

    }
    console.log("\nGRAND TOTAL: " + grand_total + "\n" )

}

function loadPersonalInfo() {

    let datab = fs.readFileSync('load_employee.txt','utf-8')

    let pos = datab.lastIndexOf('VALUES') + 7
    let length = datab.length
    datab = datab.substr(pos, length)

    datab = datab.replace(/'|\(|\)|;|/g, "")

    let gArray = datab.split('\n') //array of all employees personal info
    

    for (let x =0; x < gArray.length; x ++) {
        gArray[x] = gArray[x].replace(/,$/,'')
        gArray[x] = gArray[x].split(',')
        personalInfo.push(gArray[x])
    }


}

function employeeLookup(employeeID) {

    

    for (let x = 0; x < personalInfo.length; x++) {
        if (employeeID == personalInfo[x][0]) {
            return personalInfo[x]
        }
    } 

}

function salaryTracker(employeeID) {

    var salaryHistory = []

    for (let x = 0; x < departmentSalaries.length; x++) {
        for (let y = 0; y < departmentSalaries[x].length; y++) {
            if (employeeID == departmentSalaries[x][y][0]) {
                salaryHistory.push(departmentSalaries[x][y])          
            }
        }
    }

    return salaryHistory
}

function currentEmployees(dep) {

    var currentEmps = []

    for (let x = 0; x < departmentEmployees.length; x++) {
        currentEmps[x] = []
    }
    
    regEx = /9999/

        for (let x = 0; x < departmentEmployees.length; x++ ) {
            for (let y = 0; y < departmentEmployees[x].length; y++) {
                if (regEx.test(departmentEmployees[x][y][3])) {
                    currentEmps[x].push(departmentEmployees[x][y])
                }
            }
        }
    
    if (dep == 'all') { return currentEmps}

    return currentEmps[dep]
}

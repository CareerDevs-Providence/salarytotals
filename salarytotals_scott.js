

function parseArray(data){
    // console.log(data);

    // console.log(data.replace(/'|\(|\)/g, ""));

    let FileArray = data.replace(/'|\)\,|\(|\)|\;/g, "");

    let fArray = FileArray.split("\n");
    //console.log(fArray);

    let values=fArray[0].indexOf("VALUES");
    // console.log(values) ;

    if (values>=0){
        fArray[0]=fArray[0].substr(values+7)
    }
    
    for (let i=fArray.length-1;i>=0;i--){
        if (fArray[i]==''){
            fArray.pop();
        } else break;
    }

    for (let i=0;i<fArray.length;i++){
        fArray[i]=fArray[i].split(",");
        if (fArray[i][fArray[i].length-1]==""){
            fArray[i].pop();
        }
    }
    //console.log(fArray);
    return fArray;
}

function doesOverlap(a, b, x, y){
    if (isEarlier(a,y) && isLater(b,x)){return true}
    else return false;
}

function isEarlier(a,b){
    x = parseDate(a);
    y = parseDate(b);
    //console.log(x,y)
    return x<=y;

}

function isLater(a,b){
    x = parseDate(a);
    y = parseDate(b);
    return x>=y;
}

function earliest(a,b){
    return isEarlier(a,b) ? a : b;
}

function latest(a,b){
    return isLater(a,b) ? a : b;
}

function parseDate(a){
    let temp=a.split("-");
    //return [parseInt(temp[0]), parseInt(temp[1]), parseInt(temp[2])];
    return parseInt(temp[0].concat(temp[1],temp[2]));
}

const fs = require('fs'); 

let departmentNames, departmentEmployeesRaw, departmentSalariesRaw;

departmentNames=fs.readFileSync('load_dept_names.txt', 'utf8');
departmentEmployeesRaw=fs.readFileSync('load_dept_emp.txt', 'utf8');
departmentSalariesRaw=fs.readFileSync('load_salaries.txt', 'utf8');

//console.log(departmentEmployeesRaw);

departmentNames=parseArray(departmentNames);
departmentNames.shift();
departmentEmployeesRaw=parseArray(departmentEmployeesRaw);
departmentSalariesRaw=parseArray(departmentSalariesRaw);

//console.log(departmentNames);
//console.log(departmentEmployeesRaw);
//console.log(departmentSalariesRaw);

// const departmentNames = [ ["d001", "Marketing"], ["d002", "Finance"],  ];

// const departmentEmployees = [ [ ["10017", '1993-08-03', '9999-01-01'], ["10099", '1994-04-04', '9999-01-01'] ], [ ["10080", '1993-08-03', '9999-01-01'] ]  ];
let departmentEmployees=[];
for (let d=0; d<departmentNames.length; d++){
    departmentEmployees[d]=[];
}
for (let i=0; i<departmentEmployeesRaw.length; i++){
    for (let d=0; d<departmentNames.length; d++){
        if (departmentEmployeesRaw[i][1]==departmentNames[d][0]){
            departmentEmployees[d].push(departmentEmployeesRaw[i].slice(0,1).concat(departmentEmployeesRaw[i].slice(2)))
        }
        //console.log(departmentEmployees[d]);
    }
}
//console.log(departmentEmployees);
// const departmentSalaries = [ [ ['10017','99651','2002-08-01','9999-01-01'], ['10099','109651','2004-04-04','9999-01-01'] ],[ ['10080','80651','2002-08-08','9999-01-01'] ] ];
let departmentSalaries=[];
for (let d=0; d<departmentNames.length; d++){
    departmentSalaries[d]=[];
}
for (let i=0; i<departmentSalariesRaw.length; i++){
    for (let e=0; e<departmentEmployees.length; e++){
        for (let f=0; f<departmentEmployees[e].length;f++){
            if (departmentSalariesRaw[i][0]==departmentEmployees[e][f][0]){
                let e1=departmentEmployees[e][f][1];
                let e2=departmentEmployees[e][f][2];
                let s1=departmentSalariesRaw[i][2];
                let s2=departmentSalariesRaw[i][3];
                //console.log(departmentEmployees[e][f][0], e1, e2, s1, s2)
                if (doesOverlap(e1,e2,s1,s2)){
                    //console.log("Overlap");
                    departmentSalaries[e].push([departmentSalariesRaw[i][0], departmentSalariesRaw[i][1], latest(e1,s1), earliest(e2,s2)])
                }
                //departmentSalaries[e].push(departmentSalariesRaw[i])
            }
        }
        
    }
}

//console.log(departmentSalaries);
let totaltotal=0;

for (let i = 0; i < departmentNames.length;i++){
    let total=0;
    for (let j=0;j<departmentSalaries[i].length;j++){
        if (departmentSalaries[i][j][3]=='9999-01-01'){
            total+=parseInt(departmentSalaries[i][j][1]);
            //if(i==3|i==4||i==5){console.log(departmentSalaries[i][j])}
        }
    }
    console.log(departmentNames[i][1],total);
    totaltotal+=total;
}
console.log("Total: ",totaltotal);
// console.log(departmentNames[0][0], departmentNames[0][1], departmentSalaries[0][1]);

// console.log(departmentNames.length);
// console.log(departmentEmployees.length);
// console.log(departmentSalaries.length);

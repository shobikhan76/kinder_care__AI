//print 

const table = (num) =>{
       
      for (let i=1 ; i<=10 ; i++){
        const result = num * i ; 
        console.log(`${num} x ${i} = ${result}`) ;
      }
}
const sum = () => {
   let total = 0 ; 
   for (let i=1 ;  i<=10 ; i++){ 
        total += i ;
    console.log(total);
    }
}

const fac = (n) => {
    let a = 1; 
    for (let i=1 ; i<=n ; i++){
        a = a * i ;
        console.log(a);
    }
}
const calOdd = () =>{
      let sum = 0 ; 
    for (var i=11 ; i<=30 ; i+=2)
    {
        sum += i ; 
        console.log(`the sum of num is ${sum}`); 
    }
}
const tempC = (c) =>{
   let F = (c * 9/5 ) + 32 
   console.log(F)
} 

const arrSum = (arr) =>{
    let sum = 0 ; 
   for (let i=0 ; i<arr.length ; i++ ){
        sum += arr[i] ; 
        console.log(sum); 
   }
}

const calAvg = (arr) =>{
       var sum = 0 ; 
       var result ; 
    var  n = arr.length
for ( var i = 0 ; i <= n; i++){
       sum += arr[i] 
       
       }
       
       result = sum/n
       console.log(result)
       
}

const positiveArr= (arr) =>{
    let n = arr.length  ;
    let arr2 = []

   arr.filter((a) =>{
if (a >= 0){
    arr2.push(a)
}
   })
    console.log(arr2)
}


const maxN = (arr) =>{
    let max = arr[0]
    for (let i = 0 ; i <= arr.length ; i++ ) {
   if (arr[i]>max) {
    max = arr[i]
   }
    }
    console.log(max)
}


const fabN = (n) => {
     
let a = 0 ; 
let b = 1 ; 
    for (let i=2 ; i<n ; i++ ) {
 var c = b+ a ; 
    a = b ; 
    b = c ; 
    
    }
    console.log(c)
}
const primeN = (n) =>{
    if (n <= 1) {
        return false ; 
    }
    for (let i = 2 ; i < n ; i++ ){
        if (n % i === 0 ) {
            return false ; 
        }
        return true ;
    }
    }

// table(5) ;
// sum();
// fac(); 
// calOdd()
// tempC(37) ;
// arrSum([2,3,4,5]) ;
// calAvg ([1,3,9,15,90])
// positiveArr([2 , 0 , -3 , 8 , -5 , 9 , -2])
// maxN([3 , -2 , 9 , 7 , 0 ])
// fabN(6) ;


console.log(primeN(10)) ;
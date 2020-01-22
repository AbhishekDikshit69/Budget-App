// Budget Controller 
let budgetController=(function(){
 var Expense = function(id,description,value){
    this.id=id;
    this.description=description;
    this.value=value;
    this.percentage=-1;
 }
 Expense.prototype.calcpercentage=function (totalIncome){
    //  console.log(this.value + " "+ this.percentage);
     if(totalIncome>0){
         this.percentage=Math.round((this.value/totalIncome)*100); 
        //  console.log(this.percentage);
     }
     
     else 
        this.percentage=-1;
 }
 Expense.prototype.getpercentage=function(){
        return this.percentage;
    }
 
 var Income = function(id,description,value){
    this.id=id;
    this.description=description;
    this.value=value; 
 }
 var data={
     allItems:{
         exp:[],
         inc:[]
     },
     totals:{
         inc:0,
         exp:0,
     },
     budget :0,
     percentage:-1

 }
 let calculatetotals=(type)=>{
     sum=0;
     data.allItems[type].forEach((cur,index,arr)=>{
        sum+=cur.value;
     });
     data.totals[type]=sum;
     return sum;
 }
   
 return {
     addItem:(type,description,value)=>{
        var ID,newItem; 
        //Creation of unique ID for Income and Expense where whenever we add an item we creating itss id by incrementing the id of previous item 
        if(data.allItems[type].length==0)
            ID=0;
            else  ID=data.allItems[type][data.allItems[type].length -1].id +1 ;
         if(type==='inc')
             newItem=new Income(ID,description,value);
        else if (type=== 'exp')
            newItem=new Expense(ID,description,value);

            data.allItems[type].push(newItem);
            return newItem;
     },
     testing:function(){
         console.log(data);
     },
     calculateBudget:()=>{
        let totalinc=calculatetotals('inc'),totalexp=calculatetotals('exp');
        data.budget=totalinc-totalexp;
        if(totalinc>0)
            data.percentage=Math.round((totalexp/totalinc)*100);
        else 
            data.percentage=-1;
 
        return {
            totalinc:totalinc,
            totalexp:totalexp,
            budget:data.budget,
            percentage:data.percentage
        }},
        deleteItem:(type,id)=>{
            var ids=data.allItems[type].map((cur)=>{
                return cur.id;
            });
            let index=ids.indexOf(id);
            if(index !==-1){
                data.allItems[type].splice(index,1);
            }},
        calculatePercentages:()=>{
            let info= data.allItems.exp;
            info.forEach((cur)=>{
                cur.calcpercentage(data.totals.inc);
                console.log(cur);
                
            })
        },
        getPercentage:()=>{
            let allpercentages=data.allItems.exp.map((cur)=>{
                return cur.getpercentage();
            });
            return allpercentages ;
        }
     
    }
})();

// UI Controller

let uiController=(function (){
    var DOMstrings={
        inputtype:'.add__type',
        inputdescription :'.add__description',
        inputvalue: '.add__value',
        inputButton :'.add__btn',
        incomelist:'.income__list',
        expenselist:'.expenses__list',
        budgetincome :'.budget__income--value',
        budgetexpense:'.budget__expenses--value',
        budget:'.budget__value',
        budgetpercentage:'.budget__expenses--percentage',
        container:'.container',
        expPercLabel:'.item__percentage'
    }; 
    
    return{
        getInput:()=>{
            return {
                type:document.querySelector(DOMstrings.inputtype).value ,// will be either inc or exp
                description : document.querySelector(DOMstrings.inputdescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputvalue).value)
            }
            
        },
        getDOMstring : ()=>{
            return DOMstrings;
        },
        addItem:(input,type)=>{
            let html,htmlnew;
            if(type==='inc'){
                element=DOMstrings.incomelist;
                html='<div class="item clearfix" id="inc- %id% "><div class="item__description"> %description% </div><div class="right clearfix"><div class="item__value">+%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

            }
            else if(type==='exp'){
                element=DOMstrings.expenselist;
                html='<div class="item clearfix" id= "exp-%id%" ><div class="item__description"> %description% </div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

            }
        htmlnew=html.replace('%id%',input.id);
        htmlnew=htmlnew.replace('%description%',input.description);
        htmlnew=htmlnew.replace('%value%',input.value);
        document.querySelector(element).insertAdjacentHTML('beforeend',htmlnew);
        },
        removeItem:(id)=>{
           let el= document.getElementById(id) ;
           el.parentNode.removeChild(el);
        },
        clearfeilds:()=>{
            var feilds=Array.from(document.querySelectorAll(DOMstrings.inputdescription + ','+ DOMstrings.inputvalue));
            feilds.forEach((currentElement,currentIndex,Arraypointer)=>{
                currentElement.value='';
            });
            feilds[0].focus();
        },
        displayBudget:(obj)=>{
            document.querySelector(DOMstrings.budget).textContent=obj.budget;
            document.querySelector(DOMstrings.budgetincome).textContent=obj.totalinc;
            document.querySelector(DOMstrings.budgetexpense).textContent=obj.totalexp;
            if(obj.totalexp<obj.totalinc)
                document.querySelector(DOMstrings.budgetpercentage).textContent=obj.percentage;
            else 
            document.querySelector(DOMstrings.budgetpercentage).textContent='---';
        },
        displaypercentages:function(percarray){
            console.log(percarray);
            var nodelist=document.querySelectorAll(DOMstrings.expPercLabel);
           function  nodelistForEach(list,callback){
                for(let i=0;i<list.length ;i++){
                    callback(list[i],i);
                }
                
            }
            nodelistForEach(nodelist,function(current,index){
                if(percarray[index]>0)
                    current.textContent= percarray[index] + '%';
                else 
                    current.textContent='---';
            });
    
        }
    }
 
})();

//App Controller

let appcontroller=(function(bdgtctrl,uictrl){


    function setupEventListeners(){
        document.querySelector(uictrl.getDOMstring().inputButton).addEventListener('click',inputctrl);

    document.addEventListener('keypress',(event)=>{
        if(event.key=="Enter")
            inputctrl();
            
    });
    document.querySelector(uictrl.getDOMstring().container).addEventListener('click',ctrlDeleteItem);
    }

    function inputctrl(){
        ctrlAddItem();
    }
    
    var ctrlAddItem=function(){
        var input,newinput;
        //Getting the input
        input=uictrl.getInput();
        if(input.description !== '' && input.value>0 && !isNaN(input.value) ){
            newinput =bdgtctrl.addItem(input.type,input.description,input.value);
    //    / bdgtctrl.testing();
        uictrl.addItem(newinput,input.type);
        uictrl.clearfeilds();
        updateBudget();
        updatePercentage();
        }
        //Sending the info to update the budget DS
        
    }

    var updateBudget=()=>{
    // 1. Update the budget
        var budget=bdgtctrl.calculateBudget();
        uictrl.displayBudget(budget);
        
    }
  
    var ctrlDeleteItem=()=>{
        let targetrow=event.target.parentNode.parentNode.parentNode.parentNode;
        let targetrowid=targetrow.id;
        let rowid=parseInt(targetrowid.substr(targetrowid.length-2,targetrowid.length));
        let type=targetrowid.substr(0,3);
        bdgtctrl.deleteItem(type,rowid);
        uictrl.removeItem(targetrowid);
        updateBudget();
        updatePercentage();

    }
    var updatePercentage=()=>{

        // Calculating the percentages 
        bdgtctrl.calculatePercentages();
        // Retrieving the percentages
        var percentages= bdgtctrl.getPercentage();
        console.log(percentages);
        // display the percentage
        uictrl.displaypercentages(percentages);

    }
    
    return {
        init : ()=>{
                console.log("Application has started");
                uictrl.displayBudget({
                    totalinc:0,
                    totalexp:0,
                    budget:0,
                    percentage:-1});
                setupEventListeners();
            
        
        }
    }
    

      /*  Get the input Data
        add to the budget
        display in user interface
        update the budget 
        display the budget
      */
}

)(budgetController,uiController);

appcontroller.init();
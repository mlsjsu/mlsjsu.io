
function disableIfMarketClosed() {
     const today = new Date(Date.now());
    if (isWeekend(today)) {

        let buttons = document.getElementsByClassName('investmentButton')
        for(let b of buttons) {
            b.hidden = true;
        }
    }
}

function saveTicker(name, symbol, date, price, diff, percentDiff, diffSign){
    console.log('saveTicker')
      const ticker = {
            'name': `${ name }`,
            'symbol': `${  symbol }`,
            'date': `${ date }`,
            'price': `${ price }`,
            'diff': `${ diff }`,
            'percentDiff': `${ percentDiff }`,
            'diffSign': `${ diffSign }`
        };

        const json = JSON.stringify(ticker);
        localStorage.setItem(symbol, json);
}

function saveStrategy(name, amount, date){
      const strategy = {
            'name': `${ name }`,
            'amount': `${amount}`,
            'date': `${ date}`,
        };

        const json = JSON.stringify(strategy);
        localStorage.setItem(strategy.name, json);
}

function getStrategy(name) {
    let strategy = localStorage.getItem(name);
    return JSON.parse(strategy);
}

function getStrategySplit(name) {
    let strat = getStrategy(name)
    let amount = Number(strat.amount / 3).toFixed(3)
    return amount

}

function getShareCount(initialPrice, strategy) {
    let split  = getStrategySplit(strategy)
    return Number(getStrategySplit(strategy) / initialPrice).toFixed(3)
}



function renderChart(chartType, id, labels, rows, symbols) {
    var ctx = document.getElementById(id).getContext('2d');
    const colors = ['rgb(75, 192, 192)','rgb(149 ,75,192)','rgb(192,132,75)']
    const chartConfig = {
        type: chartType,
        data: {
            labels: labels,
        }
    }
    let dataSets = [];
    for (let i = 0; i < 3; i++) {
        dataSets.push({
            label: symbols[i],
            data: rows[i],
            borderColor: colors[i],
            tension: 0
        });
    }
    chartConfig.data['datasets'] = dataSets;
     return new Chart(ctx,chartConfig);
}


function navToStrategy(strategy, amount) {
    let start = todayFormatted();
    // todo remove this line
    start = new Date('2021-5-09').toISOString().split('T')[0];
    const url = `/${strategy}/${start}`
    const save = getStrategy(strategy);
    if (!save) {
        saveStrategy(strategy, amount, start)
        this.window.open(`/${strategy}/2021-5-09`, '_top')
    } else {
       if (confirm('This action will close your previous position. Proceed?')) {

            saveStrategy(strategy, amount, start)
           this.window.open(`/${strategy}/2021-5-09`, '_top')
        } else {

        }
    }

   // this.window.close()
}

function todayFormatted() {
    let today = new Date().toISOString();
    return today.toString().split('T')[0];
}


function isWeekend(date) {
   return date.getDay() % 6 === 0;
}

function renderTickerHistory() {
    // Get the recent ticker info from localstorage
    const recents = { ... localStorage}
    if (recents['value']) delete recents['value']
    if(recents['growth']) delete recents['growth']
    // Get the existing div to hold the new HTML elements
    let recentsDiv = document.getElementById('recentTickers');
    // Create a new div element to hold the list of tickers
    let newDiv = document.createElement('div');
    // Append a list group to newDiv
    newDiv.innerHTMl=`<ul class="list-group">`;
    // Iterate through the recent items from local storage
    // This will also get every localStorage object as a json object
    // and push it onto the jsonArray
    let jsonArray = Object.keys(recents).map((key)=> {
            // parse the current item as an Object
            let obj = JSON.parse(recents[key]);
            // Set the badge color (red for "-" negative change, green for "+" change)
            let badgeColor = 'danger';
            if (obj.diffSign === "+") {
                badgeColor = 'success';
            }
            // Create the new list item and append to newDiv's innerHTML
            newDiv.innerHTML += `
            <li class="list-group-item">
                 <h5 class="card-title mb-2">
                    <span class="badge bg-primary">${obj.symbol}</span>
                    <a href="/${obj.symbol}">${obj.name}</a>
                  </h5>
            </li>`;


        // Append the current localStorage object to jsonArray
        return JSON.parse(recents[key])
    })
    // Close the </ul> tag
    newDiv.innerHTML+=`</ul>`
    // Set the recentDiv innerHTML
    recentsDiv.innerHTML+=newDiv.innerHTML
}

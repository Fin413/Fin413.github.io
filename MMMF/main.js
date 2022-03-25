var slides = document.getElementsByClassName("slide");

function next(index){
    slides[index - 1].style.opacity = 0;
    
    setTimeout(() => {
        slides[index - 1].style.display = "none";
        slides[index].style.display = "flex"; 
        setTimeout(() => {
            slides[index].style.opacity = 1;
        }, 100);
    }, 500);
}


/*

    So basically normal (simple) intrest is where you get payed a fixed percent of
    intrest annually (per year) ONLY on the amount of money you gave the bank

    compound intrest means that they pay intrest similar to simple but every time you 
    earn money from intrest it gets added to the total

    start early more money

*/

function calculateCompound(principal){
    var intrestRate = 0.05; // 5% yearly
    var numTimesCompoundedPerYear = 12; // 12 months in a year so its compounded monthly
    var numYears = 10;

    value = principal * Math.pow((1 + (intrestRate / numTimesCompoundedPerYear)), (numYears * numTimesCompoundedPerYear));
    var gained = value - principal;

    document.getElementById("compoundIntrest").innerText = value.toFixed(2);
    createCompoundChart();

   
}

const chartAreaBorder = {
    id: 'chartAreaBorder',
    beforeDraw(chart, args, options) {
      const {ctx, chartArea: {left, top, width, height}} = chart;
      ctx.save();
      ctx.strokeStyle = options.borderColor;
      ctx.lineWidth = options.borderWidth;
      ctx.setLineDash(options.borderDash || []);
      ctx.lineDashOffset = options.borderDashOffset;
      ctx.strokeRect(left, top, width, height);
      ctx.restore();
    }
  };
function createCompoundChart(){
    var xValues = [];
    var yValues = [];
    var yValuesTwo = [];

    for(let i = 0; i < 20; i++){
        xValues.push(i);
        yValues.push((5000 * Math.pow((1 + (0.05 / 12)), (i * 12))).toFixed(2));
        yValuesTwo.push((5000 + (5000 * i * 0.05)).toFixed(2));
    }

    new Chart("chart", {
        type: "line",
        data: {
            labels: xValues,
            datasets: [
                {
                    label: "Simple Interest",
                    backgroundColor: "rgba(255, 0, 0, 0.5)",
                    borderColor: "rgba(255, 0, 0, 1.0)",
                    
                    data: yValuesTwo,
                },
                {
                    label: "Compound Interest",
                    backgroundColor: "rgba(0,0,0,0.5)",
                    borderColor: "rgba(0,0,0,1.0)",
                    data: yValues,
                },
                
            ]
        },
        options: {
            elements: {
                point:{
                    radius: 0
                }
            },
            tooltips: {
                enabled: false
            },
            scales: {
                xAxes: [{
                    gridLines: {
                        drawTicks: true,
                        color: "rgba(0,0,0,1)",
                        drawOnChartArea: false,
                    },
                    ticks: {
                        padding: 5,
                        length: 2
                    }
                }],
                yAxes: [{
                    position: 'right',
                    
                    gridLines: {
                        drawTicks: true,
                        color: "rgba(0,0,0,1)",
                        drawOnChartArea: false,
                    },
                    ticks: {
                        padding: 5,
                        textStrokeColor: "rgba(0,0,0,1)",
                        callback: function(xValues) {
                          return "$" + xValues;
                        }
                    }
                    
                }]
            },
            plugins: {
                chartAreaBorder: {
                  borderColor: 'black',
                  borderWidth: 2,
                }
              }
        },
        plugins: [chartAreaBorder],
    });
}

function calculateSimple(principal){
    var intrestRate = 0.05;
    var years = 10;
   
    var value = principal + (principal * years * intrestRate);
    var gained = value - principal;


    document.getElementById("compoundIntrest").innerText = "" + value.toFixed(2);
    createSimpleChart();
}

function createSimpleChart(){
    var xValues = [];
    var yValues = [];

    for(let i = 0; i < 20; i++){
        xValues.push(i);
        yValues.push((5000 + (5000 * i * 0.05)).toFixed(2));
    }

    new Chart("simpleChart", {
        type: "line",
        data: {
          labels: xValues,
          datasets: [{
            backgroundColor: "rgba(0,0,0,1.0)",
            borderColor: "rgba(0,0,0,0.1)",
            data: yValues
          }]
        },
        options:{}
    });
}


var mu_slider = document.getElementById("mu_slider");
var mu_output = document.getElementById("mu_value");
mu_output.innerHTML = mu_slider.value; // Display the default slider value

var sigma_slider = document.getElementById("sigma_slider");
var sigma_output = document.getElementById("sigma_value");
sigma_output.innerHTML = sigma_slider.value; // Display the default slider value

var dt_select = document.getElementById("dt");
var dt_output = document.getElementById("dt_value");
dt_output.innerHTML = dt_select.value; // Display the default slider value

var K_slider = document.getElementById("K_slider");
var K_output = document.getElementById("K_value");
var lnK = document.getElementById("lnK_value");
K_output.innerHTML = K_slider.value; // Display the default slider value
lnK.innerHTML = Math.log(K_slider.value).toFixed(4);

var S0_slider = document.getElementById("S0_slider");
var S0_output = document.getElementById("S0_value");
var lnS0 = document.getElementById("lnS0_value");
S0_output.innerHTML = S0_slider.value; // Display the default slider value
lnS0.innerHTML = Math.log(S0_slider.value).toFixed(4);

var paths_slider = document.getElementById("paths_slider");
var paths_output = document.getElementById("paths_value");
paths_output.innerHTML = paths_slider.value; // Display the default slider value

var t1_slider = document.getElementById("t1_slider");
var t1_output = document.getElementById("t1_value");
t1_output.innerHTML = t1_slider.value; // Display the default slider value

var t2_slider = document.getElementById("t2_slider");
var t2_output = document.getElementById("t2_value");
t2_output.innerHTML = t2_slider.value; // Display the default slider value

var N_select = document.getElementById("simulation");
var N_output = document.getElementById("N_value");
N_output.innerHTML = N_select.value; // Display the default slider value

function openNav() {
  document.getElementById("menu").style.width = "25%";
}

function closeNav() {
  document.getElementById("menu").style.width = "0";
}

function bm() {
  var mu = parseFloat(document.getElementById('mu_slider').value);
  var sigma = parseFloat(document.getElementById('sigma_slider').value);
  var S0 = parseFloat(document.getElementById('S0_slider').value);
  var dt = parseFloat(document.getElementById('dt').value);
  var N = parseFloat(document.getElementById('simulation').value);
  var steps = 1/dt;
  var lnS = Math.log(S0);
  var sqrtt = Math.sqrt(dt);

  var bmm = Array2DVar(N, steps+1);
	for (var i = 0; i < N; i++){
    bmm[i][0] = lnS;
    for (var j = 1; j < steps+1; j++){
        bmm[i][j] = bmm[i][j-1] + mu * dt + sigma * sqrtt * random_nm();
    }
  }
  
  return bmm;
}

function update_bmPlot(bmm) {
  var paths = parseFloat(document.getElementById('paths_slider').value);
  var dt = parseFloat(document.getElementById('dt').value);
  var t1 = parseFloat(document.getElementById('t1_slider').value);
  var t2 = parseFloat(document.getElementById('t2_slider').value);

  var bb = document.querySelector ('#bmPlot').getBoundingClientRect();
  var width = (bb.right - bb.left) - 20;

  var data1 = [];

  var xdata = [];
  for (var i = 0; i < paths; i++){
      xdata.push(range(0, dt, 1));
  }

  var ydata = bmm.slice(0, paths);

  for(var i = 0; i < xdata.length; i++){
      var  result= {
          x: xdata[i],
          y: ydata[i],
          type: 'scatter',
          mode: 'lines',
          line: {
              dash: 'Solid',
              width: 1
          }
      };
      data1.push(result);
  }

  var layout1 = {
    title: {
      font: {size: 12},
      text: '<b>Brownian Motion with Drift</b>'
    },
    annotations: [{
      xref: 'paper',
      yref: 'paper',
      x: 0,
      xanchor: 'right',
      y: 1,
      yanchor: 'bottom',
      text: '<b>ln(S)</b>',
      font: {size: 10},
      showarrow: false
    }],
    xaxis: {
      title: {
        text: '<b>Time</b>',
        font: {size: 10}
      },
      tickfont: {size: 10}
    },
    yaxis: {
      tickfont: {size: 10}
    },
    showlegend: false,
    shapes: [
      { 
          type: 'line', 
          yref: 'paper',
          x0: t1,
          y0: 0, 
          x1: t1, 
          y1: 1, 
          line: { 
              color: '#2f89a0', 
              width: 2, 
              dash: 'dash' 
          }
      },
      {
          type: 'line', 
          yref: 'paper',
          x0: t2,
          y0: 0, 
          x1: t2, 
          y1: 1, 
          line: { 
              color: '#eca62c', 
              width: 2, 
              dash: 'dash' 
          }
      }],
    width: width,
    height: width * 0.72,
    margin: {
      l: 30,
      r: 10,
      b: 25,
      t: 25,
    },
    paper_bgcolor: "#ffffff",
    plot_bgcolor:"#ffffff",
    hovermode: 'closest'
  };

  var config = {
    modeBarButtonsToRemove: ['zoom2d','select2d','pan2d','lasso2d','resetScale2d','zoomOut2d','zoomIn2d','toggleSpikelines'],
    modeBarButtonsToAdd: [{
      name: 'info',
      icon: Plotly.Icons.question,
      click: ()=>{
        $('#exampleModalCenter1').modal('show');
      }}]
  };

  Plotly.newPlot('bmPlot', data1, layout1, config);
}

function update_bmdPlot(bmm) {
  var mu = parseFloat(document.getElementById('mu_slider').value);
  var sigma = parseFloat(document.getElementById('sigma_slider').value);
  var dt = parseFloat(document.getElementById('dt').value);
  var N = parseFloat(document.getElementById('simulation').value);
  var steps = 1/dt;

  var bb1 = document.querySelector ('#bmPlot').getBoundingClientRect();
  var width1 = (bb1.right - bb1.left) - 20;
  var bb2 = document.querySelector ('#bmdPlot').getBoundingClientRect();
  var width2 = (bb2.right - bb2.left) - 20;

  var yy = [];
  for (var i = 0; i < N; i++){
      yy.push(bmm[i][steps]);
  }

  var data2 = [{
      y: yy,
      type: 'histogram',
      histnorm: 'probability',
      marker: {
          color: '#628ea5',
      },
      autobiny: false,
      ybins:{
        start: Math.min(yy),
        size: Math.abs(mu) / 1.5 * dt + Math.pow(sigma, 0.99) * Math.pow(dt, 0.25)
      }
  }];

  var layout2 = {
      title: {
        font: {size: 10},
        text: '<b>Brownian Motion Dist.</b>'
      },
      annotations: [{
        xref: 'paper',
        yref: 'paper',
        x: 0,
        xanchor: 'right',
        y: 1,
        yanchor: 'bottom',
        text: '<b>ln(S)</b>',
        font: {size: 10},
        showarrow: false
      }],
      xaxis: {
        title: {
          text: '<b>Probability</b>',
          font: {size: 10}
        },
        tickfont: {size: 10}
      },
      yaxis: {
        tickfont: {size: 10}
      },
      showlegend: false,
      bargroupgap: 0.1,
      width: width2,
      height: width1 * 0.72,
      margin: {
        l: 30,
        r: 10,
        b: 25,
        t: 30,
      },
      paper_bgcolor: "#ffffff",
      plot_bgcolor:"#ffffff"
  };

  var config = {
    modeBarButtonsToRemove: ['zoom2d','select2d','pan2d','lasso2d','resetScale2d','zoomOut2d','zoomIn2d','toggleSpikelines'],
    modeBarButtonsToAdd: [{
      name: 'info',
      icon: Plotly.Icons.question,
      click: ()=>{
        $('#exampleModalCenter2').modal('show');
      }}]
  };

  Plotly.newPlot('bmdPlot', data2, layout2, config);
}

function update_bmddPlot(bmm) {
  var mu = parseFloat(document.getElementById('mu_slider').value);
  var sigma = parseFloat(document.getElementById('sigma_slider').value);
  var dt = parseFloat(document.getElementById('dt').value);
  var N = parseFloat(document.getElementById('simulation').value);
  var t1 = parseFloat(document.getElementById('t1_slider').value);
  var t2 = parseFloat(document.getElementById('t2_slider').value);

  var bb = document.querySelector ('#bmddPlot').getBoundingClientRect();
  var width = (bb.right - bb.left) - 20;

  var xx1 = [];
  for (var i = 0; i < N; i++){
      xx1.push(bmm[i][Math.round(t1/dt)]);
  }

  var xx2 = [];
  for (var i = 0; i < N; i++){
      xx2.push(bmm[i][Math.round(t2/dt)]);
  }

  var data3 = [
      {
          x: xx1,
          type: 'histogram',
          histnorm: 'probability',
          marker: {
              color: '#2f89a0',
          },
          autobinx: false,
          xbins:{
            start: Math.min(xx1),
            size: Math.abs(mu) / 10 * dt + Math.pow(sigma, 0.99) * Math.pow(dt, 0.25)
          },
          opacity: 0.5
      },
      {
          x: xx2,
          type: 'histogram',
          histnorm: 'probability', 
          marker: {
              color: '#eca62c',
          },
          autobinx: false,
          xbins:{
            start: Math.min(xx2),
            size: Math.abs(mu) / 10 * dt + Math.pow(sigma, 0.99) * Math.pow(dt, 0.25)
          },
          opacity: 0.5
      }
  ];

  var layout3 = {
      title: {
        font: {size: 12},
        text: '<b>Brownian Motion Distribution</b>'
      },
      annotations: [{
        xref: 'paper',
        yref: 'paper',
        x: 0,
        xanchor: 'right',
        y: 1,
        yanchor: 'bottom',
        text: '<b>Prob.</b>',
        font: {size: 10},
        showarrow: false
      }],
      xaxis: {
        title: {
          text: '<b>ln(S)</b>',
          font: {size: 10}
        },
        tickfont: {size: 10}
      },
      yaxis: {
        tickfont: {size: 10}
      },
      showlegend: false,
      bargroupgap: 0.1, 
      barmode: "overlay",
      width: width,
      height: width * 0.25,
      margin: {
        l: 35,
        r: 10,
        b: 25,
        t: 25,
      },
      paper_bgcolor: "#ffffff",
      plot_bgcolor:"#ffffff"
  };    
  
  var config = {
    modeBarButtonsToRemove: ['zoom2d','select2d','pan2d','lasso2d','resetScale2d','zoomOut2d','zoomIn2d','toggleSpikelines'],
    modeBarButtonsToAdd: [{
      name: 'info',
      icon: Plotly.Icons.question,
      click: ()=>{
        $('#exampleModalCenter3').modal('show');
      }}]
  };

  Plotly.newPlot('bmddPlot', data3, layout3, config);
}

function gbm() {
  var mu = parseFloat(document.getElementById('mu_slider').value);
  var sigma = parseFloat(document.getElementById('sigma_slider').value);
  var S0 = parseFloat(document.getElementById('S0_slider').value);
  var dt = parseFloat(document.getElementById('dt').value);
  var N = parseFloat(document.getElementById('simulation').value);
  var steps = 1/dt;

  var gbmm = Array2DVar(N, steps+1);
  for (var i = 0; i < N; i++){
      gbmm[i][0] = S0;
      for (var j = 1; j < steps+1; j++){
          gbmm[i][j] = gbmm[i][j-1] * Math.exp((mu - Math.pow(sigma, 2) / 2) * dt + sigma * Math.sqrt(dt) * random_nm());
      }
  }

  return gbmm;
}

function update_gbmPlot(gbmm) {
  var dt = parseFloat(document.getElementById('dt').value);
  var paths = parseFloat(document.getElementById('paths_slider').value);
  var t1 = parseFloat(document.getElementById('t1_slider').value);
  var t2 = parseFloat(document.getElementById('t2_slider').value);

  var bb1 = document.querySelector ('#gbmPlot').getBoundingClientRect();
  var width = (bb1.right - bb1.left) - 20;   

  var data1 = [];    

  var xdata = [];
  for (var i = 0; i < paths; i++){
      xdata.push(range(0, dt, 1));
  }

  var ydata = gbmm.slice(0, paths);

  for(var i = 0; i < xdata.length; i++){
      var  result= {
          x: xdata[i],
          y: ydata[i],
          type: 'scatter',
          mode: 'lines',
          line: {
              dash: 'Solid',
              width: 1
          }
      };
      data1.push(result);
  }

  var layout1 = {
    title: {
      font: {size: 12},
      text: '<b>Geometric Brownian Motion</b>'
    },
    annotations: [{
      xref: 'paper',
      yref: 'paper',
      x: 0,
      xanchor: 'right',
      y: 1,
      yanchor: 'bottom',
      text: '<b>S</b>',
      font: {size: 10},
      showarrow: false
    }],
    xaxis: {
      title: {
        text: '<b>Time</b>',
        font: {size: 10}
      },
      tickfont: {size: 10}
    },
    yaxis: {
      tickfont: {size: 10}
    },
    showlegend: false,
    shapes: [
      { 
          type: 'line', 
          yref: 'paper',
          x0: t1,
          y0: 0, 
          x1: t1, 
          y1: 1, 
          line: { 
              color: '#2f89a0', 
              width: 2.5, 
              dash: 'dash' 
          }
      },
      {
          type: 'line', 
          yref: 'paper',
          x0: t2,
          y0: 0, 
          x1: t2, 
          y1: 1, 
          line: { 
              color: '#eca62c', 
              width: 2.5, 
              dash: 'dash' 
          }
      }],
    width: width,
    height: width * 0.72,
    margin: {
      l: 30,
      r: 10,
      b: 25,
      t: 25,
    },
    paper_bgcolor: "#ffffff",
    plot_bgcolor:"#ffffff",
    hovermode: 'closest'
  };

  var config = {
    modeBarButtonsToRemove: ['zoom2d','select2d','pan2d','lasso2d','resetScale2d','zoomOut2d','zoomIn2d','toggleSpikelines'],
    modeBarButtonsToAdd: [{
      name: 'info',
      icon: Plotly.Icons.question,
      click: ()=>{
        $('#exampleModalCenter4').modal('show');
      }}]
  };

  Plotly.newPlot('gbmPlot', data1, layout1, config);
}

function update_gbmdPlot(gbmm){
  var mu = parseFloat(document.getElementById('mu_slider').value);
  var sigma = parseFloat(document.getElementById('sigma_slider').value);
  var dt = parseFloat(document.getElementById('dt').value);
  var N = parseFloat(document.getElementById('simulation').value);
  var steps = 1/dt;

  var bb1 = document.querySelector ('#gbmPlot').getBoundingClientRect();
  var width1 = (bb1.right - bb1.left) - 20;
  var bb2 = document.querySelector ('#gbmdPlot').getBoundingClientRect();
  var width2 = (bb2.right - bb2.left) - 20;

  var yy = [];
  for (var i = 0; i < N; i++){
      yy.push(gbmm[i][steps]);
  }

  var data2 = [{
      y: yy,
      type: 'histogram',
      histnorm: 'probability',
      marker: {
          color: '#628ea5',
      },
      autobiny: false,
      ybins:{
        start: Math.min(yy),
        size: Math.exp((Math.abs(mu) - Math.pow(sigma, 2)) * dt + sigma*4.5) * 2
      }
  }];

  var layout2 = {
      title: {
        font: {size: 10},
        text: '<b>Geometric Brownian Motion Dist.</b>'
      },
      annotations: [{
        xref: 'paper',
        yref: 'paper',
        x: 0,
        xanchor: 'right',
        y: 1,
        yanchor: 'bottom',
        text: '<b>S</b>',
        font: {size: 10},
        showarrow: false
      }],
      xaxis: {
        title: {
          text: '<b>Probability</b>',
          font: {size: 10}
        },
        tickfont: {size: 10}
      },
      yaxis: {
        tickfont: {size: 10}
      },
      showlegend: false,
      bargroupgap: 0.1,
      width: width2,
      height: width1 * 0.72,
      margin: {
        l: 30,
        r: 10,
        b: 25,
        t: 30,
      },
      paper_bgcolor: "#ffffff",
      plot_bgcolor:"#ffffff"
  };

  var config = {
    modeBarButtonsToRemove: ['zoom2d','select2d','pan2d','lasso2d','resetScale2d','zoomOut2d','zoomIn2d','toggleSpikelines'],
    modeBarButtonsToAdd: [{
      name: 'info',
      icon: Plotly.Icons.question,
      click: ()=>{
        $('#exampleModalCenter5').modal('show');
      }}]
  };

  Plotly.newPlot('gbmdPlot', data2, layout2, config);
}

function update_gbmddPlot(gbmm) {
  var mu = parseFloat(document.getElementById('mu_slider').value);
  var sigma = parseFloat(document.getElementById('sigma_slider').value);
  var dt = parseFloat(document.getElementById('dt').value);
  var N = parseFloat(document.getElementById('simulation').value);
  var t1 = parseFloat(document.getElementById('t1_slider').value);
  var t2 = parseFloat(document.getElementById('t2_slider').value);

  var bb = document.querySelector ('#gbmddPlot').getBoundingClientRect();
  var width = (bb.right - bb.left) - 20;

  var xx1 = [];
  for (var i = 0; i < N; i++){
      xx1.push(gbmm[i][Math.round(t1/dt)]);
  }

  var xx2 = [];
  for (var i = 0; i < N; i++){
      xx2.push(gbmm[i][Math.round(t2/dt)]);
  }

  var data3 = [
      {
        x: xx1,
        type: 'histogram',
        histnorm: 'probability',                     
        marker: {
            color: '#2f89a0',
        },
        autobinx: false,
        xbins:{
          start: Math.min(xx1),
          size: Math.exp((Math.abs(mu) - Math.pow(sigma, 2)) * dt + sigma * 4) * 2
        },
        opacity: 0.5
      },
      {
        x: xx2,
        type: 'histogram',
        histnorm: 'probability',                    
        marker: {
            color: '#eca62c',
        },
        autobinx: false,
        xbins:{
          start: Math.min(xx2),
          size: Math.exp((Math.abs(mu) - Math.pow(sigma, 2)) * dt + sigma * 4) * 2
        },
        opacity: 0.5
      }
  ];    

  var layout3 = {
      title: {
        font: {size: 12},
        text: '<b>Geometric Brownian Motion Distribution</b>'
      },
      annotations: [{
        xref: 'paper',
        yref: 'paper',
        x: 0,
        xanchor: 'right',
        y: 1,
        yanchor: 'bottom',
        text: '<b>Prob.</b>',
        font: {size: 10},
        showarrow: false
      }],
      xaxis: {
        title: {
          text: '<b>S</b>',
          font: {size: 10}
        },
        tickfont: {size: 10}
      },
      yaxis: {
        tickfont: {size: 10}
      },
      showlegend: false,
      bargroupgap: 0.1, 
      barmode: "overlay",
      width: width,
      height: width * 0.25,
      margin: {
        l: 35,
        r: 10,
        b: 25,
        t: 25,
      },
      paper_bgcolor: "#ffffff",
      plot_bgcolor:"#ffffff"
  };
  
  var config = {
    modeBarButtonsToRemove: ['zoom2d','select2d','pan2d','lasso2d','resetScale2d','zoomOut2d','zoomIn2d','toggleSpikelines'],
    modeBarButtonsToAdd: [{
      name: 'info',
      icon: Plotly.Icons.question,
      click: ()=>{
        $('#exampleModalCenter6').modal('show');
      }}]
  };
  
  Plotly.newPlot('gbmddPlot', data3, layout3, config);    
}

function update_Simulated(bmm,gbmm) {  
  var dt = parseFloat(document.getElementById('dt').value);
  var N = parseFloat(document.getElementById('simulation').value);
  var K = parseFloat(document.getElementById('K_slider').value);
  var steps = 1/dt;

  var yy1 = [];
  for (var i = 0; i < N; i++){
    yy1.push(bmm[i][steps]);
  }

  var mean1 = yy1.reduce((a, b) => a+b) / yy1.length;
  var var1 = yy1.map(x => Math.pow(x - mean1, 2)).reduce((a, b) => a+b) / yy1.length;
  var skew1 = yy1.map(x => Math.pow((x - mean1)/Math.sqrt(var1), 3)).reduce((a, b) => a+b) / yy1.length;
  var kurt1 = yy1.map(x => Math.pow((x - mean1)/Math.sqrt(var1), 4)).reduce((a, b) => a+b) / yy1.length;
  var call1 = yy1.map(x => Math.max(x - Math.log(K), 0)).reduce((a, b) => a+b) / yy1.length;
  var put1 = yy1.map(x => Math.max(Math.log(K) - x, 0)).reduce((a, b) => a+b) / yy1.length;

  mean_1s.innerHTML = mean1.toFixed(4);
  var_1s.innerHTML = var1.toFixed(4);
  skew_1s.innerHTML = skew1.toFixed(4);
  kurt_1s.innerHTML = kurt1.toFixed(4);
  call_1s.innerHTML = call1.toFixed(4);
  put_1s.innerHTML = put1.toFixed(4);

  var yy2 = [];
  for (var i = 0; i < N; i++){
    yy2.push(gbmm[i][steps]);
  }

  var mean2 = yy2.reduce((a, b) => a += b) / yy2.length;
  var var2 = yy2.map(x => Math.pow(x - mean2, 2)).reduce((a, b) => a+b) / yy2.length;
  var skew2 = yy2.map(x => Math.pow((x - mean2)/Math.sqrt(var2), 3)).reduce((a, b) => a+b) / yy2.length;
  var kurt2 = yy2.map(x => Math.pow((x - mean2)/Math.sqrt(var2), 4)).reduce((a, b) => a+b) / yy2.length;
  var call2 = yy2.map(x => Math.max(x - K, 0)).reduce((a, b) => a+b) / yy2.length;
  var put2 = yy2.map(x => Math.max(K - x, 0)).reduce((a, b) => a+b) / yy2.length;

  mean_2s.innerHTML = mean2.toFixed(4);
  var_2s.innerHTML = var2.toFixed(4);
  skew_2s.innerHTML = skew2.toFixed(4);
  kurt_2s.innerHTML = kurt2.toFixed(4);
  call_2s.innerHTML = call2.toFixed(4);
  put_2s.innerHTML = put2.toFixed(4);
}

function update_Analytical() {
  var mu = parseFloat(document.getElementById('mu_slider').value);
  var sigma = parseFloat(document.getElementById('sigma_slider').value);
  var S0 = parseFloat(document.getElementById('S0_slider').value);
  var K = parseFloat(document.getElementById('K_slider').value);
  var x0 = Math.log(S0);
  var t = 1;
  var d = (x0 + mu * t - Math.log(K)) / (sigma * Math.sqrt(t));
  var d1 = (Math.log(S0 / K) + mu * t) / (sigma * Math.sqrt(t)) + 0.5 * (sigma * Math.sqrt(t));
  var d2 = d1 - sigma * Math.sqrt(t)


  var mean1 = x0 + mu * t;
  var var1 = Math.pow(sigma, 2) * t;
  var skew1 = 0;
  var kurt1 = 3;
  var call1 = sigma * Math.sqrt(t) * normalPDF(d) + (x0 + mu * t - Math.log(K)) * N(d);
  var put1 = sigma * Math.sqrt(t) * normalPDF(-d) + (-x0 - mu * t + Math.log(K)) * N(-d);

  var mean2 = S0 * Math.exp(mu * t);
  var var2 = Math.pow(S0, 2) * (Math.exp(Math.pow(sigma, 2) * t) - 1) * Math.exp(2 * mu * t);
  var skew2 = (Math.exp(Math.pow(sigma, 2) * t) + 2) * Math.pow(Math.exp(Math.pow(sigma, 2) * t) - 1, 1 / 2);
  var kurt2 = Math.exp(4 * Math.pow(sigma, 2) * t) + 2 * Math.exp(3 * Math.pow(sigma, 2) * t) + 3 * Math.exp(2 * Math.pow(sigma, 2) * t)- 3;
  var call2 = S0 * Math.exp(mu * t) * N(d1) - K * N(d2);
  var put2 = -S0 * Math.exp(mu * t) * N(-d1) + K * N(-d2);

  mean_1a.innerHTML = mean1.toFixed(4);
  var_1a.innerHTML = var1.toFixed(4);
  skew_1a.innerHTML = skew1.toFixed(4);
  kurt_1a.innerHTML = kurt1.toFixed(4);
  call_1a.innerHTML = call1.toFixed(4);
  put_1a.innerHTML = put1.toFixed(4);

  mean_2a.innerHTML = mean2.toFixed(4);
  var_2a.innerHTML = var2.toFixed(4);
  skew_2a.innerHTML = skew2.toFixed(4);
  kurt_2a.innerHTML = kurt2.toFixed(4);
  call_2a.innerHTML = call2.toFixed(4);
  put_2a.innerHTML = put2.toFixed(4);
}

// Update the current slider value (each time you drag the slider handle)
mu_slider.oninput = function() {
  mu_output.innerHTML = this.value;
}
mu_slider.onchange = function() {
  // bmm = bm();
  // gbmm = gbm();
  // update_bmPlot(bmm);
  // update_bmdPlot(bmm);
  // update_bmddPlot(bmm);
  // update_gbmPlot(gbmm);
  // update_gbmdPlot(gbmm);
  // update_gbmddPlot(gbmm);
  // update_Simulated(bmm,gbmm);
  // update_Analytical();
}

// Update the current slider value (each time you drag the slider handle)
sigma_slider.oninput = function() {
  sigma_output.innerHTML = this.value;
}
sigma_slider.onchange = function() {
  // bmm = bm();
  // gbmm = gbm();
  // update_bmPlot(bmm);
  // update_bmdPlot(bmm);
  // update_bmddPlot(bmm);
  // update_gbmPlot(gbmm);
  // update_gbmdPlot(gbmm);
  // update_gbmddPlot(gbmm);
  // update_Simulated(bmm,gbmm);
  // update_Analytical();
}

// Update the current slider value (each time you drag the slider handle)
dt.onchange = function() {
  dt_output.innerHTML = this.value;
  t1_slider.step = this.value;
  t2_slider.step = this.value;
  // bmm = bm();
  // gbmm = gbm();
  // update_bmPlot(bmm);
  // update_bmdPlot(bmm);
  // update_bmddPlot(bmm);
  // update_gbmPlot(gbmm);
  // update_gbmdPlot(gbmm);
  // update_gbmddPlot(gbmm);
  // update_Simulated(bmm,gbmm);
  // update_Analytical();
}

// Update the current slider value (each time you drag the slider handle)
paths_slider.oninput = function() {
  paths_output.innerHTML = this.value;
}
paths_slider.onchange = function() {
  update_bmPlot(bmm);
  update_gbmPlot(gbmm);
}

// Update the current slider value (each time you drag the slider handle)
K_slider.oninput = function() {
  K_output.innerHTML = this.value;
  lnK.innerHTML = Math.log(this.value).toFixed(4);
  update_Simulated(bmm,gbmm);
  update_Analytical();
}

// Update the current slider value (each time you drag the slider handle)
S0_slider.oninput = function() {
  S0_output.innerHTML = this.value;
  lnS0.innerHTML = Math.log(this.value).toFixed(4);
}
// S0_slider.onchange = function() {
//   bmm = bm();
//   gbmm = gbm();
//   update_bmPlot(bmm);
//   update_bmdPlot(bmm);
//   update_bmddPlot(bmm);
//   update_gbmPlot(gbmm);
//   update_gbmdPlot(gbmm);
//   update_gbmddPlot(gbmm);
//   update_Simulated(bmm,gbmm);
//   update_Analytical();
// }

// Update the current slider value (each time you drag the slider handle)
t1_slider.oninput = function() {
  t1_output.innerHTML = this.value;
  update_bmPlot(bmm);
  update_bmddPlot(bmm);
  update_gbmPlot(gbmm);
  update_gbmddPlot(gbmm);
}

// Update the current slider value (each time you drag the slider handle)
t2_slider.oninput = function() {
  t2_output.innerHTML = this.value;
  update_bmPlot(bmm);
  update_bmddPlot(bmm);
  update_gbmPlot(gbmm);
  update_gbmddPlot(gbmm);
}

simulation.onchange = function() {
  N_output.innerHTML = this.value;
  // bmm = bm();
  // gbmm = gbm();
  // update_bmPlot(bmm);
  // update_bmdPlot(bmm);
  // update_bmddPlot(bmm);
  // update_gbmPlot(gbmm);
  // update_gbmdPlot(gbmm);
  // update_gbmddPlot(gbmm);
  // update_Simulated(bmm,gbmm);
  // update_Analytical();
}

function update_allPlot() {  
  update_bmPlot(bmm);
  update_bmdPlot(bmm);
  update_bmddPlot(bmm);
  update_gbmPlot(gbmm);
  update_gbmdPlot(gbmm);
  update_gbmddPlot(gbmm);
  update_Simulated(bmm,gbmm);
  update_Analytical();
}

function simulate() {
  bmm = bm();
  gbmm = gbm();
  update_bmPlot(bmm);
  update_bmdPlot(bmm);
  update_bmddPlot(bmm);
  update_gbmPlot(gbmm);
  update_gbmdPlot(gbmm);
  update_gbmddPlot(gbmm);
  update_Simulated(bmm,gbmm);
  update_Analytical();
}

var bmm = bm();
var gbmm = gbm();
update_allPlot();

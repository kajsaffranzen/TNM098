function sp(){
	var self = this; // for internal d3 functions
    
    var spDiv = $("#sp");
    var margin = {top: 20, right: 20, bottom: 50, left: 50},
    width = spDiv.width() - margin.left - margin.right,
    height = spDiv.height() - margin.top - margin.bottom;

    //initialize tooltip
    var tip = d3.select("#sp").append("div")
    .attr("class", "tooltip")               
    .style("opacity", 0);

    // create scale functions
    var x = d3.scale.linear()
      .range([0, width]);

    var y = d3.scale.linear()
    .range([height, 0]);

    var radius = d3.scale.linear()
    .range([2, 8]);

    var xAxis = d3.svg.axis()
    	.scale(x)
    	.orient("bottom");

    var yAxis = d3.svg.axis()
    	.scale(y)
    	.orient("left");

    var svg = d3.select("#sp").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	    .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



	 //Load data
    d3.tsv("EyeTrack-raw.tsv", function(error, data){
    	if(error) throw error;

    	self.data = data;
    	x.domain([0, d3.max(data, function(d) { return d["GazePointX(px)"]; })]);
        y.domain([0, d3.max(data, function(d) { return d["GazePointY(px)"]; })]);
    	draw();
    });

 	d3.select("#slider").on("input", function () {
	      timeFilter(this.value, self.data);
	  });

  

    //draw dots in the scatterplot
   function draw(){

    	radius.domain(d3.extent(self.data, function(d) { return d["GazeEventDuration(mS)"]; })).nice();

    	//create x-axis
	    svg.append("g")
		    .attr("class", "x axis")
		    .attr("transform", "translate(0," + height +")")
		    .call(xAxis);

	    //create y-axis
	    svg.append("g")
		    .attr("class", "y axis")
		    .attr("transform", "translate("+1+"," + 0 +")")
		    .call(yAxis);

	    // Add x-axis label
	    svg.append("text")
	        .attr("class", "x label")
	        .attr("text-anchor", "end")
	        .attr("x", width/1.5)
	        .attr("y", height + 40)
	        .text("GazePointX(px)");

	    // Add y-axis label
	    svg.append("text")
	        .attr("class", "y label")
	        .attr("text-anchor", "end")
	        .attr("y", -48)
	        .attr("x", -100)
	        .attr("dy", ".75em")
	        .attr("transform", "rotate(-90)")
		    .text("GazePointY(px)");

    	svg.selectAll(".dot")
      		.data(self.data)
      		.enter()
      		.append("circle")
      		.attr("class", "dot")
	      	.attr("cx", function(d,i) {
	      		if( y(d["GazePointX(px)"]) == "515.4068479355489"){
	      			console.log(i)
	      		}
	      		
	      		return x(d["GazePointX(px)"]);
	      	})
	      	.attr("cy", function(d, i) {
	      		
	      		if( y(d["GazePointY(px)"]) == "408.6956055734191"){
	      			console.log("hallåja: "+ i)

	      		}
	      		return y(d["GazePointY(px)"])
	      	})
	      	.attr("r", function(d) {
	      		return radius(d["GazeEventDuration(mS)"]);
	      	})
      		.attr("fill", "#00aa88");

   }

   function timeFilter(value)
	{
	    document.getElementById("slider-value").innerHTML = value;
	    svg.selectAll("circle").style("opacity", function(d) {
	    	//console.log("Slider value: " + value);
	    	//console.log("Time: " + d["RecordingTimestamp"]);
	        return (parseFloat(d["RecordingTimestamp"]) < value)  ? 1 : 0;
	    });

	}


}
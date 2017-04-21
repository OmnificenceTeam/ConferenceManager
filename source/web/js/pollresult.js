
function onLoaded() {
    $('#genGraph').html('');
    var genH = '<div class="visible-md visible-lg">' +
                    '<canvas id="cvs" width="500" height="430">[No canvas support]</canvas>' +
                '</div>' +
               ' <div class="visible-xs visible-sm">' +
                   '<canvas id="cvs2" width="300" height="230">[No canvas support]</canvas>' +
                '</div>';
    $('#genGraph').html(genH);

    var data = new PollResult();
    data.QuestionId = 0;
    var request = new ViewPollResult(data);
    var result = DoService(request);
    if (result != null)
        PlotChart(result);
}

function PlotChart(result) {
	var PollOptions = ['A', 'B', 'C', 'D', 'E', 'F'];
    var Datax = new Array();
    var Datay = new Array();
    var DatayStr = new Array();
    var totalhits = 0;

    for (var index = 0; index < result.length; index++) {
        totalhits += parseInt(result[index].y);
    }
	
	var poll = 0;
	if(result.length != undefined){
		poll = result[0].z;
		if(poll != 0){
			for (var index = 0; index < poll; index++) {
				Datax.push("Option\n" + PollOptions[index]);
				Datay.push(0);
				DatayStr.push("");
			}

			for (var index = 0; index < result.length; index++) {
				var y = ((parseInt(result[index].y) / totalhits) * 100);
				var yStr = (((parseInt(result[index].y) / totalhits) * 100) + "%");
				if (result[index].x == 'A') {
					Datay[0] = y;
					DatayStr[0] = yStr;
				}
				else if (result[index].x == 'B') {
					Datay[1] = y;
					DatayStr[1] = yStr;
				}
				else if (result[index].x == 'C') {
					Datay[2] = y;
					DatayStr[2] = yStr;
				}
				else if (result[index].x == 'D') {
					Datay[3] = y;
					DatayStr[3] = yStr;
				}
				else if (result[index].x == 'E') {
					Datay[4] = y;
					DatayStr[4] = yStr;
				}
				else if (result[index].x == 'F') {
					Datay[5] = y;
					DatayStr[5] = yStr;
				}
			}
			
			Datay.length = poll;
		}	
	
		else {
			// Push all 6 options into X and Y Axis
			for (var index = 0; index < 6; index++) {
				Datax.push("Option\n" + PollOptions[index]);
				Datay.push(0);
				DatayStr.push('');
			}	

			// Get Y Axis result from the server result
			for (var index = 0; index < result.length; index++) {
				var y = ((parseInt(result[index].y) / totalhits) * 100);
				var yStr = (((parseInt(result[index].y) / totalhits) * 100) + "%");
				if (result[index].x == 'A') {
					Datay[0] = y;
					DatayStr[0] = yStr;
				}
				else if (result[index].x == 'B') {
					Datay[1] = y;
					DatayStr[1] = yStr;
				}
				else if (result[index].x == 'C') {
					Datay[2] = y;
					DatayStr[2] = yStr;
				}
				else if (result[index].x == 'D') {
					Datay[3] = y;
					DatayStr[3] = yStr;
				}
				else if (result[index].x == 'E') {
					Datay[4] = y;
					DatayStr[4] = yStr;
				}
				else if (result[index].x == 'F') {
					Datay[5] = y;
					DatayStr[5] = yStr;
				}
			}
		}
	}
	
    var barGraph_1 = null;
    var barGraph_2 = null;

    window.setTimeout(function () {
        barGraph_1 = new RGraph.Bar('cvs', Datay)
                        .Set('colors', ['#005585'])
	                    .Set('labels', Datax)
	                    .Set('numyticks', 5)
	                    .Set('ylabels.count', 5)
	                    .Set('hmargin', 7)
	                    .Set('gutter.left', 35)
	                    .Set('gutter.bottom', 35)
	                    .Set('units.post', '%')
	                    .Set('strokestyle', 'transparent')
	                    .Set('ymax', 100)
	                    .Set('hmargin.grouped', 0)
	                    .Set('scale.round', true)
	                    .Set('axis.linewidth', 2)
	                    .Set('text.size', 8)
	                    .Set('text.angle', 0)
	                    .Set('xlabels.offset', 5)
	                    .Set('background.grid', true)
	                    .Set('background.grid.dotted', true);
        barGraph_1.Draw();
        barGraph_2 = new RGraph.Bar('cvs2', Datay)
					    .Set('colors', ['#005585'])
					    .Set('labels', Datax)
					    .Set('numyticks', 5)
					    .Set('ylabels.count', 5)
					    .Set('hmargin', 7)
					    .Set('gutter.left', 35)
					    .Set('gutter.bottom', 35)
					    .Set('units.post', '%')
					    .Set('strokestyle', 'transparent')
					    .Set('ymax', 100)
					    .Set('hmargin.grouped', 0)
					    .Set('scale.round', true)
					    .Set('axis.linewidth', 2)
					    .Set('text.size', 8)
					    .Set('text.angle', 0)
					    .Set('xlabels.offset', 5)
					    .Set('background.grid', true)
					    .Set('background.grid.dotted', true);
        barGraph_2.Draw();
    }, 1000)

}